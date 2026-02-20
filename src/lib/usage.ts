import type { SupabaseClient } from "@supabase/supabase-js";
import { DAILY_LIMIT } from "./constants";

/**
 * 日本時間（UTC+9）の当日0:00をUTC Dateとして返す
 */
export function getTodayStartJST(): Date {
  const now = new Date();
  const jstOffset = 9 * 60; // 日本時間は UTC+9
  const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000);
  const jstMidnight = new Date(
    jstNow.getFullYear(),
    jstNow.getMonth(),
    jstNow.getDate()
  );
  return new Date(jstMidnight.getTime() - jstOffset * 60 * 1000);
}

/**
 * 本日の利用回数を取得し、上限チェックを行う
 */
export async function checkDailyUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<{ todayCount: number; canPlay: boolean }> {
  const todayStartJST = getTodayStartJST();

  const { count, error } = await supabase
    .from("quiz_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("played_at", todayStartJST.toISOString());

  if (error) {
    throw error;
  }

  const todayCount = count ?? 0;
  return { todayCount, canPlay: todayCount < DAILY_LIMIT };
}
