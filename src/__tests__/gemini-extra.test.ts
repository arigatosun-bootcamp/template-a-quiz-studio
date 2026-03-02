import { describe, it, expect } from "vitest";
import { parseQuizResponse, buildPrompt } from "@/lib/gemini";
import {
  VALID_GENRES,
  VALID_DIFFICULTIES,
  GENRE_LABELS,
  DIFFICULTY_LABELS,
} from "@/lib/constants";

/** 有効な5問のクイズデータを生成する */
function makeValidItems(count = 5) {
  return Array.from({ length: count }, (_, i) => ({
    question: `問題${i}`,
    choices: ["A", "B", "C"],
    answer: "A",
    explanation: `説明${i}`,
    prefecture: `都道府県${i}`,
  }));
}

describe("parseQuizResponse 追加テスト", () => {
  it("questionが欠けている場合エラーをthrowする", () => {
    const items = makeValidItems();
    items[2] = { ...items[2], question: "" };
    expect(() => parseQuizResponse(JSON.stringify(items))).toThrow();
  });

  it("explanationが欠けている場合エラーをthrowする", () => {
    const items = makeValidItems();
    const broken = items.map((item, i) =>
      i === 0 ? { ...item, explanation: "" } : item
    );
    expect(() => parseQuizResponse(JSON.stringify(broken))).toThrow();
  });

  it("prefectureが欠けている場合エラーをthrowする", () => {
    const items = makeValidItems();
    const broken = items.map((item, i) =>
      i === 0 ? { ...item, prefecture: "" } : item
    );
    expect(() => parseQuizResponse(JSON.stringify(broken))).toThrow();
  });

  it("空文字列をパースした場合エラーをthrowする", () => {
    expect(() => parseQuizResponse("")).toThrow();
  });

  it("5問を超えるデータはエラーをthrowする", () => {
    const items = makeValidItems(6);
    expect(() => parseQuizResponse(JSON.stringify(items))).toThrow();
  });
});

describe("buildPrompt 全ジャンル・全難易度の組み合わせ", () => {
  const prefectures = ["東京都", "大阪府", "北海道", "福岡県", "沖縄県"];

  for (const genre of VALID_GENRES) {
    for (const difficulty of VALID_DIFFICULTIES) {
      it(`${GENRE_LABELS[genre]}×${DIFFICULTY_LABELS[difficulty]}の組み合わせで正しいプロンプトが生成される`, () => {
        const prompt = buildPrompt(genre, difficulty, prefectures);

        expect(prompt).toContain(GENRE_LABELS[genre]);
        expect(prompt).toContain(DIFFICULTY_LABELS[difficulty]);
        expect(prompt).toContain("5問");
        for (const pref of prefectures) {
          expect(prompt).toContain(pref);
        }
      });
    }
  }
});
