import Link from "next/link";
import { signup } from "./actions";
import styles from "../auth.module.css";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>新規登録</h1>
        <p className={styles.subtitle}>
          メールアドレスとパスワードで登録
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {success && (
          <p className={styles.success}>
            確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。
          </p>
        )}

        <form className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="email">
              メールアドレス
            </label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="password">
              パスワード
            </label>
            <input
              className={styles.input}
              id="password"
              name="password"
              type="password"
              placeholder="8文字以上"
              minLength={8}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="confirmPassword">
              パスワード（確認）
            </label>
            <input
              className={styles.input}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="もう一度入力"
              minLength={8}
              required
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              className={styles.checkbox}
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              value="true"
              required
            />
            <label className={styles.checkboxLabel} htmlFor="agreeTerms">
              <a href="/terms" target="_blank" style={{ color: "#C84B31" }}>
                利用規約
              </a>
              と
              <a href="/privacy" target="_blank" style={{ color: "#C84B31" }}>
                プライバシーポリシー
              </a>
              に同意します
            </label>
          </div>

          <button className={styles.primaryButton} formAction={signup}>
            登録する
          </button>
        </form>

        <div className={styles.links}>
          <Link className={styles.link} href="/login">
            すでにアカウントをお持ちの方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
