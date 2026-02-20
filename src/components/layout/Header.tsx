"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

interface HeaderProps {
  userEmail?: string;
}

export default function Header({ userEmail }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "トップ" },
    { href: "/history", label: "回答履歴" },
    { href: "/achievement", label: "達成状況" },
    { href: "/settings", label: "設定" },
  ];

  function handleLogoutClick() {
    setShowLogoutConfirm(true);
    setMenuOpen(false);
  }

  function handleLogoutConfirm() {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/auth/signout";
    document.body.appendChild(form);
    form.submit();
  }

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Quiz Studio
        </Link>

        {/* PC版ナビゲーション */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                pathname === item.href
                  ? styles.navLinkActive
                  : styles.navLink
              }
            >
              {item.label}
            </Link>
          ))}
          <button
            className={styles.logoutButton}
            onClick={handleLogoutClick}
          >
            ログアウト
          </button>
        </nav>

        {/* ハンバーガーボタン */}
        <button
          className={styles.menuButton}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
        >
          <span className={styles.menuIcon}>
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
            <span className={styles.menuLine} />
          </span>
        </button>
      </header>

      {/* モバイルメニュー */}
      <div
        className={menuOpen ? styles.mobileOverlayOpen : styles.mobileOverlay}
        onClick={() => setMenuOpen(false)}
      />
      <nav className={menuOpen ? styles.mobileMenuOpen : styles.mobileMenu}>
        {userEmail && (
          <div style={{ padding: "0.5rem 1.5rem", color: "#999", fontSize: "0.8rem" }}>
            {userEmail}
          </div>
        )}
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              pathname === item.href
                ? styles.mobileNavLinkActive
                : styles.mobileNavLink
            }
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <button
          className={styles.mobileLogoutButton}
          onClick={handleLogoutClick}
        >
          ログアウト
        </button>
      </nav>

      {/* ログアウト確認ダイアログ */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
          }}
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "1.5rem",
              maxWidth: "320px",
              width: "90%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: "1rem", marginBottom: "1rem", color: "#333" }}>
              ログアウトしますか？
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                キャンセル
              </button>
              <button
                onClick={handleLogoutConfirm}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
