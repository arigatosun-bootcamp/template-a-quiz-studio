---
name: daily-check
description: 指定Dayの完了チェックリストを実コードと照合する
argument-hint: "[Day番号 1-3]"
---

# Day $ARGUMENTS チェックリスト

指定されたDayのチェック項目を、実際のプロジェクト状態と照合して達成状況を報告してください。

以下の各Dayのチェック項目から Day $ARGUMENTS に該当する項目を確認し、
実際にファイルやgit状態をチェックして「達成 / 未達成」を判定してください。

参照ドキュメント:
- カリキュラム: `docs/training-curriculum.md`
- 進捗チェックシート: `docs/progress-checklist.md`
- 要件定義書: `docs/requirements.md`

---

## Day 1: 理解する & 基盤を作る

確認コマンド:
```bash
# Logic Gate の記入状況
wc -l docs/logic-gate/L1_requirements.md docs/logic-gate/L2_validation.md docs/logic-gate/L3_testplan.md

# ブランチとPRの状況
git branch -a
gh pr list --state all

# 環境設定
ls -la .env.local 2>/dev/null && echo ".env.local 存在する" || echo ".env.local 存在しない"
cat .gitignore | grep env

# 認証関連ファイルの存在
find src -type f -name "*.ts" -o -name "*.tsx" 2>/dev/null | head -20
```

チェック項目:

### 設計（Logic Gate）
- [ ] `docs/logic-gate/L1_requirements.md` の各セクション（目的、やること/やらないこと、使い方の流れ、保存データ、完了条件）が埋まっている
- [ ] `docs/logic-gate/L2_validation.md` のテーブルに最低8行のルールがある
- [ ] `docs/logic-gate/L3_testplan.md` のテーブルに12ケース以上のテストがある

### 開発フロー（Git/GitHub）
- [ ] mainブランチ以外のブランチが作成されている
- [ ] ブランチ名が `feat/issue-XX-機能名` の命名規則に従っている
- [ ] コミットメッセージに `feat:` / `docs:` 等のプレフィックスがある
- [ ] PR が作成されている
- [ ] PR がマージされている

### 環境構築（Supabase）
- [ ] `.env.local` が存在する
- [ ] `.env.local` が `.gitignore` に含まれている
- [ ] Supabase関連の接続設定コードが存在する
- [ ] DB テーブル（users / quizzes / answers / quiz_sessions / prefecture_progress）が作成されている

### 認証機能
- [ ] ログイン画面のコンポーネントが存在する
- [ ] 新規登録画面のコンポーネントが存在する
- [ ] パスワードリセット画面のコンポーネントが存在する
- [ ] ログイン画面にメール入力・PW入力・ログインボタン・Googleログインボタンがある
- [ ] 新規登録画面にメール・PW・PW確認・利用規約チェックがある
- [ ] ログアウト処理が実装されている

---

## Day 2: コア機能を作る

確認コマンド:
```bash
# API ルートの存在確認
find src -path "*/api/*" -type f 2>/dev/null

# クイズ関連コンポーネントの確認
find src -type f -name "*.tsx" 2>/dev/null | grep -i -E "quiz|result|top"

# Issue と PR の状況
gh issue list --state all
gh pr list --state all

# ビルド確認
npm run build 2>&1 | tail -10
```

チェック項目:

### 開発フロー
- [ ] Day 2 で複数回の Issue → Branch → PR → Merge サイクルを回している
- [ ] コミットメッセージに `feat:` プレフィックスがある
- [ ] PR本文に動作確認手順が記載されている

### クイズ生成API
- [ ] Claude API 連携のコードが存在する
- [ ] クイズ生成用のAPIルート（`/api/` 配下）が存在する
- [ ] 5問一括生成のロジックがある
- [ ] ジャンル（地理/観光名所/グルメ）の指定ができる
- [ ] 難易度（初級/中級/上級）の指定ができる
- [ ] AIレスポンスのJSONバリデーションがある
- [ ] エラー時の最大3回リトライ処理がある

### トップ画面
- [ ] トップ画面のコンポーネントが存在する
- [ ] ジャンル選択UI（地理/観光名所/グルメ）がある
- [ ] 難易度選択UI（初級/中級/上級）がある
- [ ] 「ゲームスタート！」ボタンがある
- [ ] 「回答履歴を見る」ボタンがある

### クイズ画面
- [ ] クイズ画面のコンポーネントが存在する
- [ ] 進捗表示（「問題 X / 5」）がある
- [ ] 選択肢の表示と選択機能がある
- [ ] 「回答する」ボタンで確定する機能がある
- [ ] 正解/不正解 + 解説の表示がある
- [ ] 「次の問題へ」ボタンがある
- [ ] 5問目で「結果を見る」ボタンに切り替わる

### 結果画面
- [ ] 結果画面のコンポーネントが存在する
- [ ] 正解数の表示がある
- [ ] 正解数に応じたメッセージ表示がある
- [ ] 全問の振り返り一覧がある
- [ ] 「同じ条件でもう一度」ボタンがある
- [ ] 「トップに戻る」ボタンがある

---

## Day 3: 仕上げる & 公開する

確認コマンド:
```bash
# 全画面のコンポーネント確認
find src -type f -name "*.tsx" 2>/dev/null

# ナビゲーション関連
find src -type f -name "*.tsx" 2>/dev/null | grep -i -E "header|nav|menu"

# エラーページ
find src -type f 2>/dev/null | grep -i -E "404|error|not-found|loading"

# Issue/PR の最終状況
gh issue list --state open
gh pr list --state open

# lint / test / build
npm run lint 2>&1 | tail -5
npm test 2>&1 | tail -10
npm run build 2>&1 | tail -10
```

チェック項目:

### 日本地図
- [ ] SVG日本地図のコンポーネントが存在する
- [ ] 47都道府県の個別色制御のロジックがある
- [ ] 色分けルール（グレー/薄い緑/緑/深い緑）が実装されている
- [ ] 地図タップで達成状況画面に遷移する

### 回答履歴画面
- [ ] 回答履歴画面のコンポーネントが存在する
- [ ] 日付・ジャンル・難易度・正解数の一覧表示がある
- [ ] 折りたたみ展開で各問題の詳細が見れる
- [ ] ページネーション（10件ごと）がある

### 達成状況画面
- [ ] 達成状況画面のコンポーネントが存在する
- [ ] 都道府県制覇状況（○/47 + 進捗バー）がある
- [ ] 難易度別の制覇数がある
- [ ] 総回答数と全体正答率がある
- [ ] ジャンル別正答率がある

### 設定画面
- [ ] 設定画面のコンポーネントが存在する
- [ ] パスワード変更機能がある
- [ ] アカウント削除機能（確認ダイアログ付き）がある

### ナビゲーション
- [ ] ヘッダーコンポーネントが存在する
- [ ] PC版: [JapanMaster] [回答履歴] [達成状況] [設定] [ログアウト] が並ぶ
- [ ] スマホ版: ハンバーガーメニューがある
- [ ] ログアウト時に確認ダイアログがある

### エラー・ローディング
- [ ] 404ページが存在する
- [ ] 500エラーページが存在する
- [ ] クイズ生成中のローディング表示がある
- [ ] AI利用上限の制限メッセージがある

### レスポンシブ
- [ ] 768pxでPC/スマホ表示が切り替わる

### デプロイ
- [ ] `npm run lint` がパスする
- [ ] `npm run build` が成功する
- [ ] Vercelにデプロイされている
- [ ] 環境変数がVercelに設定されている
- [ ] デプロイURLにアクセスしてアプリが動作する

### 最終確認
- [ ] 全PRがmainにマージされている
- [ ] 全Issueがcloseされている
- [ ] 全9画面が動作する

---

## 結果フォーマット

各項目を以下の形式で報告してください：

```
Day {N} チェック結果:

■ カテゴリ名
  [✅] 項目名 — 確認内容
  [❌] 項目名 — 不足している内容と対応方法
  [⚠️] 項目名 — 部分的に達成（詳細）

━━━━━━━━━━━━━━━━━━━━
達成率: X / Y 項目（XX%）
次にやるべきこと: ○○○
━━━━━━━━━━━━━━━━━━━━
```

チェック完了後、`docs/progress-checklist.md` の対応する項目も更新するよう案内してください。
