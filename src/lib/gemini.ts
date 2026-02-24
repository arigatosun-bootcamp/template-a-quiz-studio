import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  GENRE_LABELS,
  DIFFICULTY_LABELS,
  QUESTIONS_PER_SESSION,
  type Genre,
  type Difficulty,
} from "./constants";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface GeneratedQuiz {
  question: string;
  choices: [string, string, string];
  answer: string;
  explanation: string;
  prefecture: string;
}

export function buildPrompt(
  genre: Genre,
  difficulty: Difficulty,
  prefectures: string[]
): string {
  return `あなたは日本に関するクイズの出題者です。
以下の条件で${QUESTIONS_PER_SESSION}問のクイズを作成してください。

【条件】
- ジャンル: ${GENRE_LABELS[genre]}
- 難易度: ${DIFFICULTY_LABELS[difficulty]}
- 出題する都道府県: ${prefectures.join("、")}

【難易度の基準】
- 初級: 誰でも知っている基本知識。有名な都道府県が中心。選択肢を見ればわかるレベル
- 中級: 旅行好きなら知っている知識。やや細かい内容。少し考える必要があるレベル
- 上級: 現地の人や詳しい人向け。マニアックな知識。知識がないと答えられないレベル

【出力形式】
必ず以下のJSON配列形式で出力してください。余計なテキストは含めないでください。

[
  {
    "question": "問題文",
    "choices": ["選択肢A", "選択肢B", "選択肢C"],
    "answer": "正解の選択肢（choicesのいずれかと完全一致）",
    "explanation": "解説文（50〜100文字程度）",
    "prefecture": "都道府県名"
  }
]

【注意事項】
- 各問題は指定された都道府県に関する内容にしてください
- 選択肢は3つ（3択）にしてください
- answer は choices 配列内のいずれかの文字列と完全に一致させてください
- 解説は正解の理由が分かる内容にしてください`;
}

export function parseQuizResponse(text: string): GeneratedQuiz[] {
  // JSONブロックの抽出（```json ... ``` の場合に対応）
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("JSON配列が見つかりません");
  }

  const parsed = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(parsed) || parsed.length !== QUESTIONS_PER_SESSION) {
    throw new Error(`${QUESTIONS_PER_SESSION}問の配列ではありません`);
  }

  return parsed.map((q, i) => {
    if (!q.question || !Array.isArray(q.choices) || q.choices.length !== 3) {
      throw new Error(`問題${i + 1}のデータ形式が不正です`);
    }
    if (!q.choices.includes(q.answer)) {
      throw new Error(`問題${i + 1}の正解が選択肢に含まれていません`);
    }
    if (!q.explanation || !q.prefecture) {
      throw new Error(`問題${i + 1}の解説または都道府県が未設定です`);
    }
    return {
      question: q.question,
      choices: q.choices as [string, string, string],
      answer: q.answer,
      explanation: q.explanation,
      prefecture: q.prefecture,
    };
  });
}

export async function generateQuizzes(
  genre: Genre,
  difficulty: Difficulty,
  prefectures: string[]
): Promise<GeneratedQuiz[]> {
  const prompt = buildPrompt(genre, difficulty, prefectures);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseQuizResponse(text);
}

export async function generateWithRetry(
  genre: Genre,
  difficulty: Difficulty,
  prefectures: string[]
): Promise<GeneratedQuiz[]> {
  const MAX_RETRIES = 3;
  const RETRY_DELAYS = [0, 2000, 4000];
  const TIMEOUT = 10000;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]));
    }

    try {
      const result = await Promise.race([
        generateQuizzes(genre, difficulty, prefectures),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("タイムアウト")), TIMEOUT)
        ),
      ]);
      return result;
    } catch (error) {
      console.error(`クイズ生成 試行${attempt + 1}回目 失敗:`, error);
      if (attempt === MAX_RETRIES - 1) {
        throw new Error("問題の生成に失敗しました。もう一度お試しください");
      }
    }
  }

  throw new Error("問題の生成に失敗しました。もう一度お試しください");
}
