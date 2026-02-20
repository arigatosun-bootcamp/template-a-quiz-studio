import { describe, it, expect } from "vitest";
import { buildPrompt, parseQuizResponse } from "@/lib/gemini";

describe("gemini", () => {
  describe("buildPrompt", () => {
    it("ジャンル・難易度・都道府県を含むプロンプトを生成する", () => {
      const prompt = buildPrompt("geography", "beginner", [
        "東京都",
        "大阪府",
        "北海道",
        "沖縄県",
        "京都府",
      ]);

      expect(prompt).toContain("地理");
      expect(prompt).toContain("初級");
      expect(prompt).toContain("東京都");
      expect(prompt).toContain("大阪府");
    });

    it("5つの都道府県を含む", () => {
      const prefectures = ["青森県", "岩手県", "宮城県", "秋田県", "山形県"];
      const prompt = buildPrompt("food", "advanced", prefectures);

      for (const pref of prefectures) {
        expect(prompt).toContain(pref);
      }
    });
  });

  describe("parseQuizResponse", () => {
    const makeValidItems = (count = 5) =>
      Array.from({ length: count }, (_, i) => ({
        prefecture: `都道府県${i}`,
        question: `問題${i}`,
        choices: ["A", "B", "C"],
        answer: "A",
        explanation: `説明${i}`,
      }));

    it("正しいJSON配列をパースできる", () => {
      const result = parseQuizResponse(JSON.stringify(makeValidItems()));
      expect(result).toHaveLength(5);
      expect(result[0].prefecture).toBe("都道府県0");
      expect(result[0].choices).toHaveLength(3);
    });

    it("不正なJSONはエラーをthrowする", () => {
      expect(() => parseQuizResponse("これはJSONではありません")).toThrow();
    });

    it("問題数が5未満だとエラーをthrowする", () => {
      expect(() =>
        parseQuizResponse(JSON.stringify(makeValidItems(3)))
      ).toThrow();
    });

    it("選択肢が3つでない場合はエラーをthrowする", () => {
      const items = Array.from({ length: 5 }, () => ({
        prefecture: "東京都",
        question: "テスト",
        choices: ["A", "B"],
        answer: "A",
        explanation: "説明",
      }));
      expect(() => parseQuizResponse(JSON.stringify(items))).toThrow();
    });

    it("正解が選択肢に含まれない場合はエラーをthrowする", () => {
      const items = Array.from({ length: 5 }, () => ({
        prefecture: "東京都",
        question: "テスト",
        choices: ["A", "B", "C"],
        answer: "D",
        explanation: "説明",
      }));
      expect(() => parseQuizResponse(JSON.stringify(items))).toThrow();
    });

    it("マークダウンコードブロック内のJSONをパースできる", () => {
      const wrapped =
        "```json\n" + JSON.stringify(makeValidItems()) + "\n```";
      const result = parseQuizResponse(wrapped);
      expect(result).toHaveLength(5);
    });
  });
});
