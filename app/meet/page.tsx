import type { Metadata } from "next";
import Link from "next/link";
import { Mark } from "@/components/Mark";
import { Meet } from "@/components/Meet";
import { meetDescription, meetTitle, siteUrl } from "@/data/meet";

const title = `${meetTitle} — Davide Gozzi`;
const url = `${siteUrl}meet/`;
const image = `${siteUrl}og-meet.png`;

export const metadata: Metadata = {
  title,
  description: meetDescription,
  alternates: { canonical: url },
  openGraph: {
    title,
    description: meetDescription,
    url,
    siteName: "Davide Gozzi",
    type: "website",
    images: [{ url: image, width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title, description: meetDescription, images: [image] },
};

/** /meet/ — the recruiters' intake desk, with the transcript as text mode. No boot: a headhunter arriving cold lands on the point. */
export default function MeetPage() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="site-shell is-ready">
        <header className="site-header">
          <Link className="wordmark" href="/">
            <Mark />
            Davide Gozzi
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/">Portfolio</Link>
            {/* relative: the site deploys under a basePath on GitHub Pages */}
            <a href="../Davide_Gozzi_CV.pdf" target="_blank" rel="noreferrer">CV</a>
          </nav>
        </header>

        <main id="main">
          <Meet />
        </main>

        <footer className="site-footer">
          <span>Davide Gozzi · {new Date().getFullYear()}</span>
          <Link href="/">Back to the portfolio ↑</Link>
        </footer>
      </div>
    </>
  );
}
