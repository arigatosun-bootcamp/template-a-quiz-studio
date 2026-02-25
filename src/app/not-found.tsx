import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <span style={{ fontSize: "3rem" }}>🔍</span>
      <h1 style={{ fontSize: "1.5rem", color: "#333" }}>
        ページが見つかりません
      </h1>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link
        href="/"
        style={{
          marginTop: "0.5rem",
          padding: "0.75rem 2rem",
          backgroundColor: "#C53D43",
          color: "#fff",
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        トップに戻る
      </Link>
    </div>
  );
}
