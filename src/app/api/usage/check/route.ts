import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { unauthorized, serverError } from "@/lib/api-error";
import { DAILY_LIMIT } from "@/lib/constants";
import { checkDailyUsage } from "@/lib/usage";

export async function GET() {
  try {
    // 1. 認証チェック
    const auth = await getAuthenticatedUser();
    if (auth.error || !auth.user) {
      return unauthorized();
    }
    const { user, supabase } = auth;

    // 2. 利用回数チェック
    const { todayCount, canPlay } = await checkDailyUsage(supabase, user.id);
    const remaining = Math.max(0, DAILY_LIMIT - todayCount);

    // 3. レスポンス
    return NextResponse.json({
      todayCount,
      dailyLimit: DAILY_LIMIT,
      remaining,
      canPlay,
      ...(canPlay
        ? {}
        : {
            message:
              "本日の利用上限に達しました。明日またお楽しみください",
          }),
    });
  } catch (error) {
    console.error("利用回数チェックAPIエラー:", error);
    return serverError();
  }
}
