import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--paper)", color: "var(--ink)", fontFamily: "var(--sans)" }}>
      <div>
        <p style={{ color: "var(--ink-faint)", fontFamily: "var(--mono)", fontSize: 14 }}>404 — page not found</p>
        <h1 style={{ fontFamily: "var(--display)", fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.15, margin: "14px 0", fontWeight: 600 }}>
          These aren’t the routes you’re looking for.
        </h1>
        <Link href="/" style={{ color: "var(--accent)", fontSize: 17 }}>Back to the homepage →</Link>
      </div>
    </main>
  );
}
