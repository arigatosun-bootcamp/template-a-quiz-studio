import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  unauthorized,
  badRequest,
  notFound,
  conflict,
  serverError,
} from "@/lib/api-error";

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
    const { quizId, selectedAnswer } = body;

    if (!quizId || !selectedAnswer) {
      return badRequest("quizId と selectedAnswer は必須です");
    }

    // 3. 問題を取得（自分のセッションの問題であることを確認）
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        correct_answer,
        explanation,
        session_id,
        quiz_sessions!inner(user_id)
      `
      )
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return notFound("問題が見つかりません");
    }

    // セッションのオーナーチェック（RLSでも制御されるが明示的に）
    const session = quiz.quiz_sessions as unknown as { user_id: string };
    if (session.user_id !== user.id) {
      return notFound("問題が見つかりません");
    }

    // 4. 重複回答チェック
    const { data: existingAnswer } = await supabase
      .from("answers")
      .select("id")
      .eq("quiz_id", quizId)
      .eq("user_id", user.id)
      .single();

    if (existingAnswer) {
      return conflict("この問題には既に回答しています");
    }

    // 5. 正解判定
    const isCorrect = selectedAnswer === quiz.correct_answer;

    // 6. 回答を保存
    const { data: answer, error: answerError } = await supabase
      .from("answers")
      .insert({
        user_id: user.id,
        quiz_id: quizId,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
      })
      .select()
      .single();

    if (answerError || !answer) {
      console.error("回答保存失敗:", answerError);
      return serverError();
    }

    // 7. レスポンス
    return NextResponse.json({
      answerId: answer.id,
      isCorrect,
      correctAnswer: quiz.correct_answer,
      explanation: quiz.explanation,
    });
  } catch (error) {
    console.error("回答APIエラー:", error);
    return serverError();
  }
}
