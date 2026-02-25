# Quiz Studio

## ブートキャンプ概要

このブートキャンプでは、**AIを活用したWebアプリ開発**を実践的に学びます。

- **対象**: エンジニア・非エンジニア問わず、AI時代の開発スキルを身につけたい方
- **学ぶこと**:
  - AIを使ったWebアプリ開発の基礎
  - 実務で使える開発フロー（Issue → ブランチ → PR → レビュー）
  - Claude等のLLMを活用した開発手法
- **最終日**: 作ったアプリをみんなの前でデモ発表

## Part A: Quiz Studio とは？

AIが**クイズを自動生成**してくれるWebアプリを作ります。

ユーザーがテーマやジャンルを指定すると、LLM（Claude / ChatGPT）がクイズ問題を生成。
ブラウザ上で回答でき、結果も確認できる、**デモ映えする本格的なアプリ**を目指します。

### 主な機能イメージ
- テーマを入力 → AIがクイズを自動生成
- ブラウザ上でクイズに回答
- 回答結果の表示・記録

### 使用技術
- **Next.js** (TypeScript) — フロントエンド＆API
- **Supabase** — データベース・認証
- **LLM (Claude / ChatGPT)** — クイズ生成

---



## セットアップ

```bash
# リポジトリをクローン
git clone <your-repo-url>
cd <your-repo-name>

# 依存パッケージをインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して必要な値を設定

# 開発サーバーを起動
npm run dev
```

http://localhost:3000 をブラウザで開いて確認

## デプロイ

### 本番環境
- **URL**: https://template-a-quiz-studio.vercel.app
- **ホスティング**: Vercel（Hobbyプラン）
- **ブランチ**: `main` にプッシュすると自動デプロイ

### 環境変数（Vercelに設定済み）
| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | SupabaseプロジェクトのURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabaseの公開キー |
| `GEMINI_API_KEY` | Google Gemini APIキー（クイズ生成用） |

## スクリプト

| コマンド | 説明 |
|----------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run lint` | ESLint実行 |
| `npm test` | テスト実行 |

## ディレクトリ構成

```
├─ .github/           # PR/Issueテンプレ、CI
├─ docs/logic-gate/   # L1〜L3 Logic Gateテンプレ
├─ src/               # アプリケーションコード
├─ .env.example       # 環境変数テンプレ
└─ package.json
```

