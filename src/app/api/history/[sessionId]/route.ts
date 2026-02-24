import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { unauthorized, notFound, serverError } from "@/lib/api-error";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    // 1. 認証チェック
    const auth = await getAuthenticatedUser();
    if (auth.error || !auth.user) {
      return unauthorized();
    }
    const { user, supabase } = auth;

    const { sessionId } = await params;

    // 2. セッションを取得
    const { data: session, error: sessionError } = await supabase
      .from("quiz_sessions")
      .select("id, genre, difficulty, score, played_at")
      .eq("id", sessionId)
      .eq("user_id", user.id)
      .single();

    if (sessionError || !session) {
      return notFound("セッションが見つかりません");
    }

    // 3. 全問題を取得
    const { data: quizzes, error: quizzesError } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        question_text,
        choice_1,
        choice_2,
        choice_3,
        correct_answer,
        explanation,
        prefecture,
        question_order
      `
      )
      .eq("session_id", sessionId)
      .order("question_order");

    if (quizzesError || !quizzes) {
      console.error("クイズ取得失敗:", quizzesError);
      return serverError();
    }

    // 4. 回答を取得
    const quizIds = quizzes.map((q) => q.id);
    const { data: answers, error: answersError } = await supabase
      .from("answers")
      .select("quiz_id, selected_answer, is_correct")
      .eq("user_id", user.id)
      .in("quiz_id", quizIds);

    if (answersError) {
      console.error("回答取得失敗:", answersError);
      return serverError();
    }

    // 5. 問題 + 回答を結合
    const answerMap = new Map(
      (answers ?? []).map((a) => [a.quiz_id, a])
    );

    const questions = quizzes.map((q) => {
      const answer = answerMap.get(q.id);
      return {
        questionOrder: q.question_order,
        questionText: q.question_text,
        choices: [q.choice_1, q.choice_2, q.choice_3],
        correctAnswer: q.correct_answer,
        explanation: q.explanation,
        prefecture: q.prefecture,
        selectedAnswer: answer?.selected_answer ?? null,
        isCorrect: answer?.is_correct ?? null,
      };
    });

    // 6. レスポンス
    return NextResponse.json({
      session: {
        id: session.id,
        genre: session.genre,
        difficulty: session.difficulty,
        score: session.score,
        playedAt: session.played_at,
      },
      questions,
    });
  } catch (error) {
    console.error("履歴詳細APIエラー:", error);
    return serverError();
  }
}
