import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#08090c", color: "#f2f1eb", fontFamily: "system-ui" }}>
      <div>
        <p style={{ color: "#b8ff45", fontFamily: "monospace", letterSpacing: ".12em" }}>404 / ROUTE NOT FOUND</p>
        <h1 style={{ fontSize: "clamp(52px, 10vw, 120px)", lineHeight: .9, margin: "18px 0" }}>These aren’t the routes you’re looking for.</h1>
        <Link href="/" style={{ color: "#b8ff45", fontFamily: "monospace" }}>Return to the system →</Link>
      </div>
    </main>
  );
}
