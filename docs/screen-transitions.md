# JapanMaster 画面遷移図

> 要件定義書・機能要件書に基づく全画面の遷移を網羅した文書。

---

## 1. 画面一覧

| # | 画面名 | パス | 認証要否 | ヘッダー表示 |
|---|--------|------|----------|-------------|
| 1 | ログイン画面 | `/login` | 不要（ログイン済みならトップへリダイレクト） | 非表示 |
| 2 | 新規登録画面 | `/register` | 不要（ログイン済みならトップへリダイレクト） | 非表示 |
| 3 | パスワードリセット画面 | `/reset-password` | 不要（ログイン済みならトップへリダイレクト） | 非表示 |
| 4 | トップ画面 | `/` | 必須 | 表示 |
| 5 | クイズ画面 | `/quiz` | 必須 | 表示 |
| 6 | 結果画面 | `/result` | 必須 | 表示 |
| 7 | 回答履歴画面 | `/history` | 必須 | 表示 |
| 8 | 達成状況画面 | `/achievement` | 必須 | 表示 |
| 9 | 設定画面 | `/settings` | 必須 | 表示 |
| 10 | エラー画面（404） | - | - | 表示 |
| 11 | エラー画面（500） | - | - | 表示 |
| 12 | ネットワークエラー | - | - | 表示 |

---

## 2. 画面遷移図（メインフロー）

```mermaid
flowchart TD
    START((アプリアクセス)) --> AUTH_CHECK{認証状態チェック}

    %% --- 認証分岐 ---
    AUTH_CHECK -->|未ログイン| LOGIN[/"1. ログイン画面<br/>/login"/]
    AUTH_CHECK -->|ログイン済み| TOP[/"4. トップ画面<br/>/"/]

    %% --- 認証系画面の遷移 ---
    LOGIN -->|「新規登録はこちら」リンク| REGISTER[/"2. 新規登録画面<br/>/register"/]
    LOGIN -->|「パスワードを忘れた方はこちら」リンク| RESET[/"3. パスワードリセット画面<br/>/reset-password"/]
    LOGIN -->|「ログイン」ボタン押下<br/>認証成功| TOP
    LOGIN -->|「Googleでログイン」ボタン押下<br/>認証成功| TOP

    REGISTER -->|「ログインはこちら」リンク| LOGIN
    REGISTER -->|「新規登録」ボタン押下<br/>登録成功| REG_CONFIRM["確認メール送信完了メッセージ表示"]
    REGISTER -->|「Googleで登録」ボタン押下<br/>認証成功| TOP
    REG_CONFIRM -->|メール内リンクをクリック| LOGIN

    RESET -->|「ログインに戻る」リンク| LOGIN
    RESET -->|「リセットメールを送信」ボタン押下| RESET_CONFIRM["リセットメール送信完了メッセージ表示"]
    RESET_CONFIRM -->|メール内リンクをクリック| RESET_NEW["パスワード再設定画面"]
    RESET_NEW -->|新パスワード設定成功| LOGIN

    %% --- トップ画面からの遷移 ---
    TOP -->|ジャンル選択→難易度選択→<br/>「ゲームスタート！」ボタン押下<br/>利用上限チェックOK| QUIZ[/"5. クイズ画面<br/>/quiz"/]
    TOP -->|ジャンル選択→難易度選択→<br/>「ゲームスタート！」ボタン押下<br/>利用上限超過| LIMIT_MSG["「本日の利用上限に達しました」<br/>メッセージ表示"]
    TOP -->|日本地図タップ| ACHIEVEMENT[/"8. 達成状況画面<br/>/achievement"/]
    TOP -->|「回答履歴を見る」ボタン押下| HISTORY[/"7. 回答履歴画面<br/>/history"/]

    %% --- クイズ画面からの遷移 ---
    QUIZ -->|5問回答完了→<br/>「結果を見る」ボタン押下| RESULT[/"6. 結果画面<br/>/result"/]
    QUIZ -->|AI生成失敗<br/>リトライ3回失敗| QUIZ_ERROR["「問題の生成に失敗しました」<br/>メッセージ + 再試行ボタン"]
    QUIZ_ERROR -->|「再試行」ボタン押下| QUIZ

    %% --- 結果画面からの遷移 ---
    RESULT -->|「同じ条件でもう一度」ボタン押下<br/>利用上限チェックOK| QUIZ
    RESULT -->|「同じ条件でもう一度」ボタン押下<br/>利用上限超過| LIMIT_MSG
    RESULT -->|「トップに戻る」ボタン押下| TOP

    %% --- ナビゲーション（ヘッダー/ハンバーガーメニュー） ---
    TOP -->|ヘッダー「回答履歴」| HISTORY
    TOP -->|ヘッダー「達成状況」| ACHIEVEMENT
    TOP -->|ヘッダー「設定」| SETTINGS[/"9. 設定画面<br/>/settings"/]

    HISTORY -->|ヘッダー「JapanMaster」ロゴ| TOP
    ACHIEVEMENT -->|ヘッダー「JapanMaster」ロゴ| TOP
    SETTINGS -->|ヘッダー「JapanMaster」ロゴ| TOP

    %% --- 設定画面からの遷移 ---
    SETTINGS -->|「アカウントを削除」→確認ダイアログ「削除する」| LOGIN

    %% --- ログアウト ---
    LOGOUT_ACTION["ログアウト処理"]
    TOP -->|ヘッダー「ログアウト」→<br/>確認ダイアログ「はい」| LOGOUT_ACTION
    LOGOUT_ACTION --> LOGIN

    %% --- エラー画面 ---
    ERROR_404[/"エラー画面（404）<br/>「ページが見つかりません」"/]
    ERROR_500[/"エラー画面（500）<br/>「サーバーでエラーが発生しました」"/]
    ERROR_NET[/"ネットワークエラー<br/>「通信に失敗しました」"/]

    ERROR_404 -->|「トップに戻る」ボタン押下| TOP
    ERROR_500 -->|「トップに戻る」ボタン押下| TOP
    ERROR_NET -->|「再読み込み」ボタン押下| RELOAD["ページリロード"]

    %% --- スタイル ---
    classDef authPage fill:#FFF3E0,stroke:#E65100,color:#000
    classDef mainPage fill:#E8F5E9,stroke:#2E7D32,color:#000
    classDef errorPage fill:#FFEBEE,stroke:#C62828,color:#000
    classDef message fill:#F3E5F5,stroke:#6A1B9A,color:#000
    classDef decision fill:#E3F2FD,stroke:#1565C0,color:#000

    class LOGIN,REGISTER,RESET authPage
    class TOP,QUIZ,RESULT,HISTORY,ACHIEVEMENT,SETTINGS mainPage
    class ERROR_404,ERROR_500,ERROR_NET errorPage
    class REG_CONFIRM,RESET_CONFIRM,RESET_NEW,LIMIT_MSG,QUIZ_ERROR message
    class AUTH_CHECK decision
```

---

## 3. 認証ガードフロー

```mermaid
flowchart TD
    ACCESS((任意の画面にアクセス)) --> CHECK{Supabase Auth<br/>getSession}

    CHECK -->|ログイン済み| IS_AUTH_PAGE{認証不要ページか？<br/>login / register /<br/>reset-password}
    CHECK -->|未ログイン| IS_PROTECTED{認証必要ページか？}

    IS_AUTH_PAGE -->|はい| REDIRECT_TOP["トップ画面（/）へリダイレクト"]
    IS_AUTH_PAGE -->|いいえ| SHOW_PAGE["そのまま画面を表示"]

    IS_PROTECTED -->|はい<br/>トップ / クイズ / 結果 /<br/>回答履歴 / 達成状況 / 設定| REDIRECT_LOGIN["ログイン画面（/login）へリダイレクト"]
    IS_PROTECTED -->|いいえ<br/>ログイン / 新規登録 /<br/>パスワードリセット / エラー| SHOW_PAGE

    classDef decision fill:#E3F2FD,stroke:#1565C0,color:#000
    classDef action fill:#E8F5E9,stroke:#2E7D32,color:#000
    classDef redirect fill:#FFF3E0,stroke:#E65100,color:#000

    class CHECK,IS_AUTH_PAGE,IS_PROTECTED decision
    class SHOW_PAGE action
    class REDIRECT_TOP,REDIRECT_LOGIN redirect
```

---

## 4. クイズフロー詳細

```mermaid
flowchart TD
    TOP_START["トップ画面で<br/>「ゲームスタート！」押下"] --> LIMIT_CHECK{利用上限チェック<br/>本日のセッション数<br/>>= 20回？}

    LIMIT_CHECK -->|上限超過| LIMIT_MSG["「本日の利用上限に<br/>達しました」表示"]
    LIMIT_CHECK -->|上限内| LOADING["ローディング表示<br/>「クイズを生成中です...」"]

    LOADING --> CREATE_SESSION["quiz_sessionsに<br/>新規セッション作成"]
    CREATE_SESSION --> SELECT_PREF["出題する5県を決定<br/>未正解の県を優先"]
    SELECT_PREF --> CALL_AI["Claude APIに<br/>5問の生成をリクエスト"]

    CALL_AI --> AI_RESULT{API応答}
    AI_RESULT -->|成功| SAVE_QUIZ["quizzesテーブルに<br/>5問をINSERT"]
    AI_RESULT -->|失敗 or タイムアウト<br/>10秒| RETRY_1["2秒待機→リトライ 2回目"]

    RETRY_1 --> AI_RESULT_2{API応答}
    AI_RESULT_2 -->|成功| SAVE_QUIZ
    AI_RESULT_2 -->|失敗 or タイムアウト| RETRY_2["4秒待機→リトライ 3回目"]

    RETRY_2 --> AI_RESULT_3{API応答}
    AI_RESULT_3 -->|成功| SAVE_QUIZ
    AI_RESULT_3 -->|失敗| FAIL_MSG["「問題の生成に失敗しました」<br/>+ 「再試行」ボタン表示"]
    FAIL_MSG -->|「再試行」押下| LOADING

    SAVE_QUIZ --> SHOW_Q["問題表示<br/>「問題 N / 5」"]
    SHOW_Q --> SELECT_CHOICE["選択肢をタップ<br/>ハイライト表示"]
    SELECT_CHOICE --> CONFIRM["「回答する」ボタン押下"]
    CONFIRM --> SAVE_ANS["answersテーブルに<br/>回答をINSERT"]
    SAVE_ANS --> JUDGE{正解？}

    JUDGE -->|正解| CORRECT["「正解！」表示<br/>正解の選択肢を緑ハイライト<br/>+ 解説表示"]
    JUDGE -->|不正解| WRONG["「不正解」表示<br/>選択を赤 / 正解を緑ハイライト<br/>+ 解説表示"]

    CORRECT --> IS_LAST{5問目？}
    WRONG --> IS_LAST

    IS_LAST -->|1〜4問目| NEXT["「次の問題へ」ボタン押下"]
    NEXT --> SHOW_Q

    IS_LAST -->|5問目| UPDATE_SESSION["quiz_sessionsの<br/>scoreを更新"]
    UPDATE_SESSION --> UPDATE_PREF["prefecture_progressを更新<br/>正解した県の最高難易度を反映"]
    UPDATE_PREF --> RESULT_BTN["「結果を見る」ボタン押下"]
    RESULT_BTN --> RESULT_PAGE["結果画面（/result）へ遷移"]

    classDef loading fill:#FFF9C4,stroke:#F57F17,color:#000
    classDef error fill:#FFEBEE,stroke:#C62828,color:#000
    classDef success fill:#E8F5E9,stroke:#2E7D32,color:#000
    classDef action fill:#E3F2FD,stroke:#1565C0,color:#000

    class LOADING,RETRY_1,RETRY_2 loading
    class FAIL_MSG,LIMIT_MSG,WRONG error
    class CORRECT,SAVE_QUIZ success
    class SHOW_Q,SELECT_CHOICE,CONFIRM action
```

---

## 5. ナビゲーション構造

```mermaid
flowchart LR
    subgraph HEADER["ヘッダー（認証済み画面共通）"]
        LOGO["JapanMasterロゴ"]
        NAV_HISTORY["回答履歴"]
        NAV_ACHIEVEMENT["達成状況"]
        NAV_SETTINGS["設定"]
        NAV_LOGOUT["ログアウト"]
    end

    LOGO -->|クリック| TOP_PAGE["トップ画面（/）"]
    NAV_HISTORY -->|クリック| HISTORY_PAGE["回答履歴画面（/history）"]
    NAV_ACHIEVEMENT -->|クリック| ACHIEVEMENT_PAGE["達成状況画面（/achievement）"]
    NAV_SETTINGS -->|クリック| SETTINGS_PAGE["設定画面（/settings）"]
    NAV_LOGOUT -->|クリック→確認ダイアログ「はい」| LOGIN_PAGE["ログイン画面（/login）"]

    subgraph TOP_EXTRA["トップ画面の追加導線"]
        MAP_TAP["日本地図タップ"]
        HISTORY_BTN["「回答履歴を見る」ボタン"]
    end

    MAP_TAP --> ACHIEVEMENT_PAGE
    HISTORY_BTN --> HISTORY_PAGE

    classDef header fill:#1B2A4A,stroke:#C4A962,color:#FAF8F5
    classDef page fill:#FAF8F5,stroke:#1B2A4A,color:#1B2A4A

    class LOGO,NAV_HISTORY,NAV_ACHIEVEMENT,NAV_SETTINGS,NAV_LOGOUT header
    class TOP_PAGE,HISTORY_PAGE,ACHIEVEMENT_PAGE,SETTINGS_PAGE,LOGIN_PAGE page
```

---

## 6. 画面遷移一覧表

### 6.1 認証系画面の遷移

| # | 遷移元 | 遷移先 | トリガー | 条件 |
|---|--------|--------|----------|------|
| 1 | ログイン画面 | トップ画面（/） | 「ログイン」ボタン押下 | 認証成功 |
| 2 | ログイン画面 | トップ画面（/） | 「Googleでログイン」ボタン押下 | Google認証成功 |
| 3 | ログイン画面 | 新規登録画面 | 「新規登録はこちら」リンククリック | なし |
| 4 | ログイン画面 | パスワードリセット画面 | 「パスワードを忘れた方はこちら」リンククリック | なし |
| 5 | 新規登録画面 | 確認メール送信完了メッセージ | 「新規登録」ボタン押下 | 登録成功 |
| 6 | 新規登録画面 | トップ画面（/） | 「Googleで登録」ボタン押下 | Google認証成功 |
| 7 | 新規登録画面 | ログイン画面 | 「ログインはこちら」リンククリック | なし |
| 8 | 確認メール | ログイン画面 | メール内リンクをクリック | メール認証完了 |
| 9 | パスワードリセット画面 | リセットメール送信完了メッセージ | 「リセットメールを送信」ボタン押下 | なし |
| 10 | パスワードリセット画面 | ログイン画面 | 「ログインに戻る」リンククリック | なし |
| 11 | リセットメール | パスワード再設定画面 | メール内リンクをクリック | なし |
| 12 | パスワード再設定画面 | ログイン画面 | 新パスワード設定成功 | パスワード更新成功 |

### 6.2 メイン画面の遷移

| # | 遷移元 | 遷移先 | トリガー | 条件 |
|---|--------|--------|----------|------|
| 13 | トップ画面 | クイズ画面 | 「ゲームスタート！」ボタン押下 | ジャンル・難易度選択済み かつ 利用上限内 |
| 14 | トップ画面 | （利用上限メッセージ表示） | 「ゲームスタート！」ボタン押下 | 利用上限超過（本日20回以上） |
| 15 | トップ画面 | 達成状況画面 | 日本地図タップ | なし |
| 16 | トップ画面 | 回答履歴画面 | 「回答履歴を見る」ボタン押下 | なし |
| 17 | クイズ画面 | 結果画面 | 5問目回答後「結果を見る」ボタン押下 | 5問回答完了 |
| 18 | クイズ画面 | （エラーメッセージ表示） | AI生成リトライ3回失敗 | 全リトライ失敗 |
| 19 | クイズ画面（エラー） | クイズ画面（再生成） | 「再試行」ボタン押下 | なし |
| 20 | 結果画面 | クイズ画面 | 「同じ条件でもう一度」ボタン押下 | 利用上限内 |
| 21 | 結果画面 | （利用上限メッセージ表示） | 「同じ条件でもう一度」ボタン押下 | 利用上限超過 |
| 22 | 結果画面 | トップ画面 | 「トップに戻る」ボタン押下 | なし |

### 6.3 ナビゲーション（ヘッダー/ハンバーガーメニュー共通）

| # | 遷移元 | 遷移先 | トリガー | 条件 |
|---|--------|--------|----------|------|
| 23 | 認証済み全画面 | トップ画面 | ヘッダー「JapanMaster」ロゴクリック | ログイン済み |
| 24 | 認証済み全画面 | 回答履歴画面 | ヘッダー/メニュー「回答履歴」クリック | ログイン済み |
| 25 | 認証済み全画面 | 達成状況画面 | ヘッダー/メニュー「達成状況」クリック | ログイン済み |
| 26 | 認証済み全画面 | 設定画面 | ヘッダー/メニュー「設定」クリック | ログイン済み |
| 27 | 認証済み全画面 | ログイン画面 | ヘッダー/メニュー「ログアウト」クリック→確認ダイアログ「はい」 | ログイン済み |

### 6.4 設定画面の遷移

| # | 遷移元 | 遷移先 | トリガー | 条件 |
|---|--------|--------|----------|------|
| 28 | 設定画面 | （成功メッセージ表示） | 「パスワードを変更」ボタン押下 | パスワード変更成功 |
| 29 | 設定画面 | ログイン画面 | 「アカウントを削除」→確認ダイアログ「削除する」 | アカウント削除成功 |

### 6.5 認証ガード（自動リダイレクト）

| # | 遷移元 | 遷移先 | トリガー | 条件 |
|---|--------|--------|----------|------|
| 30 | ログイン画面 | トップ画面 | ページアクセス時 | ログイン済みユーザー |
| 31 | 新規登録画面 | トップ画面 | ページアクセス時 | ログイン済みユーザー |
| 32 | パスワードリセット画面 | トップ画面 | ページアクセス時 | ログイン済みユーザー |
| 33 | トップ画面 | ログイン画面 | ページアクセス時 | 未ログインユーザー |
| 34 | クイズ画面 | ログイン画面 | ページアクセス時 | 未ログインユーザー |
| 35 | 結果画面 | ログイン画面 | ページアクセス時 | 未ログインユーザー |
| 36 | 回答履歴画面 | ログイン画面 | ページアクセス時 | 未ログインユーザー |
| 37 | 達成状況画面 | ログイン画面 | ページアクセス時 | 未ログインユーザー |
| 38 | 設定画面 | ログイン画面 | ページアクセス時 | 未ログインユーザー |
| 39 | クイズ画面 | トップ画面 | 直接URLアクセス時 | ジャンル・難易度が未選択 |
| 40 | 結果画面 | トップ画面 | 直接URLアクセス時 | セッションIDが存在しない |

### 6.6 エラー画面の遷移

| # | 遷移元 | 遷移先 | トリガー | 条件 |
|---|--------|--------|----------|------|
| 41 | エラー画面（404） | トップ画面 | 「トップに戻る」ボタン押下 | なし |
| 42 | エラー画面（500） | トップ画面 | 「トップに戻る」ボタン押下 | なし |
| 43 | ネットワークエラー | 現在のページ | 「再読み込み」ボタン押下 | なし |

---

## 7. クイズ中の離脱時の動作

| 状況 | 動作 | 遷移先 |
|------|------|--------|
| ブラウザを閉じた | 途中データは破棄。次回は最初から | - |
| ブラウザの戻るボタンを押した | 途中データは破棄。次回は最初から | 前の画面 |
| ネットワーク切断 | エラー表示。回答済みのデータは保存されない | ネットワークエラー表示 |

---

## 8. レスポンシブ対応時のナビゲーション差異

| 画面幅 | ナビゲーション方式 | 遷移トリガーの違い |
|--------|-------------------|-------------------|
| 768px以上（PC） | ヘッダーに「回答履歴」「達成状況」「設定」「ログアウト」ボタンを横並び表示 | 各ボタンを直接クリック |
| 767px以下（スマホ） | ハンバーガーメニュー（三本線アイコン）内に格納 | 三本線アイコンタップ→メニュー展開→各項目タップ |

※ 遷移先は同一。操作ステップがスマホ版では1段階多い（メニュー展開操作が追加される）。
