import { describe, it, expect } from "vitest";
import { checkDailyUsage } from "@/lib/usage";
import { DAILY_LIMIT } from "@/lib/constants";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Supabaseクライアントのモックを生成する */
function createMockSupabase(count: number | null, error: unknown = null) {
  const mock = {
    from: () => mock,
    select: () => mock,
    eq: () => mock,
    gte: () => Promise.resolve({ count, error }),
  } as unknown as SupabaseClient;
  return mock;
}

describe("checkDailyUsage", () => {
  it("利用回数が上限未満ならcanPlay: trueを返す", async () => {
    const supabase = createMockSupabase(3);
    const result = await checkDailyUsage(supabase, "user-1");

    expect(result.canPlay).toBe(true);
    expect(result.todayCount).toBe(3);
  });

  it("利用回数が上限以上ならcanPlay: falseを返す", async () => {
    const supabase = createMockSupabase(DAILY_LIMIT);
    const result = await checkDailyUsage(supabase, "user-1");

    expect(result.canPlay).toBe(false);
    expect(result.todayCount).toBe(DAILY_LIMIT);
  });

  it("Supabaseエラー時にthrowされる", async () => {
    const supabase = createMockSupabase(null, { message: "DB error" });

    await expect(checkDailyUsage(supabase, "user-1")).rejects.toEqual({
      message: "DB error",
    });
  });

  it("countがnullの場合todayCountは0になる", async () => {
    const supabase = createMockSupabase(null);
    const result = await checkDailyUsage(supabase, "user-1");

    expect(result.todayCount).toBe(0);
    expect(result.canPlay).toBe(true);
  });
});
