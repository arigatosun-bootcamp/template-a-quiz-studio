"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GENRE_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { Genre, Difficulty } from "@/lib/constants";
import styles from "../history.module.css";

interface Question {
  questionOrder: number;
  questionText: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  prefecture: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

interface SessionDetail {
  session: {
    id: string;
    genre: Genre;
    difficulty: Difficulty;
    score: number | null;
    playedAt: string;
  };
  questions: Question[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function HistoryDetailPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [data, setData] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/history/${sessionId}`);
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "詳細の取得に失敗しました");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "詳細の取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [sessionId]);

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

  if (error || !data) {
    return (
      <div className={styles.container}>
        <Link href="/history" className={styles.backLink}>
          ← 履歴一覧に戻る
        </Link>
        <p className={styles.errorText}>{error || "データが見つかりません"}</p>
      </div>
    );
  }

  const { session, questions } = data;

  return (
    <div className={styles.container}>
      <Link href="/history" className={styles.backLink}>
        ← 履歴一覧に戻る
      </Link>

      <div className={styles.detailHeader}>
        <div className={styles.detailTags}>
          <span className={styles.tag}>
            {GENRE_LABELS[session.genre]}
          </span>
          <span className={styles.tag}>
            {DIFFICULTY_LABELS[session.difficulty]}
          </span>
        </div>
        <p className={styles.detailDate}>{formatDate(session.playedAt)}</p>
        <p className={styles.detailScore}>
          {session.score ?? 0}
          <span className={styles.detailScoreUnit}> / 5</span>
        </p>
      </div>

      {questions.map((q, i) => (
        <div
          key={i}
          className={
            q.isCorrect
              ? styles.questionItemCorrect
              : styles.questionItemWrong
          }
        >
          <div className={styles.questionHeader}>
            <span className={styles.questionNumber}>Q{q.questionOrder}</span>
            <span className={styles.questionPrefecture}>
              📍 {q.prefecture}
            </span>
          </div>
          <p className={styles.questionText}>{q.questionText}</p>
          <p className={styles.answerInfo}>
            <span
              className={
                q.isCorrect ? styles.yourAnswer : styles.yourAnswerWrong
              }
            >
              あなたの回答: {q.selectedAnswer || "未回答"}
            </span>
          </p>
          {!q.isCorrect && (
            <p className={styles.answerInfo}>
              <span className={styles.correctAnswer}>
                正解: {q.correctAnswer}
              </span>
            </p>
          )}
          <p className={styles.explanationText}>{q.explanation}</p>
        </div>
      ))}
    </div>
  );
}
