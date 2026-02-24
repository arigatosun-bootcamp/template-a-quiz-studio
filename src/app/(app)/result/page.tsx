"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GENRE_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { SessionDetailResponse } from "@/types/api";
import styles from "./result.module.css";

function getScoreMessage(score: number): string {
  if (score === 5) return "パーフェクト！日本マスターへの道を順調に進んでいます！";
  if (score >= 3) return "いい調子です！もう少しで全問正解！";
  if (score >= 1) return "次はもっと上を目指しましょう！";
  return "ドンマイ！挑戦することが大事です！";
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [result, setResult] = useState<SessionDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("セッションIDが指定されていません");
      setLoading(false);
      return;
    }

    async function fetchResult() {
      try {
        const res = await fetch(`/api/quiz/session/${sessionId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "結果の取得に失敗しました");
        }

        const data = await res.json();
        setResult(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "結果の取得に失敗しました"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [sessionId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>結果を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className={styles.container}>
        <p className={styles.errorText}>{error || "結果が見つかりません"}</p>
        <div className={styles.actions}>
          <Link href="/" className={styles.homeButton}>
            トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  const { session, questions } = result;

  return (
    <div className={styles.container}>
      {/* スコア */}
      <div className={styles.scoreSection}>
        <p className={styles.scoreLabel}>あなたのスコア</p>
        <p className={styles.scoreValue}>
          {session.score}
          <span className={styles.scoreUnit}> / {questions.length}</span>
        </p>
        <p className={styles.scoreMessage}>
          {getScoreMessage(session.score ?? 0)}
        </p>
      </div>

      {/* セッション情報 */}
      <div className={styles.sessionMeta}>
        <span className={styles.metaTag}>
          {GENRE_LABELS[session.genre]}
        </span>
        <span className={styles.metaTag}>
          {DIFFICULTY_LABELS[session.difficulty]}
        </span>
      </div>

      {/* 問題一覧 */}
      <h2 className={styles.quizListTitle}>全問一覧</h2>
      {questions.map((quiz, i) => (
        <div
          key={i}
          className={
            quiz.isCorrect
              ? styles.quizItemCorrect
              : styles.quizItemWrong
          }
        >
          <div className={styles.quizItemHeader}>
            <span className={styles.quizItemNumber}>Q{i + 1}</span>
            <span className={styles.quizItemPrefecture}>
              📍 {quiz.prefecture}
            </span>
          </div>
          <p className={styles.quizItemQuestion}>{quiz.questionText}</p>
          <p className={styles.quizItemAnswer}>
            <span
              className={
                quiz.isCorrect
                  ? styles.yourAnswer
                  : styles.yourAnswerWrong
              }
            >
              あなたの回答: {quiz.selectedAnswer || "未回答"}
            </span>
          </p>
          {!quiz.isCorrect && (
            <p className={styles.quizItemAnswer}>
              <span className={styles.correctAnswer}>
                正解: {quiz.correctAnswer}
              </span>
            </p>
          )}
          <p className={styles.quizItemExplanation}>{quiz.explanation}</p>
        </div>
      ))}

      {/* アクションボタン */}
      <div className={styles.actions}>
        <Link
          href={`/quiz?genre=${session.genre}&difficulty=${session.difficulty}`}
          className={styles.retryButton}
        >
          同じ条件でもう一度
        </Link>
        <Link href="/" className={styles.homeButton}>
          トップに戻る
        </Link>
      </div>
    </div>
  );
}
