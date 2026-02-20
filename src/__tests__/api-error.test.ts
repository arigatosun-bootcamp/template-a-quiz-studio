import { describe, it, expect } from "vitest";
import {
  unauthorized,
  badRequest,
  notFound,
  conflict,
  tooManyRequests,
  serverError,
} from "@/lib/api-error";

describe("api-error helpers", () => {
  it("unauthorized は 401 を返す", async () => {
    const res = unauthorized();
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("認証が必要です");
  });

  it("badRequest は 400 を返す", async () => {
    const res = badRequest("不正なリクエスト");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("不正なリクエスト");
  });

  it("notFound は 404 を返す", async () => {
    const res = notFound("見つかりません");
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toBe("見つかりません");
  });

  it("conflict は 409 を返す", async () => {
    const res = conflict("重複しています");
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("重複しています");
  });

  it("tooManyRequests は 429 を返す", async () => {
    const res = tooManyRequests("上限に達しました");
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.error).toBe("上限に達しました");
  });

  it("serverError はデフォルトメッセージで 500 を返す", async () => {
    const res = serverError();
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("サーバーエラーが発生しました");
  });

  it("serverError にカスタムメッセージを渡せる", async () => {
    const res = serverError("DB接続エラー");
    const body = await res.json();
    expect(body.error).toBe("DB接続エラー");
  });
});
