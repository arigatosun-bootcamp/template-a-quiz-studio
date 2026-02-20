# JapanMaster 実装準備チェックリスト

> 実装を始める前に確認・準備が必要な項目の一覧。
> 不明点や決定事項をここに記録し、抜け漏れを防ぐ。

---

## 1. 外部サービスの設定状況

| サービス | 用途 | 状態 | 対応内容 |
|----------|------|------|----------|
| Supabase | DB・認証 | ✅ 設定済み | テーブル作成済み、RLS設定済み |
| Supabase Auth（メール） | メール認証 | ✅ デフォルトで利用可能 | 送信元: noreply@mail.app.supabase.io |
| Google Cloud Console | Google OAuth | ❌ 未設定 | OAuth同意画面 + クライアントID取得が必要 |
| Supabase Auth（Google） | Googleログイン | ❌ 未設定 | Google OAuth クライアントID/Secretを登録 |
| Google AI (Gemini API) | クイズ生成 | ❌ 未取得 | https://aistudio.google.com でAPIキー取得 |
| Vercel | デプロイ | ⏳ 開発完了後 | Day5以降に設定 |

---

## 2. Google OAuth 設定手順（Day1で実施）

### Google Cloud Console側

1. https://console.cloud.google.com にアクセス
2. プロジェクトを作成（または既存プロジェクトを選択）
3. 「APIとサービス」→「OAuth同意画面」を設定
   - アプリ名: JapanMaster
   - ユーザーサポートメール: 自分のメールアドレス
   - スコープ: email, profile
4. 「認証情報」→「認証情報を作成」→「OAuthクライアントID」
   - アプリケーションの種類: ウェブアプリケーション
   - 承認済みリダイレクトURI: `https://hqgawmmdusecvmsinzod.supabase.co/auth/v1/callback`
5. クライアントIDとクライアントシークレットをコピー

### Supabase側

1. Supabaseダッシュボード → Authentication → Providers
2. Google を有効化
3. Google Cloud Consoleで取得したクライアントID/Secretを貼り付け
4. 保存

---

## 3. Gemini APIキー取得手順

1. https://aistudio.google.com にアクセス
2. Googleアカウントでログイン
3. 左メニュー「Get API key」→「Create API key」でキーを生成
4. `.env.local` に設定:
   ```
   GEMINI_API_KEY=AIzaSy...
   ```

### 料金目安

| 項目 | 目安 |
|------|------|
| Gemini 2.0 Flash 無料枠 | 1日1500リクエストまで無料 |
| 1回のクイズ生成（5問） | 無料枠内なら $0 |
| 無料枠を超えた場合 | 100万トークンあたり約 $0.10 |

※ 開発・テスト段階では無料枠で十分まかなえる。

---

## 4. 日本地図SVG

| 項目 | 決定事項 |
|------|----------|
| 調達方法 | フリー素材を利用 or 生成 |
| 要件 | 47都道府県を個別の`<path>`要素で持ち、IDまたはclass属性で特定できること |
| 色制御 | CSS or JavaScriptでfill属性を変更して色付けする |
| ファイル配置 | `public/images/japan-map.svg` または React コンポーネントとして `src/components/map/` 内に配置 |

---

## 5. 決定済みの方針

| 項目 | 決定内容 |
|------|----------|
| Googleログイン | Day1で実装（メール認証と同時） |
| メール送信元 | SupabaseデフォルトでOK |
| プライバシーポリシー・利用規約 | 仮テンプレートで作成 |
| デプロイ | 開発完了後（Day5以降） |
| デプロイ先 | Vercel |

---

## 6. 実装時の注意点

### アカウント削除の実装

Supabase Auth はクライアント側からユーザー自身を削除できない（セキュリティ上の制限）。
→ **サーバー側（API Route）で Supabase Admin API を使って削除する必要がある。**

```
DELETE /api/account
  → supabaseAdmin.auth.admin.deleteUser(userId)
  → CASCADE で全テーブルのデータが自動削除される
```

`.env.local` に `SUPABASE_SERVICE_ROLE_KEY` の追加が必要（Supabaseダッシュボードで取得）。

### ログイン失敗制限

要件: 5回連続失敗で30分ロック
→ **Supabase Auth にはネイティブのレート制限がある**が、細かい制御（5回/30分）はカスタム実装が必要な場合がある。実装時に確認する。

### クイズ画面のデータ受け渡し

トップ画面で選んだジャンル・難易度をクイズ画面に渡す方法:
→ **URLクエリパラメータ**を使用: `/quiz?genre=geography&difficulty=beginner`

### セッション管理

結果画面でセッションデータを表示する方法:
→ **URLクエリパラメータ**を使用: `/result?sessionId=xxxx-xxxx`

---

## 7. 環境変数一覧（最終版）

`.env.local` に必要なすべての環境変数:

```
# Supabase（設定済み）
NEXT_PUBLIC_SUPABASE_URL=https://hqgawmmdusecvmsinzod.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=（設定済み）

# Supabase Admin（アカウント削除用 / サーバー側のみ使用）
SUPABASE_SERVICE_ROLE_KEY=（Supabaseダッシュボードから取得）

# Gemini API（クイズ生成用）
GEMINI_API_KEY=（Google AI Studioから取得）

# App
APP_ENV=local
```

※ `NEXT_PUBLIC_` で始まる変数はブラウザに公開される。APIキーには絶対に付けないこと。
