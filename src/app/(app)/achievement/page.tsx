"use client";

import { useEffect, useState } from "react";
import {
  GENRE_LABELS,
  DIFFICULTY_LABELS,
  PREFECTURES,
  type Genre,
  type Difficulty,
} from "@/lib/constants";
import JapanMap from "@/components/JapanMap";
import styles from "./achievement.module.css";

const GENRE_ICONS: Record<Genre, string> = {
  geography: "🗾",
  tourism: "⛩️",
  food: "🍣",
};

interface PrefectureProgress {
  prefecture: string;
  maxDifficulty: Difficulty;
}

interface Stats {
  clearedCount: number;
  totalPrefectures: number;
  difficultyBreakdown: Record<string, number>;
  totalAnswers: number;
  totalCorrect: number;
  overallAccuracy: number;
  genreAccuracy: Record<
    string,
    { totalAnswers: number; totalCorrect: number; accuracy: number }
  >;
}

interface AchievementData {
  prefectureProgress: PrefectureProgress[];
  stats: Stats;
}

export default function AchievementPage() {
  const [data, setData] = useState<AchievementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPref, setSelectedPref] = useState<{
    name: string;
    maxDifficulty: Difficulty | null;
  } | null>(null);

  useEffect(() => {
    fetch("/api/achievement")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((json) => setData(json))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <p className={styles.empty}>データの取得に失敗しました</p>
      </div>
    );
  }

  const { prefectureProgress, stats } = data;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>達成状況</h1>

      {/* 統計カード */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statValue}>
            {stats.clearedCount}
            <span className={styles.statUnit}> / {stats.totalPrefectures}</span>
          </p>
          <p className={styles.statLabel}>クリア都道府県</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statValue}>
            {stats.overallAccuracy}
            <span className={styles.statUnit}>%</span>
          </p>
          <p className={styles.statLabel}>総合正解率</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statValue}>{stats.totalAnswers}</p>
          <p className={styles.statLabel}>総回答数</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statValue}>{stats.totalCorrect}</p>
          <p className={styles.statLabel}>正解数</p>
        </div>
      </div>

      {/* 難易度別クリア数 */}
      <div className={styles.difficultySection}>
        <h2 className={styles.sectionTitle}>難易度別クリア数</h2>
        <div className={styles.difficultyBars}>
          {(["beginner", "intermediate", "advanced"] as const).map((diff) => (
            <div key={diff} className={styles.difficultyBar}>
              <span className={styles.difficultyLabel}>
                {DIFFICULTY_LABELS[diff]}
              </span>
              <div className={styles.barTrack}>
                <div
                  className={
                    diff === "beginner"
                      ? styles.barFillBeginner
                      : diff === "intermediate"
                        ? styles.barFillIntermediate
                        : styles.barFillAdvanced
                  }
                  style={{
                    width: `${(stats.difficultyBreakdown[diff] / PREFECTURES.length) * 100}%`,
                  }}
                />
              </div>
              <span className={styles.difficultyCount}>
                {stats.difficultyBreakdown[diff]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ジャンル別正解率 */}
      <div className={styles.genreSection}>
        <h2 className={styles.sectionTitle}>ジャンル別正解率</h2>
        <div className={styles.genreGrid}>
          {(["geography", "tourism", "food"] as const).map((genre) => {
            const genreData = stats.genreAccuracy[genre];
            return (
              <div key={genre} className={styles.genreCard}>
                <p className={styles.genreIcon}>{GENRE_ICONS[genre]}</p>
                <p className={styles.genreName}>{GENRE_LABELS[genre]}</p>
                {genreData && genreData.totalAnswers > 0 ? (
                  <p className={styles.genreAccuracy}>{genreData.accuracy}%</p>
                ) : (
                  <p className={styles.genreNoData}>---</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 日本地図 */}
      <div className={styles.mapSection}>
        <h2 className={styles.sectionTitle}>都道府県マップ</h2>
        <div className={styles.mapContainer}>
          <JapanMap
            prefectureProgress={prefectureProgress}
            onPrefectureClick={(name, maxDifficulty) =>
              setSelectedPref({ name, maxDifficulty })
            }
          />
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: "#e5e5e5" }}
            />
            未挑戦
          </span>
          <span className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: "#f4a261" }}
            />
            初級
          </span>
          <span className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: "#C84B31" }}
            />
            中級
          </span>
          <span className={styles.legendItem}>
            <span
              className={styles.legendColor}
              style={{ backgroundColor: "#8b2500" }}
            />
            上級
          </span>
        </div>
      </div>

      {/* 都道府県ポップアップ */}
      {selectedPref && (
        <>
          <div
            className={styles.popupOverlay}
            onClick={() => setSelectedPref(null)}
          />
          <div className={styles.popup}>
            <p className={styles.popupName}>{selectedPref.name}</p>
            {selectedPref.maxDifficulty ? (
              <>
                <p className={styles.popupStatus}>クリア済み</p>
                <p className={styles.popupDifficulty}>
                  最高難易度: {DIFFICULTY_LABELS[selectedPref.maxDifficulty]}
                </p>
              </>
            ) : (
              <p className={styles.popupStatus}>未挑戦</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
