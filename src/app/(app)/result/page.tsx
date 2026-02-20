"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GENRE_LABELS, DIFFICULTY_LABELS } from "@/lib/constants";
import type { Genre, Difficulty } from "@/lib/constants";
import styles from "./result.module.css";

interface QuizResult {
  question_text: string;
  prefecture: string;
  choices: string[];
  correct_answer: string;
  explanation: string;
  selected_answer: string | null;
  is_correct: boolean | null;
}

interface SessionResult {
  sessionId: string;
  genre: Genre;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  quizzes: QuizResult[];
}

function getScoreMessage(score: number, total: number): string {
  const ratio = score / total;
  if (ratio === 1) return "パーフェクト！素晴らしい！🎉";
  if (ratio >= 0.8) return "すごい！よく知ってますね！";
  if (ratio >= 0.6) return "なかなかの成績です！";
  if (ratio >= 0.4) return "まずまずですね！";
  if (ratio >= 0.2) return "もう少し頑張りましょう！";
  return "次は頑張りましょう！💪";
}

export default function ResultPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");

  const [result, setResult] = useState<SessionResult | null>(null);
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

  return (
    <div className={styles.container}>
      {/* スコア */}
      <div className={styles.scoreSection}>
        <p className={styles.scoreLabel}>あなたのスコア</p>
        <p className={styles.scoreValue}>
          {result.score}
          <span className={styles.scoreUnit}> / {result.totalQuestions}</span>
        </p>
        <p className={styles.scoreMessage}>
          {getScoreMessage(result.score, result.totalQuestions)}
        </p>
      </div>

      {/* セッション情報 */}
      <div className={styles.sessionMeta}>
        <span className={styles.metaTag}>
          {GENRE_LABELS[result.genre]}
        </span>
        <span className={styles.metaTag}>
          {DIFFICULTY_LABELS[result.difficulty]}
        </span>
      </div>

      {/* 問題一覧 */}
      <h2 className={styles.quizListTitle}>全問一覧</h2>
      {result.quizzes.map((quiz, i) => (
        <div
          key={i}
          className={
            quiz.is_correct
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
          <p className={styles.quizItemQuestion}>{quiz.question_text}</p>
          <p className={styles.quizItemAnswer}>
            <span
              className={
                quiz.is_correct
                  ? styles.yourAnswer
                  : styles.yourAnswerWrong
              }
            >
              あなたの回答: {quiz.selected_answer || "未回答"}
            </span>
          </p>
          {!quiz.is_correct && (
            <p className={styles.quizItemAnswer}>
              <span className={styles.correctAnswer}>
                正解: {quiz.correct_answer}
              </span>
            </p>
          )}
          <p className={styles.quizItemExplanation}>{quiz.explanation}</p>
        </div>
      ))}

      {/* アクションボタン */}
      <div className={styles.actions}>
        <Link
          href={`/quiz?genre=${result.genre}&difficulty=${result.difficulty}`}
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
