import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#000000", color: "#ffffff", fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      <div>
        <p style={{ color: "#c7ff9f", fontFamily: "var(--font-mono), monospace", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}>404 — page not found</p>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "16px 0", fontWeight: 500 }}>
          These aren’t the routes you’re looking for.
        </h1>
        <Link href="/" style={{ color: "#c7ff9f", fontSize: 17 }}>Back to the homepage →</Link>
      </div>
    </main>
  );
}
