import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  unauthorized,
  badRequest,
  notFound,
  serverError,
} from "@/lib/api-error";
import {
  DIFFICULTY_ORDER,
  QUESTIONS_PER_SESSION,
  type Difficulty,
} from "@/lib/constants";

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
    const { sessionId } = body;

    if (!sessionId) {
      return badRequest("sessionId は必須です");
    }

    // 3. セッションを取得
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .select("id, user_id, difficulty")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return notFound("セッションが見つかりません");
    }

    // 4. 全問題と回答を取得
    const { data: quizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        prefecture,
        question_order,
        answers(id, is_correct)
      `
      )
      .eq("session_id", sessionId)
      .order("question_order");

    if (quizzesError || !quizzes) {
      console.error("クイズ取得失敗:", quizzesError);
      return serverError();
    }

    // 5. 全問回答済みチェック
    const answeredQuizzes = quizzes.filter(
      (q) => Array.isArray(q.answers) && q.answers.length > 0
    );
    if (answeredQuizzes.length < QUESTIONS_PER_SESSION) {
      return badRequest(
        "すべての問題に回答してからセッションを完了してください"
      );
    }

    // 6. スコア計算
    const score = quizzes.reduce((acc, q) => {
      const answers = q.answers as unknown as { id: string; is_correct: boolean }[];
      const isCorrect = answers.length > 0 && answers[0].is_correct;
      return acc + (isCorrect ? 1 : 0);
    }, 0);

    // 7. quiz_sessions の score を更新
    const { error: updateError } = await supabase
      .from("quiz_sessions")
      .update({ score })
      .eq("id", sessionId);

    if (updateError) {
      console.error("スコア更新失敗:", updateError);
      return serverError();
    }

    // 8. prefecture_progress を更新（正解した問題の都道府県のみ）
    const updatedPrefectures: {
      prefecture: string;
      maxDifficulty: string;
    }[] = [];
    const sessionDifficulty = session.difficulty as Difficulty;

    for (const quiz of quizzes) {
      const answers = quiz.answers as unknown as { id: string; is_correct: boolean }[];
      const isCorrect = answers.length > 0 && answers[0].is_correct;

      if (!isCorrect) continue;

      // 既存の進捗を取得
      const { data: existing } = await supabase
        .from("prefecture_progress")
        .select("max_difficulty")
        .eq("user_id", user.id)
        .eq("prefecture", quiz.prefecture)
        .single();

      if (!existing) {
        // レコードなし → INSERT
        await supabase.from("prefecture_progress").insert({
          user_id: user.id,
          prefecture: quiz.prefecture,
          max_difficulty: sessionDifficulty,
        });
        updatedPrefectures.push({
          prefecture: quiz.prefecture,
          maxDifficulty: sessionDifficulty,
        });
      } else if (
        DIFFICULTY_ORDER[sessionDifficulty] >
        DIFFICULTY_ORDER[existing.max_difficulty as Difficulty]
      ) {
        // 今回の難易度の方が上 → UPDATE
        await supabase
          .from("prefecture_progress")
          .update({
            max_difficulty: sessionDifficulty,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .eq("prefecture", quiz.prefecture);
        updatedPrefectures.push({
          prefecture: quiz.prefecture,
          maxDifficulty: sessionDifficulty,
        });
      } else {
        // 同じ or 低い → 変更なし（現在の値を返す）
        updatedPrefectures.push({
          prefecture: quiz.prefecture,
          maxDifficulty: existing.max_difficulty,
        });
      }
    }

    // 9. レスポンス
    return NextResponse.json({
      score,
      totalQuestions: QUESTIONS_PER_SESSION,
      updatedPrefectures,
    });
  } catch (error) {
    console.error("セッション完了APIエラー:", error);
    return serverError();
  }
}
