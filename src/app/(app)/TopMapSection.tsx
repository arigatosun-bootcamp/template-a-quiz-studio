"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DIFFICULTY_LABELS, type Difficulty } from "@/lib/constants";
import type { AchievementResponse } from "@/types/api";
import JapanMap from "@/components/JapanMap";
import styles from "./top.module.css";

export default function TopMapSection() {
  const [data, setData] = useState<AchievementResponse | null>(null);
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
      <div className={styles.mapSection}>
        <p className={styles.mapLoading}>地図を読み込み中...</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { prefectureProgress, stats } = data;

  return (
    <div className={styles.mapSection}>
      <div className={styles.mapHeader}>
        <h2 className={styles.mapTitle}>都道府県マップ</h2>
        <Link href="/achievement" className={styles.mapDetailLink}>
          詳細を見る →
        </Link>
      </div>

      <p className={styles.mapStats}>
        クリア: {stats.clearedCount} / {stats.totalPrefectures} 都道府県
      </p>

      <div className={styles.mapContainer}>
        <JapanMap
          prefectureProgress={prefectureProgress}
          onPrefectureClick={(name, maxDifficulty) =>
            setSelectedPref({ name, maxDifficulty })
          }
        />
      </div>

      <div className={styles.mapLegend}>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: "#D1D5DB" }} />
          未挑戦
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: "#90C978" }} />
          初級
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: "#5B8C3E" }} />
          中級
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendColor} style={{ backgroundColor: "#2D5A1E" }} />
          上級
        </span>
      </div>

      {selectedPref && (
        <>
          <div
            className={styles.popupOverlay}
            onClick={() => setSelectedPref(null)}
          />
          <div className={styles.popup}>
            <p className={styles.popupName}>{selectedPref.name}</p>
            {selectedPref.maxDifficulty ? (
              <p className={styles.popupDifficulty}>
                最高難易度: {DIFFICULTY_LABELS[selectedPref.maxDifficulty]}
              </p>
            ) : (
              <p className={styles.popupStatus}>未挑戦</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
