/**
 * API レスポンスの共通型定義
 *
 * フロントエンド（画面）と API ルートの両方でこの型を参照し、
 * プロパティ名のズレをコンパイル時に検出できるようにする。
 */
import type { Genre, Difficulty } from "@/lib/constants";

// ─── POST /api/quiz/generate ────────────────────────────────

/** 生成されたクイズ1問（正解・解説を除く画面表示用） */
export interface QuizItem {
  id: string;
  questionOrder: number;
  questionText: string;
  choices: string[];
  prefecture: string;
}

export interface GenerateQuizResponse {
  sessionId: string;
  quizzes: QuizItem[];
}

// ─── POST /api/quiz/answer ──────────────────────────────────

export interface AnswerResponse {
  answerId: string;
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

// ─── POST /api/quiz/complete ────────────────────────────────

export interface CompleteResponse {
  score: number;
  totalQuestions: number;
  updatedPrefectures: {
    prefecture: string;
    maxDifficulty: string;
  }[];
}

// ─── セッション概要（履歴一覧・セッション詳細で共通） ──────

export interface SessionSummary {
  id: string;
  genre: Genre;
  difficulty: Difficulty;
  score: number | null;
  playedAt: string;
}

// ─── 問題＋回答の詳細（結果画面・履歴詳細で共通） ──────────

export interface QuestionDetail {
  questionOrder: number;
  questionText: string;
  choices: string[];
  correctAnswer: string;
  explanation: string;
  prefecture: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}

// ─── GET /api/quiz/session/[id] & GET /api/history/[id] ─────

export interface SessionDetailResponse {
  session: SessionSummary;
  questions: QuestionDetail[];
}

// ─── GET /api/history ───────────────────────────────────────

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface HistoryResponse {
  sessions: SessionSummary[];
  pagination: PaginationInfo;
}

// ─── GET /api/achievement ───────────────────────────────────

export interface PrefectureProgress {
  prefecture: string;
  maxDifficulty: Difficulty;
}

export interface AchievementStats {
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

export interface AchievementResponse {
  prefectureProgress: PrefectureProgress[];
  stats: AchievementStats;
}

// ─── GET /api/usage/check ───────────────────────────────────

export interface UsageCheckResponse {
  todayCount: number;
  dailyLimit: number;
  remaining: number;
  canPlay: boolean;
  message?: string;
}
