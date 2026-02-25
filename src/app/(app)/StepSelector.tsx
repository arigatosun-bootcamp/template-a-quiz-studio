"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  VALID_GENRES,
  VALID_DIFFICULTIES,
  GENRE_LABELS,
  DIFFICULTY_LABELS,
  type Genre,
  type Difficulty,
} from "@/lib/constants";
import styles from "./top.module.css";

const GENRE_ICONS: Record<Genre, string> = {
  geography: "🗾",
  tourism: "⛩️",
  food: "🍣",
};

const DIFFICULTY_ICONS: Record<Difficulty, string> = {
  beginner: "⭐",
  intermediate: "⭐⭐",
  advanced: "⭐⭐⭐",
};

interface StepSelectorProps {
  canPlay: boolean;
}

export default function StepSelector({ canPlay }: StepSelectorProps) {
  const router = useRouter();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleStart() {
    if (!genre || !difficulty || !canPlay) return;
    setLoading(true);
    router.push(`/quiz?genre=${genre}&difficulty=${difficulty}`);
  }

  return (
    <div>
      {/* Step 1: ジャンル選択 */}
      <div className={styles.stepSection}>
        <p className={styles.stepLabel}>
          <span className={styles.stepNumber}>1</span>
          ジャンルを選択
        </p>
        <div className={styles.optionGrid}>
          {VALID_GENRES.map((g) => (
            <button
              key={g}
              className={
                genre === g
                  ? styles.optionButtonSelected
                  : styles.optionButton
              }
              onClick={() => {
                setGenre(g);
                setDifficulty(null);
              }}
              disabled={!canPlay}
            >
              <span className={styles.optionIcon}>{GENRE_ICONS[g]}</span>
              {GENRE_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: 難易度選択 */}
      <div className={styles.stepSection}>
        <p className={styles.stepLabel}>
          <span className={styles.stepNumber}>2</span>
          難易度を選択
        </p>
        <div className={styles.optionGrid}>
          {VALID_DIFFICULTIES.map((d) => (
            <button
              key={d}
              className={
                difficulty === d
                  ? styles.optionButtonSelected
                  : styles.optionButton
              }
              onClick={() => setDifficulty(d)}
              disabled={!canPlay}
            >
              <span className={styles.optionIcon}>{DIFFICULTY_ICONS[d]}</span>
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: ゲームスタート */}
      <div className={styles.stepSection}>
        <p className={styles.stepLabel}>
          <span className={styles.stepNumber}>3</span>
          ゲームスタート
        </p>
        <button
          className={styles.startButton}
          disabled={!genre || !difficulty || !canPlay || loading}
          onClick={handleStart}
        >
          {loading ? "準備中..." : "クイズを始める"}
        </button>
      </div>
    </div>
  );
}
