import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  unauthorized,
  badRequest,
  tooManyRequests,
  serverError,
} from "@/lib/api-error";
import {
  VALID_GENRES,
  VALID_DIFFICULTIES,
  PREFECTURES,
  DIFFICULTY_ORDER,
  QUESTIONS_PER_SESSION,
  type Genre,
  type Difficulty,
} from "@/lib/constants";
import { checkDailyUsage } from "@/lib/usage";
import { generateWithRetry } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    // 1. 認証チェック
    const auth = await getAuthenticatedUser();
    if (auth.error || !auth.user) {
      return unauthorized();
    }
    const { user, supabase } = auth;

    // 2. リクエストボディのバリデーション
    const body = await request.json();
    const { genre, difficulty } = body;

    if (
      !genre ||
      !difficulty ||
      !VALID_GENRES.includes(genre) ||
      !VALID_DIFFICULTIES.includes(difficulty)
    ) {
      return badRequest("ジャンルまたは難易度の値が不正です");
    }

    const typedGenre = genre as Genre;
    const typedDifficulty = difficulty as Difficulty;

    // 3. 利用上限チェック
    const { canPlay } = await checkDailyUsage(supabase, user.id);
    if (!canPlay) {
      return tooManyRequests(
        "本日の利用上限に達しました。明日またお楽しみください"
      );
    }

    // 4. 出題県の決定（未正解の県を優先）
    const { data: progress } = await supabase
      .from("prefecture_progress")
      .select("prefecture, max_difficulty")
      .eq("user_id", user.id);

    const clearedPrefectures = (progress ?? [])
      .filter(
        (p) =>
          DIFFICULTY_ORDER[p.max_difficulty as Difficulty] >=
          DIFFICULTY_ORDER[typedDifficulty]
      )
      .map((p) => p.prefecture);

    const unclearedPrefectures = PREFECTURES.filter(
      (p) => !clearedPrefectures.includes(p)
    );

    // ランダムに5県を選択
    let selectedPrefectures: string[];
    if (unclearedPrefectures.length >= QUESTIONS_PER_SESSION) {
      selectedPrefectures = shuffleArray([...unclearedPrefectures]).slice(
        0,
        QUESTIONS_PER_SESSION
      );
    } else {
      // 未正解が5県未満の場合、残りを全体からランダムに補充
      const remaining = QUESTIONS_PER_SESSION - unclearedPrefectures.length;
      const additionalPrefectures = shuffleArray(
        [...PREFECTURES].filter((p) => !unclearedPrefectures.includes(p))
      ).slice(0, remaining);
      selectedPrefectures = [
        ...unclearedPrefectures,
        ...additionalPrefectures,
      ];
    }

    // 5. セッション作成
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .insert({
        user_id: user.id,
        genre: typedGenre,
        difficulty: typedDifficulty,
        score: 0,
      })
      .select()
      .single();

    if (sessionError || !session) {
      console.error("セッション作成失敗:", sessionError);
      return serverError();
    }

    // 6. Gemini APIでクイズ生成（リトライ付き）
    let generatedQuizzes;
    try {
      generatedQuizzes = await generateWithRetry(
        typedGenre,
        typedDifficulty,
        selectedPrefectures
      );
    } catch {
      // 生成失敗 → セッションを削除
      await supabase.from("quiz_sessions").delete().eq("id", session.id);
      return serverError("問題の生成に失敗しました。もう一度お試しください");
    }

    // 7. クイズをDBに保存
    const quizRows = generatedQuizzes.map((q, index) => ({
      session_id: session.id,
      question_text: q.question,
      choice_1: q.choices[0],
      choice_2: q.choices[1],
      choice_3: q.choices[2],
      correct_answer: q.answer,
      explanation: q.explanation,
      genre: typedGenre,
      difficulty: typedDifficulty,
      prefecture: q.prefecture,
      question_order: index + 1,
    }));

    const { data: quizzes, error: quizError } = await supabase
      .from("quizzes")
      .insert(quizRows)
      .select();

    if (quizError || !quizzes) {
      console.error("クイズ保存失敗:", quizError);
      await supabase.from("quiz_sessions").delete().eq("id", session.id);
      return serverError();
    }

    // 8. レスポンス（正解・解説を除く）
    return NextResponse.json({
      sessionId: session.id,
      quizzes: quizzes.map((q) => ({
        id: q.id,
        questionOrder: q.question_order,
        questionText: q.question_text,
        choices: [q.choice_1, q.choice_2, q.choice_3],
        prefecture: q.prefecture,
      })),
    });
  } catch (error) {
    console.error("クイズ生成APIエラー:", error);
    return serverError();
  }
}

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
