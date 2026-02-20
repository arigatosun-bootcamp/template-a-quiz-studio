"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setLoading(false);
    });
  }, []);

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "削除に失敗しました");
      }
      router.push("/login");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "アカウント削除に失敗しました"
      );
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>設定</h1>

      {/* アカウント情報 */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>アカウント情報</h2>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>メールアドレス</span>
          <span className={styles.infoValue}>{email || "---"}</span>
        </div>
      </div>

      {/* 危険エリア */}
      <div className={styles.dangerSection}>
        <h2 className={styles.dangerTitle}>アカウント削除</h2>
        <p className={styles.dangerDescription}>
          アカウントを削除すると、すべてのデータ（回答履歴・達成状況）が完全に削除されます。この操作は元に戻せません。
        </p>
        <button
          className={styles.deleteButton}
          onClick={() => setShowDeleteDialog(true)}
        >
          アカウントを削除する
        </button>
      </div>

      {/* 確認ダイアログ */}
      {showDeleteDialog && (
        <div
          className={styles.dialogOverlay}
          onClick={() => !deleting && setShowDeleteDialog(false)}
        >
          <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
            <p className={styles.dialogTitle}>本当に削除しますか？</p>
            <p className={styles.dialogText}>
              すべてのデータが完全に削除されます。この操作は元に戻せません。
            </p>
            <div className={styles.dialogActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDeleteDialog(false)}
                disabled={deleting}
              >
                キャンセル
              </button>
              <button
                className={styles.confirmDeleteButton}
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? "削除中..." : "削除する"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
