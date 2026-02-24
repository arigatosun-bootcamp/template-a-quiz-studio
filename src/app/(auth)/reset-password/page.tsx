import Link from "next/link";
import { resetPassword } from "./actions";
import styles from "../auth.module.css";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>パスワードリセット</h1>
        <p className={styles.subtitle}>
          登録済みのメールアドレスを入力してください
        </p>

        {error && <p className={styles.error}>{error}</p>}
        {success && (
          <p className={styles.success}>
            パスワードリセットメールを送信しました。メール内のリンクからパスワードを再設定してください。
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

          <button className={styles.primaryButton} formAction={resetPassword}>
            リセットメールを送信
          </button>
        </form>

        <div className={styles.links}>
          <Link className={styles.link} href="/login">
            ログインに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
