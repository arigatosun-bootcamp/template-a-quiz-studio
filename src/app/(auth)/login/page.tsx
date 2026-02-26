import type { Metadata } from "next";
import Link from "next/link";
import { login } from "./actions";
import styles from "../auth.module.css";

export const metadata: Metadata = { title: "ログイン" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>ログイン</h1>
        <p className={styles.subtitle}>
          メールアドレスとパスワードでログイン
        </p>

        {error && <p className={styles.error}>{error}</p>}

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
              placeholder="パスワード"
              required
            />
          </div>

          <button className={styles.primaryButton} formAction={login}>
            ログイン
          </button>

        </form>

        <div className={styles.links}>
          <Link className={styles.link} href="/reset-password">
            パスワードを忘れた方
          </Link>
          <Link className={styles.link} href="/register">
            アカウントをお持ちでない方はこちら
          </Link>
        </div>
      </div>
    </div>
  );
}
