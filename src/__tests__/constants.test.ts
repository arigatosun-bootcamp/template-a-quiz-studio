import { describe, it, expect } from "vitest";
import {
  VALID_GENRES,
  VALID_DIFFICULTIES,
  GENRE_LABELS,
  DIFFICULTY_LABELS,
  DIFFICULTY_ORDER,
  DAILY_LIMIT,
  QUESTIONS_PER_SESSION,
  PREFECTURES,
} from "@/lib/constants";

describe("constants", () => {
  describe("VALID_GENRES", () => {
    it("3つのジャンルが定義されている", () => {
      expect(VALID_GENRES).toHaveLength(3);
      expect(VALID_GENRES).toContain("geography");
      expect(VALID_GENRES).toContain("tourism");
      expect(VALID_GENRES).toContain("food");
    });

    it("全ジャンルにラベルが定義されている", () => {
      for (const genre of VALID_GENRES) {
        expect(GENRE_LABELS[genre]).toBeDefined();
        expect(typeof GENRE_LABELS[genre]).toBe("string");
      }
    });
  });

  describe("VALID_DIFFICULTIES", () => {
    it("3つの難易度が定義されている", () => {
      expect(VALID_DIFFICULTIES).toHaveLength(3);
      expect(VALID_DIFFICULTIES).toContain("beginner");
      expect(VALID_DIFFICULTIES).toContain("intermediate");
      expect(VALID_DIFFICULTIES).toContain("advanced");
    });

    it("全難易度にラベルが定義されている", () => {
      for (const diff of VALID_DIFFICULTIES) {
        expect(DIFFICULTY_LABELS[diff]).toBeDefined();
        expect(typeof DIFFICULTY_LABELS[diff]).toBe("string");
      }
    });

    it("難易度順序が正しい（beginner < intermediate < advanced）", () => {
      expect(DIFFICULTY_ORDER.beginner).toBeLessThan(
        DIFFICULTY_ORDER.intermediate
      );
      expect(DIFFICULTY_ORDER.intermediate).toBeLessThan(
        DIFFICULTY_ORDER.advanced
      );
    });
  });

  describe("PREFECTURES", () => {
    it("47都道府県が定義されている", () => {
      expect(PREFECTURES).toHaveLength(47);
    });

    it("北海道が含まれている", () => {
      expect(PREFECTURES).toContain("北海道");
    });

    it("沖縄県が含まれている", () => {
      expect(PREFECTURES).toContain("沖縄県");
    });

    it("重複がない", () => {
      const unique = new Set(PREFECTURES);
      expect(unique.size).toBe(PREFECTURES.length);
    });
  });

  describe("制限値", () => {
    it("DAILY_LIMITが正の整数", () => {
      expect(DAILY_LIMIT).toBeGreaterThan(0);
      expect(Number.isInteger(DAILY_LIMIT)).toBe(true);
    });

    it("QUESTIONS_PER_SESSIONが5", () => {
      expect(QUESTIONS_PER_SESSION).toBe(5);
    });
  });
});
