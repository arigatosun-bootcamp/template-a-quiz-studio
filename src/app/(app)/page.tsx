import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        Quiz Studio
      </h1>

      {user ? (
        <div>
          <p style={{ marginBottom: "1rem" }}>
            ログイン中: {user.email}
          </p>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc2626",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ログアウト
            </button>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/login"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#4A90D9",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            ログイン
          </Link>
          <Link
            href="/register"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#16a34a",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            新規登録
          </Link>
        </div>
      )}
    </div>
  );
}
