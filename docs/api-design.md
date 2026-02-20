# JapanMaster API設計書

> Next.js App Router の Route Handlers（`app/api/` 配下）を使用したAPI設計。
> Supabaseクライアントによるデータベース操作と、Gemini APIによるクイズ生成を中心に構成する。

---

## 1. API エンドポイント一覧

| # | メソッド | パス | 概要 | 認証 |
|---|---------|------|------|------|
| 1 | POST | `/api/quiz/generate` | クイズ5問を生成（Gemini API + DB保存） | 必須 |
| 2 | POST | `/api/quiz/answer` | 1問の回答を保存 | 必須 |
| 3 | POST | `/api/quiz/complete` | セッション完了処理（スコア更新 + 都道府県進捗更新） | 必須 |
| 4 | GET | `/api/quiz/session/[sessionId]` | セッションの詳細取得（結果画面用） | 必須 |
| 5 | GET | `/api/history` | 回答履歴一覧取得（ページネーション付き） | 必須 |
| 6 | GET | `/api/history/[sessionId]` | 特定セッションの全問題・回答取得 | 必須 |
| 7 | GET | `/api/achievement` | 達成状況データ取得 | 必須 |
| 8 | GET | `/api/usage/check` | 本日のAI利用回数チェック | 必須 |
| 9 | DELETE | `/api/account` | アカウント削除 | 必須 |

### 認証方式

すべてのAPIエンドポイントで Supabase Auth のセッションによる認証を行う。
リクエストの Cookie に含まれるセッション情報から `supabase.auth.getUser()` でユーザーを特定する。

```typescript
// 認証チェック共通処理（各Route Handlerの冒頭で実行）
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const supabase = createRouteHandlerClient({ cookies })
const { data: { user }, error } = await supabase.auth.getUser()

if (!user) {
  return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
}
```

---

## 2. 各エンドポイント詳細仕様

---

### 2.1 POST `/api/quiz/generate` — クイズ生成

Gemini APIを使って5問のクイズを生成し、データベースに保存する。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| genre | string | Yes | ジャンル: `"geography"` / `"tourism"` / `"food"` |
| difficulty | string | Yes | 難易度: `"beginner"` / `"intermediate"` / `"advanced"` |

```json
{
  "genre": "geography",
  "difficulty": "beginner"
}
```

#### レスポンス — 成功（200 OK）

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000",
  "quizzes": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "questionOrder": 1,
      "questionText": "日本で最も面積が大きい都道府県はどこでしょう？",
      "choices": ["北海道", "岩手県", "長野県"],
      "prefecture": "北海道"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "questionOrder": 2,
      "questionText": "「日本のへそ」と呼ばれる兵庫県の市はどこでしょう？",
      "choices": ["西脇市", "明石市", "姫路市"],
      "prefecture": "兵庫県"
    }
  ]
}
```

> **注意**: レスポンスには `correct_answer` と `explanation` を含めない（クライアント側でカンニング防止）。
> 正解・解説は回答後のレスポンス（`/api/quiz/answer`）で返す。

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 400 | genre / difficulty が不正 | `{ "error": "ジャンルまたは難易度の値が不正です" }` |
| 429 | 1日の利用上限（20回）超過 | `{ "error": "本日の利用上限に達しました。明日またお楽しみください", "limitReached": true }` |
| 500 | Gemini API 生成失敗（3回リトライ後） | `{ "error": "問題の生成に失敗しました。もう一度お試しください" }` |
| 500 | その他のサーバーエラー | `{ "error": "サーバーエラーが発生しました" }` |

#### 処理フロー

1. 認証チェック（ユーザーIDを取得）
2. リクエストボディのバリデーション（genre, difficulty の値チェック）
3. **利用上限チェック**: `quiz_sessions` テーブルから本日分（JST 0:00以降）のセッション数を COUNT
   - 20件以上 → 429エラーを返す
4. **出題県の決定**:
   - `prefecture_progress` テーブルから、指定難易度で正解済みの都道府県を取得
   - 47都道府県リストから正解済みを除外し、未正解の県を抽出
   - 未正解の県からランダムに5県を選択
   - 未正解が5県未満の場合 → 全47県からランダムに補充して合計5県にする
5. **セッション作成**: `quiz_sessions` テーブルにINSERT（score: 0）
6. **Gemini API呼び出し**（リトライ付き）:
   - ジャンル・難易度・5県をプロンプトに含めてリクエスト
   - APIタイムアウト: 10秒
   - 失敗時: 2秒待機 → リトライ（2回目）、4秒待機 → リトライ（3回目）
   - 3回すべて失敗 → セッションを削除して500エラーを返す
7. **レスポンスのパース・バリデーション**: Gemini APIの出力をJSONパースし、5問分のデータ構造を検証
8. **クイズ保存**: `quizzes` テーブルに5件をINSERT（question_order: 1〜5）
9. レスポンスを返す（正解・解説を除いた問題データ）

#### Gemini APIへのプロンプト設計

```
あなたは日本に関するクイズの出題者です。
以下の条件で5問のクイズを作成してください。

【条件】
- ジャンル: {genre の日本語名}
- 難易度: {difficulty の日本語名}
- 出題する都道府県: {5県のリスト}

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
- 解説は正解の理由が分かる内容にしてください
```

---

### 2.2 POST `/api/quiz/answer` — 回答保存

ユーザーの1問ごとの回答を保存し、正解・解説を返す。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| quizId | string (UUID) | Yes | 問題のID |
| selectedAnswer | string | Yes | ユーザーが選んだ選択肢 |

```json
{
  "quizId": "660e8400-e29b-41d4-a716-446655440001",
  "selectedAnswer": "北海道"
}
```

#### レスポンス — 成功（200 OK）

```json
{
  "answerId": "770e8400-e29b-41d4-a716-446655440001",
  "isCorrect": true,
  "correctAnswer": "北海道",
  "explanation": "北海道は約83,450km²で日本最大の都道府県です。2位の岩手県（約15,275km²）の5倍以上の面積があります。"
}
```

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 400 | quizId / selectedAnswer が未指定 | `{ "error": "quizId と selectedAnswer は必須です" }` |
| 404 | 指定された quizId が見つからない | `{ "error": "問題が見つかりません" }` |
| 409 | 同じ問題に既に回答済み | `{ "error": "この問題には既に回答しています" }` |
| 500 | サーバーエラー | `{ "error": "サーバーエラーが発生しました" }` |

#### 処理フロー

1. 認証チェック
2. リクエストボディのバリデーション
3. `quizzes` テーブルから該当問題を取得（`correct_answer` を含む）
   - 問題が見つからない → 404エラー
   - 問題のセッションが自分のものでない → 404エラー（他ユーザーの問題にはアクセス不可）
4. `answers` テーブルで重複チェック（同じ quiz_id + user_id の回答が存在するか）
   - 存在する → 409エラー
5. 正解判定: `selectedAnswer === correct_answer`
6. `answers` テーブルにINSERT
7. 正解・解説を含むレスポンスを返す

---

### 2.3 POST `/api/quiz/complete` — セッション完了処理

5問すべての回答が終わった後、スコアの確定と都道府県進捗の更新を行う。

#### リクエスト

| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| sessionId | string (UUID) | Yes | セッションのID |

```json
{
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### レスポンス — 成功（200 OK）

```json
{
  "score": 3,
  "totalQuestions": 5,
  "updatedPrefectures": [
    { "prefecture": "北海道", "maxDifficulty": "beginner" },
    { "prefecture": "兵庫県", "maxDifficulty": "intermediate" },
    { "prefecture": "沖縄県", "maxDifficulty": "beginner" }
  ]
}
```

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 400 | sessionId が未指定 | `{ "error": "sessionId は必須です" }` |
| 404 | セッションが見つからない | `{ "error": "セッションが見つかりません" }` |
| 400 | 5問すべての回答が完了していない | `{ "error": "すべての問題に回答してからセッションを完了してください" }` |
| 500 | サーバーエラー | `{ "error": "サーバーエラーが発生しました" }` |

#### 処理フロー

1. 認証チェック
2. リクエストボディのバリデーション
3. `quiz_sessions` テーブルから該当セッションを取得
   - セッションが見つからない or 自分のセッションでない → 404エラー
4. `quizzes` + `answers` テーブルから、そのセッションの全5問と回答を取得
   - 回答が5件揃っていない → 400エラー
5. **スコア計算**: 正解数を集計
6. **quiz_sessions の score を UPDATE**
7. **prefecture_progress を更新**（正解した問題の都道府県のみ）:
   - 各正解問題について:
     - `prefecture_progress` に該当レコードがなければ INSERT（`max_difficulty` = 今回の難易度）
     - レコードがあり、今回の難易度の方が上なら UPDATE
     - レコードがあり、今回の難易度の方が下 or 同じなら何もしない
   - 難易度の順序: `beginner` < `intermediate` < `advanced`
8. 更新結果をレスポンスとして返す

---

### 2.4 GET `/api/quiz/session/[sessionId]` — セッション詳細取得

結果画面で使用する。セッションに紐づく全問題・回答・解説を取得する。

#### リクエスト

| パラメータ | 型 | 場所 | 必須 | 説明 |
|-----------|-----|------|------|------|
| sessionId | string (UUID) | パスパラメータ | Yes | セッションID |

```
GET /api/quiz/session/550e8400-e29b-41d4-a716-446655440000
```

#### レスポンス — 成功（200 OK）

```json
{
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "genre": "geography",
    "difficulty": "beginner",
    "score": 3,
    "playedAt": "2026-02-20T10:30:00.000Z"
  },
  "questions": [
    {
      "questionOrder": 1,
      "questionText": "日本で最も面積が大きい都道府県はどこでしょう？",
      "choices": ["北海道", "岩手県", "長野県"],
      "correctAnswer": "北海道",
      "explanation": "北海道は約83,450km²で日本最大の都道府県です。",
      "prefecture": "北海道",
      "selectedAnswer": "北海道",
      "isCorrect": true
    },
    {
      "questionOrder": 2,
      "questionText": "「日本のへそ」と呼ばれる兵庫県の市はどこでしょう？",
      "choices": ["西脇市", "明石市", "姫路市"],
      "correctAnswer": "西脇市",
      "explanation": "西脇市は日本列島の中心（東経135度・北緯35度の交差点）に位置し、「日本のへそ」と呼ばれています。",
      "prefecture": "兵庫県",
      "selectedAnswer": "明石市",
      "isCorrect": false
    }
  ]
}
```

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 404 | セッションが見つからない | `{ "error": "セッションが見つかりません" }` |
| 500 | サーバーエラー | `{ "error": "サーバーエラーが発生しました" }` |

#### 処理フロー

1. 認証チェック
2. `quiz_sessions` テーブルから該当セッションを取得（`user_id` が自分であること）
   - 見つからない → 404エラー
3. `quizzes` テーブルから該当セッションの全問題を取得（`question_order` 順）
4. `answers` テーブルから該当問題群への回答を取得
5. 問題 + 回答 + 解説を結合してレスポンスを構築

---

### 2.5 GET `/api/history` — 回答履歴一覧取得

回答履歴画面で使用する。ページネーション付きでセッション一覧を返す。

#### リクエスト

| パラメータ | 型 | 場所 | 必須 | デフォルト | 説明 |
|-----------|-----|------|------|-----------|------|
| page | number | クエリ | No | 1 | ページ番号（1始まり） |
| limit | number | クエリ | No | 10 | 1ページあたりの件数 |

```
GET /api/history?page=1&limit=10
```

#### レスポンス — 成功（200 OK）

```json
{
  "sessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "genre": "geography",
      "difficulty": "beginner",
      "score": 3,
      "playedAt": "2026-02-20T10:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "genre": "food",
      "difficulty": "intermediate",
      "score": 5,
      "playedAt": "2026-02-19T14:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalCount": 42,
    "limit": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 400 | page / limit が不正な値 | `{ "error": "ページ番号が不正です" }` |
| 500 | サーバーエラー | `{ "error": "サーバーエラーが発生しました" }` |

#### 処理フロー

1. 認証チェック
2. クエリパラメータのバリデーション（page >= 1, limit >= 1 かつ limit <= 50）
3. `quiz_sessions` テーブルからセッション一覧を取得
   - `WHERE user_id = ログインユーザー`
   - `ORDER BY played_at DESC`
   - `LIMIT {limit} OFFSET ({page} - 1) * {limit}`
4. 総件数を COUNT して総ページ数を計算
5. セッション一覧 + ページネーション情報をレスポンスとして返す

---

### 2.6 GET `/api/history/[sessionId]` — セッション詳細取得（履歴用）

回答履歴画面の折りたたみ展開時に使用する。特定セッションの全問題・回答を取得する。

#### リクエスト

| パラメータ | 型 | 場所 | 必須 | 説明 |
|-----------|-----|------|------|------|
| sessionId | string (UUID) | パスパラメータ | Yes | セッションID |

```
GET /api/history/550e8400-e29b-41d4-a716-446655440000
```

#### レスポンス — 成功（200 OK）

```json
{
  "session": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "genre": "geography",
    "difficulty": "beginner",
    "score": 3,
    "playedAt": "2026-02-20T10:30:00.000Z"
  },
  "questions": [
    {
      "questionOrder": 1,
      "questionText": "日本で最も面積が大きい都道府県はどこでしょう？",
      "choices": ["北海道", "岩手県", "長野県"],
      "correctAnswer": "北海道",
      "explanation": "北海道は約83,450km²で日本最大の都道府県です。",
      "prefecture": "北海道",
      "selectedAnswer": "北海道",
      "isCorrect": true
    },
    {
      "questionOrder": 2,
      "questionText": "「日本のへそ」と呼ばれる兵庫県の市はどこでしょう？",
      "choices": ["西脇市", "明石市", "姫路市"],
      "correctAnswer": "西脇市",
      "explanation": "西脇市は日本列島の中心に位置し、「日本のへそ」と呼ばれています。",
      "prefecture": "兵庫県",
      "selectedAnswer": "明石市",
      "isCorrect": false
    }
  ]
}
```

> **備考**: レスポンス形式は `GET /api/quiz/session/[sessionId]` と同一。
> 実装上、同じ内部関数を共有してもよい。

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 404 | セッションが見つからない | `{ "error": "セッションが見つかりません" }` |
| 500 | サーバーエラー | `{ "error": "サーバーエラーが発生しました" }` |

#### 処理フロー

1. 認証チェック
2. `quiz_sessions` テーブルから該当セッションを取得（`user_id` が自分であること）
3. `quizzes` テーブルから該当セッションの全問題を取得（`question_order` 順）
4. `answers` テーブルから該当問題群への回答を取得
5. 問題 + 回答 + 解説を結合してレスポンスを構築

---

### 2.7 GET `/api/achievement` — 達成状況データ取得

達成状況画面とトップ画面の日本地図で使用する。

#### リクエスト

```
GET /api/achievement
```

パラメータなし。

#### レスポンス — 成功（200 OK）

```json
{
  "prefectureProgress": [
    { "prefecture": "北海道", "maxDifficulty": "beginner" },
    { "prefecture": "兵庫県", "maxDifficulty": "intermediate" },
    { "prefecture": "沖縄県", "maxDifficulty": "advanced" }
  ],
  "stats": {
    "clearedCount": 3,
    "totalPrefectures": 47,
    "difficultyBreakdown": {
      "beginner": 3,
      "intermediate": 2,
      "advanced": 1
    },
    "totalAnswers": 150,
    "totalCorrect": 105,
    "overallAccuracy": 70.0,
    "genreAccuracy": {
      "geography": {
        "totalAnswers": 60,
        "totalCorrect": 45,
        "accuracy": 75.0
      },
      "tourism": {
        "totalAnswers": 50,
        "totalCorrect": 35,
        "accuracy": 70.0
      },
      "food": {
        "totalAnswers": 40,
        "totalCorrect": 25,
        "accuracy": 62.5
      }
    }
  }
}
```

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 500 | サーバーエラー | `{ "error": "サーバーエラーが発生しました" }` |

#### 処理フロー

1. 認証チェック
2. 以下のデータを並行して取得:
   - **都道府県進捗**: `prefecture_progress` テーブル（`WHERE user_id = ログインユーザー`）
     - クリア済み都道府県一覧と最高難易度
     - 難易度別の制覇数を集計
   - **回答統計**: `answers` テーブル（`WHERE user_id = ログインユーザー`）
     - 総回答数（COUNT）
     - 正解数（`is_correct = true` の COUNT）
   - **ジャンル別統計**: `answers` テーブルと `quizzes` テーブルをJOIN
     - ジャンルごとの回答数・正解数を集計
3. 正答率を計算（回答数が0の場合は0%）
4. すべてのデータを結合してレスポンスを返す

---

### 2.8 GET `/api/usage/check` — AI利用回数チェック

ゲームスタート前に、本日の残り利用回数を確認する。

#### リクエスト

```
GET /api/usage/check
```

パラメータなし。

#### レスポンス — 成功（200 OK）

```json
{
  "todayCount": 5,
  "dailyLimit": 20,
  "remaining": 15,
  "canPlay": true
}
```

利用上限到達時:

```json
{
  "todayCount": 20,
  "dailyLimit": 20,
  "remaining": 0,
  "canPlay": false,
  "message": "本日の利用上限に達しました。明日またお楽しみください"
}
```

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 500 | サーバーエラー | `{ "error": "サーバーエラーが発生しました" }` |

#### 処理フロー

1. 認証チェック
2. 本日の日本時間 0:00（UTC 前日 15:00）を算出
3. `quiz_sessions` テーブルから該当ユーザーの本日分セッション数を COUNT
   - `WHERE user_id = ログインユーザー AND played_at >= 今日の0:00 JST`
4. 残り回数と利用可否を計算してレスポンスを返す

#### JSTの日付境界計算

```typescript
// 日本時間（UTC+9）の0:00をUTCに変換
function getTodayStartJST(): Date {
  const now = new Date()
  const jstOffset = 9 * 60 // 日本時間は UTC+9
  const jstNow = new Date(now.getTime() + jstOffset * 60 * 1000)
  const jstMidnight = new Date(jstNow.getFullYear(), jstNow.getMonth(), jstNow.getDate())
  return new Date(jstMidnight.getTime() - jstOffset * 60 * 1000) // UTCに変換
}
```

---

### 2.9 DELETE `/api/account` — アカウント削除

ユーザーアカウントと全関連データを削除する。

#### リクエスト

```
DELETE /api/account
```

パラメータなし（認証情報のみで処理）。

#### レスポンス — 成功（200 OK）

```json
{
  "message": "アカウントを削除しました"
}
```

#### レスポンス — エラー

| ステータス | 条件 | レスポンス |
|-----------|------|-----------|
| 401 | 未認証 | `{ "error": "認証が必要です" }` |
| 500 | 削除処理に失敗 | `{ "error": "アカウントの削除に失敗しました" }` |

#### 処理フロー

1. 認証チェック
2. Supabase Admin APIを使用してユーザーを削除
   - `supabase.auth.admin.deleteUser(userId)`
   - CASCADE設定により以下のデータが自動削除される:
     - `public.users` レコード
     - `quiz_sessions`（user_id で紐づく全レコード）
     - `quizzes`（session_id 経由で全レコード）
     - `answers`（user_id で紐づく全レコード）
     - `prefecture_progress`（user_id で紐づく全レコード）
3. サーバー側でセッションを破棄

> **注意**: `auth.admin.deleteUser` は Service Role Key が必要。
> このエンドポイントはサーバーサイドでのみ Service Role Key を使用し、クライアントには公開しない。

---

## 3. ファイル構成（App Router）

```
app/
├── api/
│   ├── quiz/
│   │   ├── generate/
│   │   │   └── route.ts          # POST: クイズ生成
│   │   ├── answer/
│   │   │   └── route.ts          # POST: 回答保存
│   │   ├── complete/
│   │   │   └── route.ts          # POST: セッション完了
│   │   └── session/
│   │       └── [sessionId]/
│   │           └── route.ts      # GET: セッション詳細
│   ├── history/
│   │   ├── route.ts              # GET: 履歴一覧
│   │   └── [sessionId]/
│   │       └── route.ts          # GET: 履歴詳細
│   ├── achievement/
│   │   └── route.ts              # GET: 達成状況
│   ├── usage/
│   │   └── check/
│   │       └── route.ts          # GET: 利用回数チェック
│   └── account/
│       └── route.ts              # DELETE: アカウント削除
```

---

## 4. 共通仕様

### 4.1 レスポンス形式

すべてのAPIレスポンスは `Content-Type: application/json` とする。

#### 成功時の共通構造

```json
{
  "データフィールド": "..."
}
```

#### エラー時の共通構造

```json
{
  "error": "エラーメッセージ（日本語）"
}
```

### 4.2 HTTPステータスコード一覧

| コード | 意味 | 使用場面 |
|--------|------|---------|
| 200 | OK | 正常処理完了 |
| 400 | Bad Request | リクエストパラメータ不正、バリデーションエラー |
| 401 | Unauthorized | 未認証（セッションなし or 期限切れ） |
| 404 | Not Found | リソースが見つからない |
| 409 | Conflict | 重複操作（同じ問題に2度回答など） |
| 429 | Too Many Requests | 利用上限超過 |
| 500 | Internal Server Error | サーバー内部エラー |

### 4.3 認証ミドルウェア

```typescript
// lib/auth.ts - 認証ヘルパー
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function getAuthenticatedUser() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, supabase, error: '認証が必要です' }
  }

  return { user, supabase, error: null }
}
```

### 4.4 エラーハンドリング

```typescript
// lib/api-error.ts - APIエラーレスポンスヘルパー
import { NextResponse } from 'next/server'

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export function unauthorized() {
  return apiError('認証が必要です', 401)
}

export function badRequest(message: string) {
  return apiError(message, 400)
}

export function notFound(message: string) {
  return apiError(message, 404)
}
```

### 4.5 バリデーション

ジャンルと難易度のバリデーション定数:

```typescript
// lib/constants.ts
export const VALID_GENRES = ['geography', 'tourism', 'food'] as const
export const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const

export const GENRE_LABELS: Record<string, string> = {
  geography: '地理',
  tourism: '観光名所',
  food: 'ご当地グルメ',
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
}

export const DIFFICULTY_ORDER: Record<string, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
}

export const DAILY_LIMIT = 20
export const QUESTIONS_PER_SESSION = 5
```

### 4.6 都道府県リスト

```typescript
// lib/prefectures.ts
export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県',
  '山形県', '福島県', '茨城県', '栃木県', '群馬県',
  '埼玉県', '千葉県', '東京都', '神奈川県', '新潟県',
  '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県', '滋賀県',
  '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県',
  '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県',
  '鹿児島県', '沖縄県',
] as const
```

---

## 5. Supabase クエリ例

各エンドポイントで使用する主要なSupabaseクエリの実装例。

### 5.1 利用上限チェック

```typescript
const todayStartJST = getTodayStartJST()

const { count, error } = await supabase
  .from('quiz_sessions')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', user.id)
  .gte('played_at', todayStartJST.toISOString())

const todayCount = count ?? 0
const canPlay = todayCount < DAILY_LIMIT
```

### 5.2 未正解の都道府県を取得

```typescript
// 指定難易度以上で正解済みの都道府県を取得
const { data: progress } = await supabase
  .from('prefecture_progress')
  .select('prefecture, max_difficulty')
  .eq('user_id', user.id)

// 指定難易度で正解済みの都道府県をフィルタ
const clearedPrefectures = (progress ?? [])
  .filter(p => DIFFICULTY_ORDER[p.max_difficulty] >= DIFFICULTY_ORDER[difficulty])
  .map(p => p.prefecture)

// 未正解の都道府県
const unclearedPrefectures = PREFECTURES.filter(p => !clearedPrefectures.includes(p))
```

### 5.3 セッション作成

```typescript
const { data: session, error } = await supabase
  .from('quiz_sessions')
  .insert({
    user_id: user.id,
    genre,
    difficulty,
    score: 0,
  })
  .select()
  .single()
```

### 5.4 クイズ保存（5問一括）

```typescript
const quizRows = generatedQuizzes.map((q, index) => ({
  session_id: session.id,
  question_text: q.question,
  choice_1: q.choices[0],
  choice_2: q.choices[1],
  choice_3: q.choices[2],
  correct_answer: q.answer,
  explanation: q.explanation,
  genre,
  difficulty,
  prefecture: q.prefecture,
  question_order: index + 1,
}))

const { data: quizzes, error } = await supabase
  .from('quizzes')
  .insert(quizRows)
  .select()
```

### 5.5 回答保存

```typescript
const { data: answer, error } = await supabase
  .from('answers')
  .insert({
    user_id: user.id,
    quiz_id: quizId,
    selected_answer: selectedAnswer,
    is_correct: selectedAnswer === quiz.correct_answer,
  })
  .select()
  .single()
```

### 5.6 都道府県進捗の更新（UPSERT）

```typescript
const { error } = await supabase
  .from('prefecture_progress')
  .upsert(
    {
      user_id: user.id,
      prefecture: prefectureName,
      max_difficulty: difficulty,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,prefecture',
    }
  )
```

> **注意**: UPSERTを使う場合、既存レコードの `max_difficulty` が現在の値より低い場合のみ更新したい。
> Supabaseの UPSERT では条件付き更新が難しいため、以下のように先にSELECTで確認するか、RPC（ストアドプロシージャ）を使うことを推奨する。

```typescript
// 方法1: SELECT → 比較 → INSERT or UPDATE
const { data: existing } = await supabase
  .from('prefecture_progress')
  .select('max_difficulty')
  .eq('user_id', user.id)
  .eq('prefecture', prefectureName)
  .single()

if (!existing) {
  // レコードなし → INSERT
  await supabase.from('prefecture_progress').insert({
    user_id: user.id,
    prefecture: prefectureName,
    max_difficulty: difficulty,
  })
} else if (DIFFICULTY_ORDER[difficulty] > DIFFICULTY_ORDER[existing.max_difficulty]) {
  // 今回の難易度の方が上 → UPDATE
  await supabase
    .from('prefecture_progress')
    .update({ max_difficulty: difficulty, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('prefecture', prefectureName)
}
// 今回の難易度の方が下 or 同じ → 何もしない
```

### 5.7 達成状況のジャンル別統計取得

```typescript
// answers + quizzes を JOIN してジャンル別集計
const { data: genreStats } = await supabase
  .from('answers')
  .select(`
    is_correct,
    quiz:quizzes!inner(genre)
  `)
  .eq('user_id', user.id)
```

### 5.8 回答履歴一覧（ページネーション）

```typescript
const offset = (page - 1) * limit

const { data: sessions, count, error } = await supabase
  .from('quiz_sessions')
  .select('*', { count: 'exact' })
  .eq('user_id', user.id)
  .order('played_at', { ascending: false })
  .range(offset, offset + limit - 1)
```

---

## 6. Gemini API 連携仕様

### 6.1 使用モデル

| 項目 | 値 |
|------|-----|
| モデル | `gemini-2.0-flash`（高速・低コスト） |
| maxOutputTokens | 2048 |
| temperature | 0.8（多様なクイズ生成のため） |

### 6.2 API呼び出し実装

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

async function generateQuizzes(
  genre: string,
  difficulty: string,
  prefectures: string[]
): Promise<GeneratedQuiz[]> {
  const prompt = buildPrompt(genre, difficulty, prefectures)

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.8,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json',
    },
  })

  const text = result.response.text()
  return parseQuizResponse(text)
}
```

### 6.3 リトライ処理

```typescript
async function generateWithRetry(
  genre: string,
  difficulty: string,
  prefectures: string[]
): Promise<GeneratedQuiz[]> {
  const MAX_RETRIES = 3
  const RETRY_DELAYS = [0, 2000, 4000] // 初回は即実行、2回目は2秒後、3回目は4秒後
  const TIMEOUT = 10000 // 10秒

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAYS[attempt]))
    }

    try {
      const result = await Promise.race([
        generateQuizzes(genre, difficulty, prefectures),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('タイムアウト')), TIMEOUT)
        ),
      ])
      return result
    } catch (error) {
      console.error(`クイズ生成 試行${attempt + 1}回目 失敗:`, error)
      if (attempt === MAX_RETRIES - 1) {
        throw new Error('問題の生成に失敗しました。もう一度お試しください')
      }
    }
  }

  throw new Error('問題の生成に失敗しました。もう一度お試しください')
}
```

### 6.4 レスポンスのパース・バリデーション

```typescript
interface GeneratedQuiz {
  question: string
  choices: [string, string, string]
  answer: string
  explanation: string
  prefecture: string
}

function parseQuizResponse(text: string): GeneratedQuiz[] {
  // JSONブロックの抽出（```json ... ``` の場合に対応）
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('JSON配列が見つかりません')
  }

  const parsed = JSON.parse(jsonMatch[0])

  if (!Array.isArray(parsed) || parsed.length !== 5) {
    throw new Error('5問の配列ではありません')
  }

  return parsed.map((q, i) => {
    if (!q.question || !Array.isArray(q.choices) || q.choices.length !== 3) {
      throw new Error(`問題${i + 1}のデータ形式が不正です`)
    }
    if (!q.choices.includes(q.answer)) {
      throw new Error(`問題${i + 1}の正解が選択肢に含まれていません`)
    }
    if (!q.explanation || !q.prefecture) {
      throw new Error(`問題${i + 1}の解説または都道府県が未設定です`)
    }
    return {
      question: q.question,
      choices: q.choices as [string, string, string],
      answer: q.answer,
      explanation: q.explanation,
      prefecture: q.prefecture,
    }
  })
}
```

---

## 7. 環境変数

| 変数名 | 用途 | 設定場所 |
|--------|------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL | `.env.local` / Vercel環境変数 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 公開キー（クライアント用） | `.env.local` / Vercel環境変数 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロールキー（サーバー専用） | `.env.local` / Vercel環境変数 |
| `GEMINI_API_KEY` | Gemini API キー | `.env.local` / Vercel環境変数 |

> **重要**: `SUPABASE_SERVICE_ROLE_KEY` と `GEMINI_API_KEY` は `NEXT_PUBLIC_` プレフィックスを付けないこと。
> サーバーサイド（Route Handlers）でのみ使用し、クライアントには露出させない。

---

## 8. セキュリティ考慮事項

### 8.1 認証・認可

- すべてのAPIエンドポイントで `supabase.auth.getUser()` による認証チェックを行う
- RLSポリシーにより、他ユーザーのデータへのアクセスは DB レベルで防止される
- Service Role Key はサーバーサイドでのみ使用（アカウント削除時のみ）

### 8.2 入力バリデーション

- `genre` / `difficulty` は定義済みの値のみ許可する（enum チェック）
- UUID形式のチェックを行う
- Gemini APIのレスポンスは必ずパース・バリデーションしてからDBに保存する

### 8.3 レート制限

- 1日20回の利用上限をサーバーサイドで検証する（クライアント側のチェックに依存しない）
- クイズ生成API（`/api/quiz/generate`）は利用上限チェックを内包する

### 8.4 データ保護

- 正解・解説はクイズ生成時のレスポンスに含めない（回答後に初めて返す）
- 他ユーザーのセッション・問題・回答にはアクセスできない（RLSポリシー + APIレベルのチェック）

---

## 9. API呼び出しフロー図

### 9.1 クイズプレイの全体フロー

```
[トップ画面]
    │
    ├─ GET /api/achievement           ← 日本地図の色付けデータ取得
    │
    ├─ GET /api/usage/check           ← 利用上限チェック（スタート前）
    │
    └─ [ゲームスタート！]
         │
         ├─ POST /api/quiz/generate   ← クイズ5問生成（Gemini API）
         │
         │  [クイズ画面]
         │    │
         │    ├─ POST /api/quiz/answer  ← 1問目回答
         │    ├─ POST /api/quiz/answer  ← 2問目回答
         │    ├─ POST /api/quiz/answer  ← 3問目回答
         │    ├─ POST /api/quiz/answer  ← 4問目回答
         │    ├─ POST /api/quiz/answer  ← 5問目回答
         │    │
         │    └─ POST /api/quiz/complete ← セッション完了処理
         │
         └─ [結果画面]
              │
              └─ GET /api/quiz/session/{id} ← 結果データ取得
```

### 9.2 回答履歴の閲覧フロー

```
[回答履歴画面]
    │
    ├─ GET /api/history?page=1        ← セッション一覧取得
    │
    ├─ GET /api/history/{sessionId}   ← 折りたたみ展開時に詳細取得
    │
    └─ GET /api/history?page=2        ← ページ切り替え時
```

### 9.3 達成状況の閲覧フロー

```
[達成状況画面]
    │
    └─ GET /api/achievement           ← 全統計データ取得
```
