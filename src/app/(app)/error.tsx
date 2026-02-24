"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: "1rem",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <span style={{ fontSize: "3rem" }}>⚠️</span>
      <h2 style={{ fontSize: "1.25rem", color: "#333" }}>
        エラーが発生しました
      </h2>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        予期せぬエラーが発生しました。もう一度お試しください。
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: "0.5rem",
          padding: "0.75rem 2rem",
          backgroundColor: "#C53D43",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        もう一度試す
      </button>
    </div>
  );
}
