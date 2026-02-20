"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { QUESTIONS_PER_SESSION } from "@/lib/constants";
import styles from "./quiz.module.css";

interface Quiz {
  id: string;
  prefecture: string;
  question_text: string;
  choices: string[];
}

interface AnswerResult {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
}

export default function QuizPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const genre = searchParams.get("genre");
  const difficulty = searchParams.get("difficulty");

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completing, setCompleting] = useState(false);

  const generateQuiz = useCallback(async () => {
    if (!genre || !difficulty) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, difficulty }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "クイズの生成に失敗しました");
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      setQuizzes(data.quizzes);
      setCurrentIndex(0);
      setSelectedChoice(null);
      setAnswerResult(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "クイズの生成に失敗しました"
      );
    } finally {
      setLoading(false);
    }
  }, [genre, difficulty]);

  useEffect(() => {
    if (!genre || !difficulty) {
      router.replace("/");
      return;
    }
    generateQuiz();
  }, [genre, difficulty, router, generateQuiz]);

  async function handleAnswer() {
    if (selectedChoice === null || !quizzes[currentIndex]) return;

    setSubmitting(true);
    try {
      const quiz = quizzes[currentIndex];
      const res = await fetch("/api/quiz/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          selectedAnswer: quiz.choices[selectedChoice],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "回答の送信に失敗しました");
      }

      const data = await res.json();
      setAnswerResult({
        correct: data.correct,
        correctAnswer: data.correctAnswer,
        explanation: data.explanation,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "回答の送信に失敗しました"
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    setCurrentIndex((prev) => prev + 1);
    setSelectedChoice(null);
    setAnswerResult(null);
  }

  async function handleComplete() {
    if (!sessionId) return;

    setCompleting(true);
    try {
      const res = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "結果の取得に失敗しました");
      }

      router.push(`/result?sessionId=${sessionId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "結果の取得に失敗しました"
      );
      setCompleting(false);
    }
  }

  // パラメータ不正 → リダイレクト中
  if (!genre || !difficulty) {
    return null;
  }

  // ローディング
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>クイズを生成中...</p>
        </div>
      </div>
    );
  }

  // エラー
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>😢</span>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryButton} onClick={generateQuiz}>
            再試行
          </button>
          <Link href="/" className={styles.backLink}>
            トップに戻る
          </Link>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIndex];
  if (!currentQuiz) return null;

  const isLastQuestion = currentIndex === QUESTIONS_PER_SESSION - 1;
  const answered = answerResult !== null;

  return (
    <div className={styles.container}>
      {/* 進捗バー */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>
            問題 {currentIndex + 1} / {QUESTIONS_PER_SESSION}
          </span>
          <span className={styles.progressMeta}>
            {currentQuiz.prefecture}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${((currentIndex + (answered ? 1 : 0)) / QUESTIONS_PER_SESSION) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* 都道府県タグ */}
      <span className={styles.prefectureTag}>📍 {currentQuiz.prefecture}</span>

      {/* 問題文 */}
      <p className={styles.questionText}>{currentQuiz.question_text}</p>

      {/* 選択肢 */}
      <div className={styles.choiceList}>
        {currentQuiz.choices.map((choice, i) => {
          let className = styles.choiceButton;

          if (answered) {
            if (choice === answerResult.correctAnswer) {
              className = styles.choiceButtonCorrect;
            } else if (i === selectedChoice) {
              className = styles.choiceButtonWrong;
            } else {
              className = styles.choiceButtonDisabled;
            }
          } else if (i === selectedChoice) {
            className = styles.choiceButtonSelected;
          }

          return (
            <button
              key={i}
              className={className}
              onClick={() => !answered && setSelectedChoice(i)}
              disabled={answered}
            >
              <span className={styles.choiceNumber}>{String.fromCharCode(65 + i)}</span>
              <span className={styles.choiceText}>{choice}</span>
            </button>
          );
        })}
      </div>

      {/* 回答前: 回答ボタン */}
      {!answered && (
        <button
          className={styles.answerButton}
          disabled={selectedChoice === null || submitting}
          onClick={handleAnswer}
        >
          {submitting ? "判定中..." : "回答する"}
        </button>
      )}

      {/* 回答後: 結果表示 */}
      {answered && (
        <>
          <div
            className={
              answerResult.correct
                ? styles.resultCorrect
                : styles.resultWrong
            }
          >
            <p
              className={
                answerResult.correct
                  ? styles.resultLabelCorrect
                  : styles.resultLabelWrong
              }
            >
              {answerResult.correct ? "⭕ 正解！" : "❌ 不正解"}
            </p>
            {!answerResult.correct && (
              <p className={styles.correctAnswer}>
                正解: {answerResult.correctAnswer}
              </p>
            )}
            <p className={styles.explanation}>{answerResult.explanation}</p>
          </div>

          {isLastQuestion ? (
            <button
              className={styles.seeResultButton}
              onClick={handleComplete}
              disabled={completing}
            >
              {completing ? "集計中..." : "結果を見る"}
            </button>
          ) : (
            <button className={styles.nextButton} onClick={handleNext}>
              次の問題へ →
            </button>
          )}
        </>
      )}
    </div>
  );
}
