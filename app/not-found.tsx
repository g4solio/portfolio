import Link from "next/link";
import { Mark } from "@/components/Mark";

export default function NotFound() {
  return (
    <main className="nf">
      <div>
        <Mark size={72} />
        <p className="nf-kicker">404 — page not found</p>
        <h1>These aren’t the routes you’re looking for.</h1>
        <Link href="/">Back to the homepage →</Link>
      </div>
    </main>
  );
}
