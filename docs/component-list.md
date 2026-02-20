# JapanMaster コンポーネント一覧・設計書

> 要件定義書（requirements.md）および機能要件書（functional-requirements.md）に基づき、
> React コンポーネントの一覧と各コンポーネントの設計を定義する。

---

## 配色定義（和風デザイン）

| 名前 | カラーコード | 用途 |
|------|-------------|------|
| 紺（navy） | `#1B2A4A` | ヘッダー背景、テキスト（見出し）、ナビゲーション |
| 朱色（vermilion） | `#C53D43` | メインボタン、アクセント、正解ハイライト |
| 金（gold） | `#C4A962` | 装飾線、バッジ、ステップ番号、区切り線 |
| 白〜生成り（cream） | `#FAF8F5` | 背景色、カード背景 |
| 灰（gray） | `#6B7280` | 補助テキスト、非活性状態、プレースホルダー |
| 薄い緑（若草色） | `#90C978` | 初級正解の都道府県 |
| 緑（抹茶色） | `#5B8C3E` | 中級正解の都道府県 |
| 深い緑 | `#2D5A1E` | 上級正解の都道府県 |
| 未回答グレー | `#D1D5DB` | 未回答の都道府県 |
| エラー赤 | `#DC2626` | エラーメッセージ、不正解表示 |
| 成功緑 | `#16A34A` | 正解表示 |

---

## コンポーネント一覧表

### layout（レイアウト系）

| # | コンポーネント名 | ファイル | 使用画面 | 概要 |
|---|----------------|---------|---------|------|
| L1 | Header | `layout/Header.tsx` | 全画面（認証画面除く） | ヘッダー。PC版ナビゲーションリンク + スマホ版ハンバーガーメニュー |
| L2 | MobileMenu | `layout/MobileMenu.tsx` | 全画面（認証画面除く） | スマホ版ハンバーガーメニューの展開パネル |
| L3 | AuthLayout | `layout/AuthLayout.tsx` | ログイン、新規登録、パスワードリセット | 認証画面共通レイアウト（和風背景画像 + 白い枠のフォーム） |
| L4 | AppLayout | `layout/AppLayout.tsx` | 認証画面以外の全画面 | ヘッダー + メインコンテンツ + 広告バナーを含むレイアウト |
| L5 | AdBanner | `layout/AdBanner.tsx` | 全画面共通（画面下部） | 画面下部固定の広告バナースペース（フェーズ1は枠のみ） |

### quiz（クイズ関連）

| # | コンポーネント名 | ファイル | 使用画面 | 概要 |
|---|----------------|---------|---------|------|
| Q1 | GenreSelector | `quiz/GenreSelector.tsx` | トップ画面 | ジャンル選択ボタン群（地理 / 観光名所 / グルメ） |
| Q2 | DifficultySelector | `quiz/DifficultySelector.tsx` | トップ画面 | 難易度選択ボタン群（初級 / 中級 / 上級） |
| Q3 | QuizStartButton | `quiz/QuizStartButton.tsx` | トップ画面 | 「ゲームスタート！」ボタン |
| Q4 | StepSelector | `quiz/StepSelector.tsx` | トップ画面 | ジャンル→難易度→スタートの3ステップ選択を束ねるコンテナ |
| Q5 | QuizProgress | `quiz/QuizProgress.tsx` | クイズ画面 | 進捗表示（「問題 1 / 5」） |
| Q6 | QuizQuestion | `quiz/QuizQuestion.tsx` | クイズ画面 | 問題文の表示 |
| Q7 | QuizChoices | `quiz/QuizChoices.tsx` | クイズ画面 | 3択の選択肢ボタン群 |
| Q8 | AnswerButton | `quiz/AnswerButton.tsx` | クイズ画面 | 「回答する」確定ボタン |
| Q9 | AnswerResult | `quiz/AnswerResult.tsx` | クイズ画面 | 正解/不正解の表示 + 解説文 |
| Q10 | QuizNextButton | `quiz/QuizNextButton.tsx` | クイズ画面 | 「次の問題へ」/「結果を見る」ボタン |
| Q11 | QuizContainer | `quiz/QuizContainer.tsx` | クイズ画面 | Q5〜Q10を束ねるクイズ進行コンテナ |
| Q12 | QuizLoading | `quiz/QuizLoading.tsx` | クイズ画面 | クイズ生成中のローディング表示 |
| Q13 | QuizError | `quiz/QuizError.tsx` | クイズ画面 | クイズ生成失敗時のエラー表示 + 再試行ボタン |
| Q14 | ResultScore | `quiz/ResultScore.tsx` | 結果画面 | 正解数の大きな表示 + メッセージ |
| Q15 | ResultQuizList | `quiz/ResultQuizList.tsx` | 結果画面 | 全問一覧（正解/不正解 + 解説） |
| Q16 | ResultQuizItem | `quiz/ResultQuizItem.tsx` | 結果画面 | 全問一覧の1問分の表示 |
| Q17 | ResultActions | `quiz/ResultActions.tsx` | 結果画面 | 「同じ条件でもう一度」+「トップに戻る」ボタン |
| Q18 | ResultAdSpace | `quiz/ResultAdSpace.tsx` | 結果画面 | 結果画面専用の広告スペース |
| Q19 | HistorySessionList | `quiz/HistorySessionList.tsx` | 回答履歴画面 | セッション一覧のリスト表示 |
| Q20 | HistorySessionCard | `quiz/HistorySessionCard.tsx` | 回答履歴画面 | 各セッションの概要カード（折りたたみ対応） |
| Q21 | HistoryQuizDetail | `quiz/HistoryQuizDetail.tsx` | 回答履歴画面 | 折りたたみ展開時の問題詳細 |
| Q22 | DailyLimitNotice | `quiz/DailyLimitNotice.tsx` | トップ画面 | AI利用上限到達時の通知メッセージ |

### map（日本地図関連）

| # | コンポーネント名 | ファイル | 使用画面 | 概要 |
|---|----------------|---------|---------|------|
| M1 | JapanMap | `map/JapanMap.tsx` | トップ画面、達成状況画面 | SVG日本地図（47都道府県を個別に色制御） |
| M2 | PrefecturePath | `map/PrefecturePath.tsx` | JapanMap内部 | 各都道府県のSVGパス（色付け対応） |
| M3 | MapLegend | `map/MapLegend.tsx` | トップ画面、達成状況画面 | 地図の凡例（色の意味を表示） |
| M4 | AchievementSummary | `map/AchievementSummary.tsx` | 達成状況画面 | 制覇状況（○/47 + 進捗バー） |
| M5 | DifficultyProgress | `map/DifficultyProgress.tsx` | 達成状況画面 | 難易度別の制覇数表示 |
| M6 | OverallStats | `map/OverallStats.tsx` | 達成状況画面 | 総回答数 + 全体正答率 |
| M7 | GenreStats | `map/GenreStats.tsx` | 達成状況画面 | ジャンル別正答率 |

### ui（汎用部品）

| # | コンポーネント名 | ファイル | 使用画面 | 概要 |
|---|----------------|---------|---------|------|
| U1 | Button | `ui/Button.tsx` | 全画面 | 汎用ボタン（variant: primary / secondary / danger / ghost） |
| U2 | Input | `ui/Input.tsx` | ログイン、新規登録、パスワードリセット、設定 | テキスト入力フィールド（ラベル + エラーメッセージ対応） |
| U3 | PasswordInput | `ui/PasswordInput.tsx` | ログイン、新規登録、設定 | パスワード入力（表示/非表示トグル付き） |
| U4 | Checkbox | `ui/Checkbox.tsx` | 新規登録 | チェックボックス |
| U5 | LoadingSpinner | `ui/LoadingSpinner.tsx` | クイズ画面、各種処理中 | ローディングスピナーアニメーション |
| U6 | SkeletonLoader | `ui/SkeletonLoader.tsx` | 回答履歴、達成状況 | スケルトン表示（グレーの枠が点滅） |
| U7 | ProgressBar | `ui/ProgressBar.tsx` | 達成状況画面 | 進捗バー（パーセント表示対応） |
| U8 | Pagination | `ui/Pagination.tsx` | 回答履歴画面 | ページネーション |
| U9 | ConfirmDialog | `ui/ConfirmDialog.tsx` | 設定、ヘッダー（ログアウト） | 確認ダイアログ（「はい/いいえ」形式） |
| U10 | ErrorMessage | `ui/ErrorMessage.tsx` | 全画面（フォーム） | フォーム入力エラーメッセージ表示 |
| U11 | Toast | `ui/Toast.tsx` | 全画面 | トースト通知（成功/エラー/情報） |
| U12 | EmptyState | `ui/EmptyState.tsx` | 回答履歴、達成状況 | データがない場合のメッセージ表示 |
| U13 | ErrorPage | `ui/ErrorPage.tsx` | 404、500、ネットワークエラー | エラー画面（メッセージ + 戻るボタン） |
| U14 | PageLoadingBar | `ui/PageLoadingBar.tsx` | 全画面 | ページ遷移時の上部プログレスバー |
| U15 | GoogleLoginButton | `ui/GoogleLoginButton.tsx` | ログイン、新規登録 | 「Googleでログイン/登録」ボタン |

---

## 各コンポーネント詳細

---

### L1: Header

**ファイル:** `src/components/layout/Header.tsx`
**使用画面:** 認証画面（ログイン・新規登録・パスワードリセット）以外の全画面

#### Props

```typescript
// Propsなし（内部でログイン状態・画面幅を取得）
type HeaderProps = Record<string, never>;
```

#### 表示内容・動作

- 左側にアプリロゴ「JapanMaster」を表示（クリックでトップ画面 `/` に遷移）
- PC版（768px以上）: 右側にナビゲーションリンク「回答履歴」「達成状況」「設定」「ログアウト」を横並び表示
- スマホ版（767px以下）: 右側にハンバーガーメニューアイコン（≡）を表示、タップで `MobileMenu` を開閉
- 「ログアウト」クリック時に `ConfirmDialog` を表示し、確認後に `signOut()` を実行してログイン画面へ遷移

#### 配色

- 背景: 紺 `#1B2A4A`
- ロゴ・ナビテキスト: 白〜生成り `#FAF8F5`
- ロゴ下部の装飾線: 金 `#C4A962`
- ナビリンクホバー: 朱色 `#C53D43`

---

### L2: MobileMenu

**ファイル:** `src/components/layout/MobileMenu.tsx`
**使用画面:** 全画面（スマホ表示時、Header内部から呼び出し）

#### Props

```typescript
type MobileMenuProps = {
  /** メニューの開閉状態 */
  isOpen: boolean;
  /** メニューを閉じるコールバック */
  onClose: () => void;
};
```

#### 表示内容・動作

- 画面右側からスライドインするオーバーレイメニュー
- メニュー項目: 「回答履歴」「達成状況」「設定」「ログアウト」を縦並びで表示
- メニュー外タップまたは閉じるボタン（×）で閉じる
- 「ログアウト」タップ時に `ConfirmDialog` を表示

#### 配色

- 背景: 紺 `#1B2A4A`（やや半透明）
- オーバーレイ背景: 黒の半透明
- メニューテキスト: 白〜生成り `#FAF8F5`
- メニュー項目間の区切り線: 金 `#C4A962`（半透明）

---

### L3: AuthLayout

**ファイル:** `src/components/layout/AuthLayout.tsx`
**使用画面:** ログイン画面、新規登録画面、パスワードリセット画面

#### Props

```typescript
type AuthLayoutProps = {
  /** ページタイトル（例: "ログイン"、"新規登録"） */
  title: string;
  /** フォーム等の子要素 */
  children: React.ReactNode;
};
```

#### 表示内容・動作

- 和風の背景画像（または背景パターン）を全画面に表示
- 中央に白いカード（角丸）を配置し、その中にアプリロゴ + タイトル + `children` を表示
- カード幅は PC で最大 480px、スマホで画面幅 - 余白

#### 配色

- 背景: 紺 `#1B2A4A` にうっすらと和風パターン
- カード背景: 白〜生成り `#FAF8F5`
- タイトル文字: 紺 `#1B2A4A`
- カード上部装飾線: 朱色 `#C53D43`

---

### L4: AppLayout

**ファイル:** `src/components/layout/AppLayout.tsx`
**使用画面:** 認証画面以外の全画面

#### Props

```typescript
type AppLayoutProps = {
  /** メインコンテンツ */
  children: React.ReactNode;
};
```

#### 表示内容・動作

- `Header` + メインコンテンツ領域 + `AdBanner`（画面下部固定）の3段構成
- メインコンテンツ領域は `AdBanner` の高さ分だけ下部にパディングを確保

#### 配色

- 背景: 白〜生成り `#FAF8F5`

---

### L5: AdBanner

**ファイル:** `src/components/layout/AdBanner.tsx`
**使用画面:** 全画面共通（画面下部に固定表示）

#### Props

```typescript
type AdBannerProps = {
  /** バナーの高さ（デフォルト: 50px、結果画面用は90px） */
  height?: number;
};
```

#### 表示内容・動作

- 画面下部に固定表示（`position: fixed`）
- フェーズ1では「広告スペース」とだけ中央にテキスト表示
- 将来的に Google AdSense 等のスクリプトを埋め込む想定

#### 配色

- 背景: 灰 `#6B7280` の淡い色（`#F3F4F6`）
- テキスト: 灰 `#6B7280`
- 上部ボーダー: 灰の薄い線

---

### Q1: GenreSelector

**ファイル:** `src/components/quiz/GenreSelector.tsx`
**使用画面:** トップ画面

#### Props

```typescript
type Genre = 'geography' | 'sightseeing' | 'gourmet';

type GenreSelectorProps = {
  /** 現在選択されているジャンル（未選択ならnull） */
  selectedGenre: Genre | null;
  /** ジャンル選択時のコールバック */
  onSelect: (genre: Genre) => void;
};
```

#### 表示内容・動作

- 「ステップ1: ジャンルを選択」のラベル付き
- 3つのボタンを横並び（スマホでは縦並び）で表示: 「地理」「観光名所」「グルメ」
- 選択中のボタンはハイライト表示
- 既にジャンルが選択されている状態で別のジャンルをタップすると、難易度・スタートボタンがリセットされる

#### 配色

- ステップ番号: 金 `#C4A962`
- 未選択ボタン: 白〜生成り `#FAF8F5` 背景 + 紺 `#1B2A4A` テキスト + 紺ボーダー
- 選択中ボタン: 紺 `#1B2A4A` 背景 + 白 `#FAF8F5` テキスト
- ホバー: 紺の薄い背景

---

### Q2: DifficultySelector

**ファイル:** `src/components/quiz/DifficultySelector.tsx`
**使用画面:** トップ画面

#### Props

```typescript
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

type DifficultySelectorProps = {
  /** 現在選択されている難易度（未選択ならnull） */
  selectedDifficulty: Difficulty | null;
  /** 難易度選択時のコールバック */
  onSelect: (difficulty: Difficulty) => void;
};
```

#### 表示内容・動作

- 「ステップ2: 難易度を選択」のラベル付き
- ジャンル選択後にアニメーション付きで出現
- 3つのボタン: 「初級」「中級」「上級」
- 選択中のボタンはハイライト表示

#### 配色

- ステップ番号: 金 `#C4A962`
- 未選択ボタン: 白〜生成り `#FAF8F5` 背景 + 紺 `#1B2A4A` テキスト + 紺ボーダー
- 選択中ボタン: 朱色 `#C53D43` 背景 + 白 `#FAF8F5` テキスト
- ホバー: 朱色の薄い背景

---

### Q3: QuizStartButton

**ファイル:** `src/components/quiz/QuizStartButton.tsx`
**使用画面:** トップ画面

#### Props

```typescript
type QuizStartButtonProps = {
  /** ボタンクリック時のコールバック */
  onClick: () => void;
  /** ローディング中かどうか（上限チェック中など） */
  isLoading?: boolean;
};
```

#### 表示内容・動作

- 「ゲームスタート！」と表示される大きなボタン
- 難易度選択後にアニメーション付きで出現
- クリック時に AI 利用上限チェックを行い、上限内ならクイズ画面へ遷移

#### 配色

- 背景: 朱色 `#C53D43`
- テキスト: 白 `#FAF8F5`
- ホバー: 朱色の濃い色（`#A3323A`）
- 影: 紺系の薄い影

---

### Q4: StepSelector

**ファイル:** `src/components/quiz/StepSelector.tsx`
**使用画面:** トップ画面

#### Props

```typescript
type StepSelectorProps = {
  /** ゲームスタート時のコールバック（ジャンルと難易度を渡す） */
  onStart: (genre: Genre, difficulty: Difficulty) => void;
};
```

#### 表示内容・動作

- `GenreSelector` → `DifficultySelector` → `QuizStartButton` の3ステップを管理
- 各ステップの選択状態を内部で保持
- ジャンル再選択時に難易度とスタートボタンをリセット

#### 配色

- セクション背景: 白〜生成り `#FAF8F5` のカード
- 各ステップ間の区切り: 金 `#C4A962` の細線

---

### Q5: QuizProgress

**ファイル:** `src/components/quiz/QuizProgress.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type QuizProgressProps = {
  /** 現在の問題番号（1始まり） */
  currentQuestion: number;
  /** 全問題数（5） */
  totalQuestions: number;
};
```

#### 表示内容・動作

- 「問題 1 / 5」形式のテキスト表示
- 進捗を示すプログレスバーも併設（任意）

#### 配色

- テキスト: 紺 `#1B2A4A`
- 問題番号: 朱色 `#C53D43`（強調）
- プログレスバー背景: 灰 `#D1D5DB`
- プログレスバー充填: 金 `#C4A962`

---

### Q6: QuizQuestion

**ファイル:** `src/components/quiz/QuizQuestion.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type QuizQuestionProps = {
  /** 問題文 */
  questionText: string;
  /** 都道府県名 */
  prefecture: string;
  /** ジャンル表示用テキスト */
  genre: string;
};
```

#### 表示内容・動作

- 問題文を大きなテキストで表示
- 上部に都道府県名とジャンルのタグを表示

#### 配色

- 問題文テキスト: 紺 `#1B2A4A`
- 都道府県タグ背景: 紺 `#1B2A4A`、テキスト: 白 `#FAF8F5`
- ジャンルタグ背景: 金 `#C4A962`、テキスト: 紺 `#1B2A4A`

---

### Q7: QuizChoices

**ファイル:** `src/components/quiz/QuizChoices.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type ChoiceState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

type QuizChoicesProps = {
  /** 選択肢の配列（3つ） */
  choices: string[];
  /** 各選択肢の状態 */
  choiceStates: ChoiceState[];
  /** 選択肢タップ時のコールバック */
  onSelect: (index: number) => void;
  /** 選択不可かどうか（回答後はtrue） */
  disabled: boolean;
};
```

#### 表示内容・動作

- 3つの選択肢を縦並びのボタンとして表示
- タップでハイライト（他の選択肢は非ハイライトに戻る）
- 回答後: 正解は緑、不正解は赤でハイライトし、全ボタンを無効化

#### 配色

- デフォルト: 白 `#FAF8F5` 背景 + 紺 `#1B2A4A` テキスト + 紺ボーダー
- 選択中: 朱色 `#C53D43` ボーダー + 朱色の薄い背景（`#FDE8E8`）
- 正解: 成功緑 `#16A34A` ボーダー + 緑の薄い背景（`#DCFCE7`）
- 不正解: エラー赤 `#DC2626` ボーダー + 赤の薄い背景（`#FEE2E2`）
- 無効化: 灰 `#6B7280` テキスト + 灰の薄い背景

---

### Q8: AnswerButton

**ファイル:** `src/components/quiz/AnswerButton.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type AnswerButtonProps = {
  /** ボタンクリック時のコールバック */
  onClick: () => void;
  /** 選択肢が未選択の場合はtrue（非活性） */
  disabled: boolean;
  /** 処理中かどうか */
  isLoading?: boolean;
};
```

#### 表示内容・動作

- 「回答する」と表示
- 選択肢が選ばれていない場合は非活性（灰色）
- クリックで回答を確定し、正解/不正解の判定処理を実行

#### 配色

- 活性時: 朱色 `#C53D43` 背景 + 白 `#FAF8F5` テキスト
- 非活性時: 灰 `#D1D5DB` 背景 + 灰 `#6B7280` テキスト
- ホバー（活性時）: 朱色の濃い色

---

### Q9: AnswerResult

**ファイル:** `src/components/quiz/AnswerResult.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type AnswerResultProps = {
  /** 正解かどうか */
  isCorrect: boolean;
  /** 正解の選択肢テキスト */
  correctAnswer: string;
  /** 解説文 */
  explanation: string;
};
```

#### 表示内容・動作

- 正解時: 「正解！」を大きく表示
- 不正解時: 「不正解」を大きく表示 + 正解の選択肢を表示
- 解説文を表示

#### 配色

- 正解テキスト: 成功緑 `#16A34A`
- 不正解テキスト: エラー赤 `#DC2626`
- 正解選択肢: 成功緑 `#16A34A`
- 解説文: 紺 `#1B2A4A`
- 解説エリア背景: 金 `#C4A962` の薄い背景（`#F9F5E8`）
- 解説エリアボーダー: 金 `#C4A962`

---

### Q10: QuizNextButton

**ファイル:** `src/components/quiz/QuizNextButton.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type QuizNextButtonProps = {
  /** ボタンクリック時のコールバック */
  onClick: () => void;
  /** 最後の問題かどうか（trueなら「結果を見る」と表示） */
  isLastQuestion: boolean;
};
```

#### 表示内容・動作

- 通常: 「次の問題へ」と表示
- 5問目の回答後: 「結果を見る」と表示
- クリックで次の問題を表示、または結果画面へ遷移

#### 配色

- 背景: 紺 `#1B2A4A`
- テキスト: 白 `#FAF8F5`
- ホバー: 紺の少し明るい色
- 最後の問題時: 朱色 `#C53D43` 背景（強調）

---

### Q11: QuizContainer

**ファイル:** `src/components/quiz/QuizContainer.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type Quiz = {
  id: string;
  question: string;
  choices: [string, string, string];
  answer: string;
  explanation: string;
  prefecture: string;
};

type QuizContainerProps = {
  /** クイズデータ（5問） */
  quizzes: Quiz[];
  /** ジャンル表示名 */
  genreLabel: string;
  /** セッションID */
  sessionId: string;
  /** クイズ完了時のコールバック */
  onComplete: (score: number) => void;
};
```

#### 表示内容・動作

- Q5〜Q10のコンポーネントを統合し、クイズの進行を管理
- 現在の問題番号、選択状態、回答済みフラグなどの状態を内部で管理
- 1問回答するたびに `answers` テーブルへ保存
- 5問終了後に `quiz_sessions` と `prefecture_progress` を更新して結果画面へ遷移

#### 配色

- カード背景: 白 `#FAF8F5`
- カードボーダー: 灰の薄い線
- カード影: 紺系の薄い影

---

### Q12: QuizLoading

**ファイル:** `src/components/quiz/QuizLoading.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type QuizLoadingProps = {
  /** 表示メッセージ（デフォルト: "クイズを生成中です..."） */
  message?: string;
};
```

#### 表示内容・動作

- 画面中央に「クイズを生成中です...」のテキスト + スピナーアニメーションを表示
- リトライ中もこの画面を維持（リトライ中であることはユーザーに見せない）

#### 配色

- 背景: 白〜生成り `#FAF8F5`
- スピナー: 朱色 `#C53D43`
- テキスト: 紺 `#1B2A4A`

---

### Q13: QuizError

**ファイル:** `src/components/quiz/QuizError.tsx`
**使用画面:** クイズ画面

#### Props

```typescript
type QuizErrorProps = {
  /** エラーメッセージ */
  message: string;
  /** 再試行ボタンクリック時のコールバック */
  onRetry: () => void;
};
```

#### 表示内容・動作

- 「問題の生成に失敗しました。もう一度お試しください」のメッセージ表示
- 「再試行」ボタンを表示

#### 配色

- アイコン: エラー赤 `#DC2626`
- メッセージテキスト: 紺 `#1B2A4A`
- 再試行ボタン: 朱色 `#C53D43` 背景 + 白テキスト

---

### Q14: ResultScore

**ファイル:** `src/components/quiz/ResultScore.tsx`
**使用画面:** 結果画面

#### Props

```typescript
type ResultScoreProps = {
  /** 正解数 */
  score: number;
  /** 全問題数（5） */
  total: number;
};
```

#### 表示内容・動作

- 正解数を大きく表示（「5問中 3問正解！」）
- 正解数に応じたメッセージを表示:
  - 5問: 「パーフェクト！日本マスターへの道を順調に進んでいます！」
  - 3〜4問: 「いい調子です！もう少しで全問正解！」
  - 1〜2問: 「次はもっと上を目指しましょう！」
  - 0問: 「ドンマイ！挑戦することが大事です！」

#### 配色

- 正解数（数字）: 朱色 `#C53D43`（大きく）
- メッセージテキスト: 紺 `#1B2A4A`
- 背景装飾: 金 `#C4A962` のアクセント線

---

### Q15: ResultQuizList

**ファイル:** `src/components/quiz/ResultQuizList.tsx`
**使用画面:** 結果画面

#### Props

```typescript
type ResultQuizData = {
  questionNumber: number;
  prefecture: string;
  genre: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

type ResultQuizListProps = {
  /** 全問題の結果データ */
  results: ResultQuizData[];
};
```

#### 表示内容・動作

- 全5問を上から順に一覧表示（折りたたみなし）
- 各問題を `ResultQuizItem` で描画

#### 配色

- リスト背景: 白 `#FAF8F5`
- 各アイテム間の区切り線: 灰 `#E5E7EB`

---

### Q16: ResultQuizItem

**ファイル:** `src/components/quiz/ResultQuizItem.tsx`
**使用画面:** 結果画面（ResultQuizList内部）

#### Props

```typescript
type ResultQuizItemProps = ResultQuizData;
```

#### 表示内容・動作

- 問題番号 + 都道府県名 + ジャンル + 正解/不正解アイコンをヘッダー行に表示
- 問題文 + ユーザーの回答を表示
- 不正解の場合: 正解の選択肢 + 解説を追加表示

#### 配色

- 正解アイコン: 成功緑 `#16A34A`
- 不正解アイコン: エラー赤 `#DC2626`
- 都道府県タグ: 紺 `#1B2A4A` 背景
- 解説エリア: 金 `#C4A962` の薄い背景

---

### Q17: ResultActions

**ファイル:** `src/components/quiz/ResultActions.tsx`
**使用画面:** 結果画面

#### Props

```typescript
type ResultActionsProps = {
  /** 「同じ条件でもう一度」クリック時のコールバック */
  onRetry: () => void;
  /** 「トップに戻る」クリック時のコールバック */
  onBackToTop: () => void;
  /** リトライ処理中かどうか */
  isRetryLoading?: boolean;
};
```

#### 表示内容・動作

- 「同じ条件でもう一度」ボタン（メインアクション）
- 「トップに戻る」ボタン（サブアクション）
- 「同じ条件でもう一度」は AI 利用上限チェックを通してからクイズ画面へ遷移

#### 配色

- 同じ条件でもう一度: 朱色 `#C53D43` 背景 + 白テキスト
- トップに戻る: 白 `#FAF8F5` 背景 + 紺 `#1B2A4A` テキスト + 紺ボーダー

---

### Q18: ResultAdSpace

**ファイル:** `src/components/quiz/ResultAdSpace.tsx`
**使用画面:** 結果画面

#### Props

```typescript
type ResultAdSpaceProps = Record<string, never>;
```

#### 表示内容・動作

- 結果画面の全問一覧下に配置する追加の広告スペース
- フェーズ1では「広告スペース」のプレースホルダーのみ表示

#### 配色

- 背景: 灰の薄い色（`#F3F4F6`）
- テキスト: 灰 `#6B7280`
- ボーダー: 灰の破線

---

### Q19: HistorySessionList

**ファイル:** `src/components/quiz/HistorySessionList.tsx`
**使用画面:** 回答履歴画面

#### Props

```typescript
type SessionSummary = {
  id: string;
  playedAt: string;
  genre: string;
  difficulty: string;
  score: number;
  total: number;
};

type HistorySessionListProps = {
  /** セッション一覧データ */
  sessions: SessionSummary[];
  /** ページ情報 */
  currentPage: number;
  /** 総ページ数 */
  totalPages: number;
  /** ページ変更時のコールバック */
  onPageChange: (page: number) => void;
};
```

#### 表示内容・動作

- セッション一覧を新しい順に表示
- 各セッションを `HistorySessionCard` で描画
- 下部に `Pagination` を配置
- データがない場合は `EmptyState` を表示

#### 配色

- リスト背景: 白〜生成り `#FAF8F5`

---

### Q20: HistorySessionCard

**ファイル:** `src/components/quiz/HistorySessionCard.tsx`
**使用画面:** 回答履歴画面（HistorySessionList内部）

#### Props

```typescript
type HistorySessionCardProps = {
  /** セッション概要 */
  session: SessionSummary;
  /** 展開状態 */
  isExpanded: boolean;
  /** 展開/折りたたみトグルのコールバック */
  onToggle: () => void;
  /** 展開時の問題詳細データ */
  details: ResultQuizData[] | null;
  /** 詳細データ読み込み中か */
  isLoadingDetails: boolean;
};
```

#### 表示内容・動作

- 概要行: 日付 + ジャンル + 難易度 + 正解数 + 展開アイコン（▼/▲）
- タップで折りたたみを展開/閉じる
- 展開時は `HistoryQuizDetail` で全問題を表示
- 初回展開時にデータを取得（スケルトン表示中）

#### 配色

- カード背景: 白 `#FAF8F5`
- カードボーダー: 灰 `#E5E7EB`
- 日付テキスト: 灰 `#6B7280`
- ジャンルタグ: 金 `#C4A962` 背景
- 難易度タグ: 紺 `#1B2A4A` 背景
- 正解数テキスト: 朱色 `#C53D43`

---

### Q21: HistoryQuizDetail

**ファイル:** `src/components/quiz/HistoryQuizDetail.tsx`
**使用画面:** 回答履歴画面（HistorySessionCard内部、展開時）

#### Props

```typescript
type HistoryQuizDetailProps = {
  /** 問題詳細データの配列 */
  quizDetails: ResultQuizData[];
};
```

#### 表示内容・動作

- 各問題の問題文 + 正解/不正解 + 解説を表示
- 不正解の問題は正解の選択肢と解説を再表示

#### 配色

- 正解アイコン: 成功緑 `#16A34A`
- 不正解アイコン: エラー赤 `#DC2626`
- 解説エリア背景: 金 `#C4A962` の薄い背景

---

### Q22: DailyLimitNotice

**ファイル:** `src/components/quiz/DailyLimitNotice.tsx`
**使用画面:** トップ画面

#### Props

```typescript
type DailyLimitNoticeProps = {
  /** 表示するかどうか */
  isVisible: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
};
```

#### 表示内容・動作

- 「本日の利用上限に達しました。明日またお楽しみください」のメッセージ表示
- 閉じるボタン付き

#### 配色

- 背景: 金 `#C4A962` の薄い背景（`#FEF9E7`）
- ボーダー: 金 `#C4A962`
- テキスト: 紺 `#1B2A4A`
- アイコン: 金 `#C4A962`

---

### M1: JapanMap

**ファイル:** `src/components/map/JapanMap.tsx`
**使用画面:** トップ画面、達成状況画面

#### Props

```typescript
type PrefectureStatus = {
  /** 都道府県コード（01〜47） */
  code: string;
  /** 都道府県名 */
  name: string;
  /** 最高クリア難易度（未回答ならnull） */
  maxDifficulty: 'beginner' | 'intermediate' | 'advanced' | null;
};

type JapanMapProps = {
  /** 47都道府県の達成状況データ */
  prefectures: PrefectureStatus[];
  /** 地図タップ時のコールバック */
  onClick?: () => void;
  /** 表示サイズ（レスポンシブ対応） */
  size?: 'small' | 'large';
};
```

#### 表示内容・動作

- SVG形式の日本地図を表示
- 47都道府県を個別の `PrefecturePath` として描画
- 各都道府県の色は `maxDifficulty` に基づいて決定
- トップ画面では地図全体をタップで達成状況画面へ遷移（`onClick`）
- レスポンシブ対応（PCでは大きめ、スマホでは画面幅に合わせて縮小）

#### 配色

- 未回答: 未回答グレー `#D1D5DB`
- 初級正解: 薄い緑（若草色）`#90C978`
- 中級正解: 緑（抹茶色）`#5B8C3E`
- 上級正解: 深い緑 `#2D5A1E`
- 都道府県ボーダー: 白 `#FFFFFF`
- 背景（海）: 白〜生成り `#FAF8F5`

---

### M2: PrefecturePath

**ファイル:** `src/components/map/PrefecturePath.tsx`
**使用画面:** JapanMap内部

#### Props

```typescript
type PrefecturePathProps = {
  /** SVGのpath data（d属性） */
  pathData: string;
  /** 塗りつぶし色 */
  fillColor: string;
  /** 都道府県名（ツールチップ用） */
  name: string;
  /** 都道府県コード */
  code: string;
};
```

#### 表示内容・動作

- SVGの `<path>` 要素として描画
- ホバー時にツールチップで都道府県名を表示
- ホバー時に色をやや明るく変化

#### 配色

- 色は `fillColor` Propsで受け取る（親コンポーネントから制御）
- ストローク: 白 `#FFFFFF`
- ホバー時: 元の色の明度を上げた色

---

### M3: MapLegend

**ファイル:** `src/components/map/MapLegend.tsx`
**使用画面:** トップ画面、達成状況画面

#### Props

```typescript
type MapLegendProps = Record<string, never>;
```

#### 表示内容・動作

- 色の意味を説明する凡例を表示:
  - グレー: 未回答
  - 薄い緑: 初級クリア
  - 緑: 中級クリア
  - 深い緑: 上級クリア

#### 配色

- テキスト: 灰 `#6B7280`
- 各色サンプル: 上記の配色定義に準拠

---

### M4: AchievementSummary

**ファイル:** `src/components/map/AchievementSummary.tsx`
**使用画面:** 達成状況画面

#### Props

```typescript
type AchievementSummaryProps = {
  /** クリア済みの都道府県数 */
  clearedCount: number;
  /** 全都道府県数（47） */
  totalCount: number;
};
```

#### 表示内容・動作

- 「47都道府県中 ○個クリア」をテキストで表示
- 進捗バー（`ProgressBar`）で視覚的に表示
- パーセンテージも併記

#### 配色

- テキスト: 紺 `#1B2A4A`
- 数字: 朱色 `#C53D43`（強調）
- 進捗バー充填: 朱色 `#C53D43`
- 進捗バー背景: 灰 `#E5E7EB`

---

### M5: DifficultyProgress

**ファイル:** `src/components/map/DifficultyProgress.tsx`
**使用画面:** 達成状況画面

#### Props

```typescript
type DifficultyProgressProps = {
  /** 初級クリア数 */
  beginnerCount: number;
  /** 中級クリア数 */
  intermediateCount: number;
  /** 上級クリア数 */
  advancedCount: number;
  /** 全都道府県数（47） */
  totalCount: number;
};
```

#### 表示内容・動作

- 各難易度の制覇数を「初級: ○/47」形式で表示
- 各難易度に対応する進捗バーを表示

#### 配色

- 初級バー: 薄い緑（若草色）`#90C978`
- 中級バー: 緑（抹茶色）`#5B8C3E`
- 上級バー: 深い緑 `#2D5A1E`
- テキスト: 紺 `#1B2A4A`

---

### M6: OverallStats

**ファイル:** `src/components/map/OverallStats.tsx`
**使用画面:** 達成状況画面

#### Props

```typescript
type OverallStatsProps = {
  /** 総回答数 */
  totalAnswers: number;
  /** 正解数 */
  correctAnswers: number;
};
```

#### 表示内容・動作

- 総回答数を表示
- 全体正答率（正解数 / 総回答数 * 100）を計算して表示
- 正答率を `ProgressBar` で視覚化
- データがない場合は「まだ回答がありません」を表示

#### 配色

- テキスト: 紺 `#1B2A4A`
- 正答率の数字: 朱色 `#C53D43`
- 進捗バー充填: 金 `#C4A962`

---

### M7: GenreStats

**ファイル:** `src/components/map/GenreStats.tsx`
**使用画面:** 達成状況画面

#### Props

```typescript
type GenreStatItem = {
  /** ジャンルの表示名 */
  label: string;
  /** 正答率（0〜100） */
  rate: number;
  /** 回答数 */
  totalAnswers: number;
};

type GenreStatsProps = {
  /** ジャンル別の正答率データ */
  genres: GenreStatItem[];
};
```

#### 表示内容・動作

- ジャンル別（地理 / 観光名所 / グルメ）の正答率を表示
- 各ジャンルに `ProgressBar` を表示

#### 配色

- テキスト: 紺 `#1B2A4A`
- 地理の進捗バー: 紺 `#1B2A4A`
- 観光名所の進捗バー: 朱色 `#C53D43`
- グルメの進捗バー: 金 `#C4A962`

---

### U1: Button

**ファイル:** `src/components/ui/Button.tsx`
**使用画面:** 全画面

#### Props

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  /** ボタンのバリアント */
  variant?: ButtonVariant;
  /** ボタンのサイズ */
  size?: ButtonSize;
  /** ボタンのテキストまたは子要素 */
  children: React.ReactNode;
  /** クリック時のコールバック */
  onClick?: () => void;
  /** 非活性かどうか */
  disabled?: boolean;
  /** ローディング中かどうか */
  isLoading?: boolean;
  /** ボタンのtype属性 */
  type?: 'button' | 'submit';
  /** 幅を100%にするか */
  fullWidth?: boolean;
};
```

#### 表示内容・動作

- バリアントに応じたスタイルのボタンを表示
- ローディング中はスピナーを表示し、クリック不可に
- disabled時は灰色に変化

#### 配色

| バリアント | 背景 | テキスト | ボーダー |
|-----------|------|---------|---------|
| primary | 朱色 `#C53D43` | 白 `#FAF8F5` | なし |
| secondary | 白 `#FAF8F5` | 紺 `#1B2A4A` | 紺 `#1B2A4A` |
| danger | エラー赤 `#DC2626` | 白 `#FAF8F5` | なし |
| ghost | 透明 | 紺 `#1B2A4A` | なし |
| disabled（共通） | 灰 `#D1D5DB` | 灰 `#6B7280` | なし |

---

### U2: Input

**ファイル:** `src/components/ui/Input.tsx`
**使用画面:** ログイン、新規登録、パスワードリセット、設定

#### Props

```typescript
type InputProps = {
  /** ラベルテキスト */
  label: string;
  /** input の name属性 */
  name: string;
  /** input の type属性 */
  type?: 'text' | 'email';
  /** プレースホルダー */
  placeholder?: string;
  /** 現在の値 */
  value: string;
  /** 値変更時のコールバック */
  onChange: (value: string) => void;
  /** エラーメッセージ（あれば赤字で表示） */
  error?: string;
  /** 非活性かどうか */
  disabled?: boolean;
};
```

#### 表示内容・動作

- ラベル + テキスト入力フィールド + エラーメッセージの3段構成
- エラーがある場合はボーダーが赤に変化し、下にエラーメッセージを表示

#### 配色

- ラベル: 紺 `#1B2A4A`
- 入力欄背景: 白 `#FFFFFF`
- 入力欄ボーダー（通常）: 灰 `#D1D5DB`
- 入力欄ボーダー（フォーカス）: 紺 `#1B2A4A`
- 入力欄ボーダー（エラー）: エラー赤 `#DC2626`
- プレースホルダー: 灰 `#9CA3AF`
- エラーメッセージ: エラー赤 `#DC2626`

---

### U3: PasswordInput

**ファイル:** `src/components/ui/PasswordInput.tsx`
**使用画面:** ログイン、新規登録、設定

#### Props

```typescript
type PasswordInputProps = {
  /** ラベルテキスト */
  label: string;
  /** input の name属性 */
  name: string;
  /** プレースホルダー */
  placeholder?: string;
  /** 現在の値 */
  value: string;
  /** 値変更時のコールバック */
  onChange: (value: string) => void;
  /** エラーメッセージ */
  error?: string;
  /** 非活性かどうか */
  disabled?: boolean;
};
```

#### 表示内容・動作

- `Input` をベースに、右端に目のアイコン（表示/非表示トグル）を追加
- アイコンクリックで `type` を `password` / `text` に切り替え

#### 配色

- `Input` と同じ
- トグルアイコン: 灰 `#6B7280`

---

### U4: Checkbox

**ファイル:** `src/components/ui/Checkbox.tsx`
**使用画面:** 新規登録画面

#### Props

```typescript
type CheckboxProps = {
  /** ラベル（ReactNodeでリンクを含められる） */
  label: React.ReactNode;
  /** チェック状態 */
  checked: boolean;
  /** 変更時のコールバック */
  onChange: (checked: boolean) => void;
  /** エラーメッセージ */
  error?: string;
};
```

#### 表示内容・動作

- チェックボックス + ラベルテキスト
- ラベル内に「利用規約」「プライバシーポリシー」へのリンクを含む
- エラー時は赤字でメッセージ表示

#### 配色

- チェックボックス（未チェック）: 白背景 + 灰ボーダー `#D1D5DB`
- チェックボックス（チェック済み）: 朱色 `#C53D43` 背景 + 白チェックマーク
- ラベルテキスト: 紺 `#1B2A4A`
- リンク: 朱色 `#C53D43`

---

### U5: LoadingSpinner

**ファイル:** `src/components/ui/LoadingSpinner.tsx`
**使用画面:** 各種処理中

#### Props

```typescript
type LoadingSpinnerProps = {
  /** スピナーのサイズ */
  size?: 'sm' | 'md' | 'lg';
  /** テキスト（スピナー下に表示） */
  text?: string;
};
```

#### 表示内容・動作

- CSSアニメーションで回転するスピナーを表示
- `text` が指定されていればスピナーの下にテキスト表示

#### 配色

- スピナー: 朱色 `#C53D43`
- テキスト: 灰 `#6B7280`

---

### U6: SkeletonLoader

**ファイル:** `src/components/ui/SkeletonLoader.tsx`
**使用画面:** 回答履歴画面、達成状況画面

#### Props

```typescript
type SkeletonLoaderProps = {
  /** スケルトンの種類 */
  variant?: 'text' | 'card' | 'list';
  /** 繰り返す行数（listの場合） */
  lines?: number;
};
```

#### 表示内容・動作

- グレーの枠が点滅するアニメーションを表示
- `variant` に応じた形状（テキスト行、カード型、リスト型）

#### 配色

- スケルトン基本色: 灰 `#E5E7EB`
- スケルトンアニメーション色: 灰の明るい色 `#F3F4F6`

---

### U7: ProgressBar

**ファイル:** `src/components/ui/ProgressBar.tsx`
**使用画面:** 達成状況画面

#### Props

```typescript
type ProgressBarProps = {
  /** 現在の値（0〜max） */
  value: number;
  /** 最大値 */
  max: number;
  /** バーの充填色（デフォルト: 朱色） */
  color?: string;
  /** パーセント表示を隣に出すか */
  showPercent?: boolean;
  /** バーの高さ */
  height?: number;
};
```

#### 表示内容・動作

- 水平の進捗バーを表示
- `value / max * 100` で充填率を計算
- `showPercent` が true の場合、右側にパーセンテージを表示

#### 配色

- バー背景: 灰 `#E5E7EB`
- バー充填: `color` Propsで制御（デフォルト: 朱色 `#C53D43`）
- パーセント数字: 紺 `#1B2A4A`

---

### U8: Pagination

**ファイル:** `src/components/ui/Pagination.tsx`
**使用画面:** 回答履歴画面

#### Props

```typescript
type PaginationProps = {
  /** 現在のページ番号（1始まり） */
  currentPage: number;
  /** 総ページ数 */
  totalPages: number;
  /** ページ変更時のコールバック */
  onPageChange: (page: number) => void;
};
```

#### 表示内容・動作

- 「← 前のページ [1] [2] [3] ... [10] 次のページ →」形式
- 現在のページはハイライト
- 先頭/末尾のページがない場合は前/次ボタンを非活性

#### 配色

- 現在のページ: 朱色 `#C53D43` 背景 + 白テキスト
- 他のページ: 白背景 + 紺 `#1B2A4A` テキスト
- 非活性ボタン: 灰 `#D1D5DB` テキスト
- ホバー: 紺の薄い背景

---

### U9: ConfirmDialog

**ファイル:** `src/components/ui/ConfirmDialog.tsx`
**使用画面:** 設定画面（アカウント削除）、ヘッダー（ログアウト）

#### Props

```typescript
type ConfirmDialogProps = {
  /** ダイアログの表示状態 */
  isOpen: boolean;
  /** タイトル */
  title: string;
  /** メッセージ本文 */
  message: string;
  /** 確認ボタンのテキスト（デフォルト: "はい"） */
  confirmLabel?: string;
  /** キャンセルボタンのテキスト（デフォルト: "いいえ"） */
  cancelLabel?: string;
  /** 確認ボタンを危険操作スタイルにするか */
  isDanger?: boolean;
  /** 確認時のコールバック */
  onConfirm: () => void;
  /** キャンセル時のコールバック */
  onCancel: () => void;
};
```

#### 表示内容・動作

- モーダルオーバーレイ + 中央にダイアログボックスを表示
- タイトル + メッセージ + 確認/キャンセルボタン
- ESCキーまたはオーバーレイクリックでキャンセル

#### 配色

- オーバーレイ: 黒の半透明
- ダイアログ背景: 白 `#FAF8F5`
- タイトル: 紺 `#1B2A4A`
- メッセージ: 灰 `#6B7280`
- 確認ボタン（通常）: 朱色 `#C53D43` 背景
- 確認ボタン（danger）: エラー赤 `#DC2626` 背景
- キャンセルボタン: 白背景 + 紺ボーダー

---

### U10: ErrorMessage

**ファイル:** `src/components/ui/ErrorMessage.tsx`
**使用画面:** フォームを含む全画面

#### Props

```typescript
type ErrorMessageProps = {
  /** エラーメッセージ（空文字またはundefinedなら非表示） */
  message?: string;
};
```

#### 表示内容・動作

- フォーム入力欄の下に赤字でエラーメッセージを表示
- メッセージがない場合は何も表示しない（高さも0）

#### 配色

- テキスト: エラー赤 `#DC2626`

---

### U11: Toast

**ファイル:** `src/components/ui/Toast.tsx`
**使用画面:** 全画面

#### Props

```typescript
type ToastType = 'success' | 'error' | 'info';

type ToastProps = {
  /** トーストの種類 */
  type: ToastType;
  /** 表示メッセージ */
  message: string;
  /** 表示状態 */
  isVisible: boolean;
  /** 閉じるコールバック */
  onClose: () => void;
  /** 自動で閉じるまでの秒数（デフォルト: 3秒） */
  duration?: number;
};
```

#### 表示内容・動作

- 画面上部に一定時間表示されるトースト通知
- 種類に応じたアイコンと色を使い分け
- 指定秒数後に自動的にフェードアウト

#### 配色

| 種類 | 背景 | ボーダー | アイコン |
|------|------|---------|---------|
| success | 緑の薄い背景 `#DCFCE7` | 成功緑 `#16A34A` | 成功緑 |
| error | 赤の薄い背景 `#FEE2E2` | エラー赤 `#DC2626` | エラー赤 |
| info | 紺の薄い背景 `#E8EAF0` | 紺 `#1B2A4A` | 紺 |

---

### U12: EmptyState

**ファイル:** `src/components/ui/EmptyState.tsx`
**使用画面:** 回答履歴画面、達成状況画面

#### Props

```typescript
type EmptyStateProps = {
  /** メッセージ */
  message: string;
  /** アクションボタンのテキスト（省略可） */
  actionLabel?: string;
  /** アクションボタンクリック時のコールバック */
  onAction?: () => void;
};
```

#### 表示内容・動作

- データがない場合にイラストまたはアイコン + メッセージを中央に表示
- オプションでアクションボタンを表示（例: 「トップページからクイズに挑戦してみましょう！」）

#### 配色

- アイコン: 灰 `#9CA3AF`
- メッセージテキスト: 灰 `#6B7280`
- アクションボタン: 朱色 `#C53D43`

---

### U13: ErrorPage

**ファイル:** `src/components/ui/ErrorPage.tsx`
**使用画面:** 404ページ、500ページ、ネットワークエラー

#### Props

```typescript
type ErrorPageProps = {
  /** HTTPステータスコード（表示用） */
  statusCode?: number;
  /** エラータイトル */
  title: string;
  /** エラーメッセージ */
  message: string;
  /** ボタンのテキスト */
  actionLabel: string;
  /** ボタンクリック時のコールバック */
  onAction: () => void;
};
```

#### 表示内容・動作

- 画面中央にエラーコード（大きく） + タイトル + メッセージ + アクションボタン
- 404: 「トップに戻る」ボタン
- 500: 「トップに戻る」ボタン
- ネットワークエラー: 「再読み込み」ボタン

#### 配色

- ステータスコード: 朱色 `#C53D43`（大きく太字）
- タイトル: 紺 `#1B2A4A`
- メッセージ: 灰 `#6B7280`
- ボタン: 朱色 `#C53D43` 背景 + 白テキスト

---

### U14: PageLoadingBar

**ファイル:** `src/components/ui/PageLoadingBar.tsx`
**使用画面:** 全画面（ページ遷移時）

#### Props

```typescript
type PageLoadingBarProps = {
  /** ローディング中かどうか */
  isLoading: boolean;
};
```

#### 表示内容・動作

- 画面最上部に細いプログレスバーを表示
- ページ遷移開始時にアニメーション開始、完了時にフェードアウト
- Next.js の `Router` イベントと連携

#### 配色

- バーの色: 朱色 `#C53D43`
- バーの背景: 透明

---

### U15: GoogleLoginButton

**ファイル:** `src/components/ui/GoogleLoginButton.tsx`
**使用画面:** ログイン画面、新規登録画面

#### Props

```typescript
type GoogleLoginButtonProps = {
  /** ボタンのラベル（"Googleでログイン" or "Googleで登録"） */
  label: string;
  /** クリック時のコールバック */
  onClick: () => void;
  /** ローディング中かどうか */
  isLoading?: boolean;
};
```

#### 表示内容・動作

- Googleのロゴアイコン + ラベルテキスト
- クリックで Supabase の `signInWithOAuth({ provider: 'google' })` を実行

#### 配色

- 背景: 白 `#FFFFFF`
- テキスト: 紺 `#1B2A4A`
- ボーダー: 灰 `#D1D5DB`
- ホバー: 灰の薄い背景 `#F9FAFB`
- Googleロゴ: Google公式カラー

---

## コンポーネントと画面の対応表

| 画面 | 使用コンポーネント |
|------|-------------------|
| ログイン画面（/login） | AuthLayout, Input, PasswordInput, Button, GoogleLoginButton, ErrorMessage, Toast |
| 新規登録画面（/register） | AuthLayout, Input, PasswordInput, Checkbox, Button, GoogleLoginButton, ErrorMessage, Toast |
| パスワードリセット画面（/reset-password） | AuthLayout, Input, Button, ErrorMessage, Toast |
| トップ画面（/） | AppLayout, JapanMap, MapLegend, StepSelector (GenreSelector, DifficultySelector, QuizStartButton), DailyLimitNotice, Button |
| クイズ画面（/quiz） | AppLayout, QuizContainer (QuizProgress, QuizQuestion, QuizChoices, AnswerButton, AnswerResult, QuizNextButton), QuizLoading, QuizError |
| 結果画面（/result） | AppLayout, ResultScore, ResultQuizList (ResultQuizItem), ResultActions, ResultAdSpace |
| 回答履歴画面（/history） | AppLayout, HistorySessionList (HistorySessionCard, HistoryQuizDetail), Pagination, SkeletonLoader, EmptyState |
| 達成状況画面（/achievement） | AppLayout, JapanMap, MapLegend, AchievementSummary, DifficultyProgress, OverallStats, GenreStats, ProgressBar, SkeletonLoader |
| 設定画面（/settings） | AppLayout, PasswordInput, Button, ConfirmDialog, ErrorMessage, Toast |
| エラー画面（404/500） | ErrorPage |

---

## ファイル構成（完全版）

```
src/components/
├── layout/
│   ├── Header.tsx           # L1: ヘッダー（PC/スマホ対応）
│   ├── MobileMenu.tsx       # L2: スマホ版ハンバーガーメニュー
│   ├── AuthLayout.tsx       # L3: 認証画面共通レイアウト
│   ├── AppLayout.tsx        # L4: アプリ画面共通レイアウト
│   └── AdBanner.tsx         # L5: 広告バナースペース
├── quiz/
│   ├── GenreSelector.tsx        # Q1: ジャンル選択
│   ├── DifficultySelector.tsx   # Q2: 難易度選択
│   ├── QuizStartButton.tsx      # Q3: ゲームスタートボタン
│   ├── StepSelector.tsx         # Q4: 3ステップ選択コンテナ
│   ├── QuizProgress.tsx         # Q5: 進捗表示
│   ├── QuizQuestion.tsx         # Q6: 問題文表示
│   ├── QuizChoices.tsx          # Q7: 3択選択肢
│   ├── AnswerButton.tsx         # Q8: 回答確定ボタン
│   ├── AnswerResult.tsx         # Q9: 正解/不正解 + 解説
│   ├── QuizNextButton.tsx       # Q10: 次の問題へボタン
│   ├── QuizContainer.tsx        # Q11: クイズ進行コンテナ
│   ├── QuizLoading.tsx          # Q12: クイズ生成中ローディング
│   ├── QuizError.tsx            # Q13: クイズ生成エラー
│   ├── ResultScore.tsx          # Q14: 結果画面 - 正解数表示
│   ├── ResultQuizList.tsx       # Q15: 結果画面 - 全問一覧
│   ├── ResultQuizItem.tsx       # Q16: 結果画面 - 1問分の表示
│   ├── ResultActions.tsx        # Q17: 結果画面 - アクションボタン
│   ├── ResultAdSpace.tsx        # Q18: 結果画面 - 広告スペース
│   ├── HistorySessionList.tsx   # Q19: 履歴 - セッション一覧
│   ├── HistorySessionCard.tsx   # Q20: 履歴 - セッションカード
│   ├── HistoryQuizDetail.tsx    # Q21: 履歴 - 問題詳細
│   └── DailyLimitNotice.tsx     # Q22: 利用上限通知
├── map/
│   ├── JapanMap.tsx             # M1: SVG日本地図
│   ├── PrefecturePath.tsx       # M2: 都道府県パス
│   ├── MapLegend.tsx            # M3: 地図凡例
│   ├── AchievementSummary.tsx   # M4: 制覇状況サマリー
│   ├── DifficultyProgress.tsx   # M5: 難易度別進捗
│   ├── OverallStats.tsx         # M6: 総合統計
│   └── GenreStats.tsx           # M7: ジャンル別統計
└── ui/
    ├── Button.tsx               # U1: 汎用ボタン
    ├── Input.tsx                # U2: テキスト入力
    ├── PasswordInput.tsx        # U3: パスワード入力
    ├── Checkbox.tsx             # U4: チェックボックス
    ├── LoadingSpinner.tsx       # U5: ローディングスピナー
    ├── SkeletonLoader.tsx       # U6: スケルトンローダー
    ├── ProgressBar.tsx          # U7: 進捗バー
    ├── Pagination.tsx           # U8: ページネーション
    ├── ConfirmDialog.tsx        # U9: 確認ダイアログ
    ├── ErrorMessage.tsx         # U10: エラーメッセージ
    ├── Toast.tsx                # U11: トースト通知
    ├── EmptyState.tsx           # U12: 空状態表示
    ├── ErrorPage.tsx            # U13: エラー画面
    ├── PageLoadingBar.tsx       # U14: ページ遷移ローディングバー
    └── GoogleLoginButton.tsx    # U15: Googleログインボタン
```

---

## 合計コンポーネント数

| カテゴリ | 数 |
|---------|-----|
| layout（レイアウト系） | 5 |
| quiz（クイズ関連） | 22 |
| map（日本地図関連） | 7 |
| ui（汎用部品） | 15 |
| **合計** | **49** |
