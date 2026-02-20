"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GENRE_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { Genre, Difficulty } from "@/lib/constants";
import styles from "./history.module.css";

interface Session {
  id: string;
  genre: Genre;
  difficulty: Difficulty;
  score: number | null;
  playedAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  async function fetchSessions(page: number) {
    const res = await fetch(`/api/history?page=${page}&limit=10`);
    if (!res.ok) throw new Error("履歴の取得に失敗しました");
    return res.json();
  }

  useEffect(() => {
    fetchSessions(1)
      .then((data) => {
        setSessions(data.sessions);
        setPagination(data.pagination);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleLoadMore() {
    if (!pagination?.hasNextPage) return;
    setLoadingMore(true);
    try {
      const data = await fetchSessions(pagination.currentPage + 1);
      setSessions((prev) => [...prev, ...data.sessions]);
      setPagination(data.pagination);
    } catch {
      // エラーは無視
    } finally {
      setLoadingMore(false);
    }
  }

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

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>回答履歴</h1>

      {sessions.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyIcon}>📝</p>
          <p className={styles.emptyText}>まだクイズを遊んでいません</p>
          <p className={styles.emptyHint}>
            <Link href="/" className={styles.startLink}>
              トップページ
            </Link>
            からクイズを始めましょう！
          </p>
        </div>
      ) : (
        <>
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/history/${session.id}`}
              className={styles.sessionCard}
            >
              <div className={styles.sessionHeader}>
                <span className={styles.sessionDate}>
                  {formatDate(session.playedAt)}
                </span>
                <span className={styles.sessionScore}>
                  {session.score !== null ? `${session.score}/5` : "未完了"}
                </span>
              </div>
              <div className={styles.sessionTags}>
                <span className={styles.tag}>
                  {GENRE_LABELS[session.genre]}
                </span>
                <span className={styles.tag}>
                  {DIFFICULTY_LABELS[session.difficulty]}
                </span>
              </div>
            </Link>
          ))}

          {pagination?.hasNextPage && (
            <button
              className={styles.loadMore}
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? "読み込み中..." : "もっと見る"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
