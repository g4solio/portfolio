import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f5f1", color: "#1b1b18", fontFamily: "system-ui" }}>
      <div>
        <p style={{ color: "#8b897e", fontFamily: "monospace", fontSize: 14 }}>404 — page not found</p>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.15, margin: "14px 0", fontWeight: 600 }}>
          These aren’t the routes you’re looking for.
        </h1>
        <Link href="/" style={{ color: "#2b5bc7", fontSize: 17 }}>Back to the homepage →</Link>
      </div>
    </main>
  );
}
