import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-error";
import {
  PREFECTURES,
  VALID_GENRES,
  DIFFICULTY_ORDER,
  type Difficulty,
} from "@/lib/constants";

export async function GET() {
  try {
    // 1. 認証チェック
    const auth = await getAuthenticatedUser();
    if (auth.error || !auth.user) {
      return unauthorized();
    }
    const { user, supabase } = auth;

    // 2. データを並行取得
    const [progressResult, answersResult] = await Promise.all([
      // 都道府県進捗
      supabase
        .from("prefecture_progress")
        .select("prefecture, max_difficulty")
        .eq("user_id", user.id),
      // 全回答（ジャンル情報付き）
      supabase
        .from("answers")
        .select(
          `
          is_correct,
          quiz:quizzes!inner(genre)
        `
        )
        .eq("user_id", user.id),
    ]);

    if (progressResult.error) {
      console.error("進捗取得失敗:", progressResult.error);
      return serverError();
    }

    if (answersResult.error) {
      console.error("回答取得失敗:", answersResult.error);
      return serverError();
    }

    const progress = progressResult.data ?? [];
    const answers = answersResult.data ?? [];

    // 3. 都道府県進捗の集計
    const prefectureProgress = progress.map((p) => ({
      prefecture: p.prefecture,
      maxDifficulty: p.max_difficulty,
    }));

    const clearedCount = progress.length;

    // 難易度別の制覇数
    const difficultyBreakdown: Record<string, number> = {
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    };
    for (const p of progress) {
      const diff = p.max_difficulty as Difficulty;
      // その難易度以下すべてにカウント（上級クリア = 初級・中級もクリア済み）
      for (const [key, order] of Object.entries(DIFFICULTY_ORDER)) {
        if (order <= DIFFICULTY_ORDER[diff]) {
          difficultyBreakdown[key]++;
        }
      }
    }

    // 4. 回答統計の集計
    const totalAnswers = answers.length;
    const totalCorrect = answers.filter((a) => a.is_correct).length;
    const overallAccuracy =
      totalAnswers > 0
        ? Math.round((totalCorrect / totalAnswers) * 1000) / 10
        : 0;

    // 5. ジャンル別統計
    const genreAccuracy: Record<
      string,
      { totalAnswers: number; totalCorrect: number; accuracy: number }
    > = {};

    for (const genre of VALID_GENRES) {
      const genreAnswers = answers.filter((a) => {
        const quiz = a.quiz as unknown as { genre: string };
        return quiz.genre === genre;
      });
      const genreCorrect = genreAnswers.filter((a) => a.is_correct).length;
      genreAccuracy[genre] = {
        totalAnswers: genreAnswers.length,
        totalCorrect: genreCorrect,
        accuracy:
          genreAnswers.length > 0
            ? Math.round((genreCorrect / genreAnswers.length) * 1000) / 10
            : 0,
      };
    }

    // 6. レスポンス
    return NextResponse.json({
      prefectureProgress,
      stats: {
        clearedCount,
        totalPrefectures: PREFECTURES.length,
        difficultyBreakdown,
        totalAnswers,
        totalCorrect,
        overallAccuracy,
        genreAccuracy,
      },
    });
  } catch (error) {
    console.error("達成状況APIエラー:", error);
    return serverError();
  }
}
