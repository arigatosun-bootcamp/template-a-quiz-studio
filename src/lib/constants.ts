export const VALID_GENRES = ["geography", "tourism", "food"] as const;
export const VALID_DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
] as const;

export type Genre = (typeof VALID_GENRES)[number];
export type Difficulty = (typeof VALID_DIFFICULTIES)[number];

export const GENRE_LABELS: Record<Genre, string> = {
  geography: "地理",
  tourism: "観光名所",
  food: "ご当地グルメ",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "初級",
  intermediate: "中級",
  advanced: "上級",
};

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export const DAILY_LIMIT = 20;
export const QUESTIONS_PER_SESSION = 5;

export const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
] as const;
