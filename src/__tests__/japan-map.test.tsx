import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import JapanMap from "@/components/JapanMap";
import type { Difficulty } from "@/lib/constants";

describe("JapanMap", () => {
  it("47都道府県分の<path>がレンダリングされる", () => {
    const { container } = render(
      <JapanMap prefectureProgress={[]} />
    );
    const paths = container.querySelectorAll("path");
    expect(paths).toHaveLength(47);
  });

  it("進捗なしの県はグレー色(#D1D5DB)になる", () => {
    const { container } = render(
      <JapanMap prefectureProgress={[]} />
    );
    const paths = container.querySelectorAll("path");
    for (const path of paths) {
      expect(path.getAttribute("fill")).toBe("#D1D5DB");
    }
  });

  it("各難易度に応じた色が正しく設定される", () => {
    const progress: { prefecture: string; maxDifficulty: Difficulty | null }[] = [
      { prefecture: "北海道", maxDifficulty: "beginner" },
      { prefecture: "青森県", maxDifficulty: "intermediate" },
      { prefecture: "岩手県", maxDifficulty: "advanced" },
    ];

    const { container } = render(
      <JapanMap prefectureProgress={progress} />
    );

    const paths = container.querySelectorAll("path");
    const pathMap = new Map<string, Element>();
    for (const p of paths) {
      const title = p.querySelector("title")?.textContent;
      if (title) pathMap.set(title, p);
    }

    expect(pathMap.get("北海道")?.getAttribute("fill")).toBe("#90C978");
    expect(pathMap.get("青森県")?.getAttribute("fill")).toBe("#5B8C3E");
    expect(pathMap.get("岩手県")?.getAttribute("fill")).toBe("#2D5A1E");
  });

  it("maxDifficultyがnullの県はグレー色になる", () => {
    const progress = [
      { prefecture: "東京都", maxDifficulty: null as Difficulty | null },
    ];

    const { container } = render(
      <JapanMap prefectureProgress={progress} />
    );

    const paths = container.querySelectorAll("path");
    const tokyo = Array.from(paths).find(
      (p) => p.querySelector("title")?.textContent === "東京都"
    );
    expect(tokyo?.getAttribute("fill")).toBe("#D1D5DB");
  });

  it("クリック時にonPrefectureClickが呼ばれる", () => {
    const onClick = vi.fn();
    const progress = [
      { prefecture: "沖縄県", maxDifficulty: "beginner" as Difficulty },
    ];

    const { container } = render(
      <JapanMap prefectureProgress={progress} onPrefectureClick={onClick} />
    );

    const paths = container.querySelectorAll("path");
    const okinawa = Array.from(paths).find(
      (p) => p.querySelector("title")?.textContent === "沖縄県"
    );

    fireEvent.click(okinawa!);

    expect(onClick).toHaveBeenCalledWith("沖縄県", "beginner");
  });
});
