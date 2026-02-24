import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { unauthorized, badRequest, serverError } from "@/lib/api-error";

export async function GET(request: Request) {
  try {
    // 1. 認証チェック
    const auth = await getAuthenticatedUser();
    if (auth.error || !auth.user) {
      return unauthorized();
    }
    const { user, supabase } = auth;

    // 2. クエリパラメータのバリデーション
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = parseInt(searchParams.get("limit") ?? "10", 10);

    if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1 || limit > 50) {
      return badRequest("ページ番号が不正です");
    }

    const offset = (page - 1) * limit;

    // 3. セッション一覧を取得
    const { data: sessions, count, error } = await supabase
      .from("quiz_sessions")
      .select("id, genre, difficulty, score, played_at", { count: "exact" })
      .eq("user_id", user.id)
      .order("played_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("履歴取得失敗:", error);
      return serverError();
    }

    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / limit);

    // 4. レスポンス
    return NextResponse.json({
      sessions: (sessions ?? []).map((s) => ({
        id: s.id,
        genre: s.genre,
        difficulty: s.difficulty,
        score: s.score,
        playedAt: s.played_at,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("履歴一覧APIエラー:", error);
    return serverError();
  }
}
