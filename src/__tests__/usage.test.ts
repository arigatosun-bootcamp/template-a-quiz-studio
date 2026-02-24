import { describe, it, expect } from "vitest";
import { getTodayStartJST } from "@/lib/usage";

describe("getTodayStartJST", () => {
  it("返り値がDateオブジェクトである", () => {
    const result = getTodayStartJST();
    expect(result).toBeInstanceOf(Date);
  });

  it("返り値は現在時刻以前である", () => {
    const result = getTodayStartJST();
    expect(result.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("返り値は24時間以内の過去である", () => {
    const result = getTodayStartJST();
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    expect(result.getTime()).toBeGreaterThan(oneDayAgo);
  });

  it("連続で呼んでも同じ値を返す（同日内）", () => {
    const result1 = getTodayStartJST();
    const result2 = getTodayStartJST();
    expect(result1.getTime()).toBe(result2.getTime());
  });

  it("返り値の分・秒が0である（日の開始時刻）", () => {
    const result = getTodayStartJST();
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
    expect(result.getUTCMilliseconds()).toBe(0);
  });
});
