"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BootSequence } from "./BootSequence";
import { Chapters } from "./Chapters";
import { osusFeature, osusProjects } from "@/data/portfolio";
import { wordmark } from "./wordmark.generated";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const TYPE_CHARS_PER_SECOND = 45;
const TYPE_START_DELAY_MS = 1100;

/** Counts a two-digit chapter number up from 00 in four frames, in the pixel face. */
function countUp(el: HTMLElement) {
  const target = el.textContent ?? "";
  const n = Number.parseInt(target, 10);
  if (!Number.isFinite(n) || n <= 0) return;
  let frame = 0;
  const steps = Math.min(n, 3);
  const tick = () => {
    frame += 1;
    const value = Math.round((n * frame) / steps);
    el.textContent = String(Math.min(value, n)).padStart(target.length, "0");
    if (frame < steps) window.setTimeout(tick, 110);
  };
  el.textContent = "0".padStart(target.length, "0");
  window.setTimeout(tick, 110);
}

export function PortfolioPage() {
  const [bootComplete, setBootComplete] = useState(false);
  const [markBuilt, setMarkBuilt] = useState(false);
  const handleBootComplete = useCallback(() => setBootComplete(true), []);
  const heroRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);

  // The mark constructs itself once after the boot; afterwards hover redraws the ticks.
  useEffect(() => {
    if (!bootComplete) return;
    const t = window.setTimeout(() => setMarkBuilt(true), 1200);
    return () => window.clearTimeout(t);
  }, [bootComplete]);

  // The hero statement is typed at reading speed with the block cursor, which
  // then keeps blinking at its end. The full text stays in the DOM for assistive
  // technology; the typed copy is decorative. Without JS or with reduced motion
  // the statement simply renders.
  useEffect(() => {
    if (!bootComplete || prefersReducedMotion()) return;
    const p = statementRef.current;
    const hero = heroRef.current;
    if (!p || !hero) return;
    const text = p.textContent ?? "";
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = text;
    const typed = document.createElement("span");
    typed.className = "typed";
    typed.setAttribute("aria-hidden", "true");
    const chars = Array.from(text).map((ch) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch;
      typed.appendChild(s);
      return s;
    });
    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.setAttribute("aria-hidden", "true");
    typed.prepend(cursor);
    p.replaceChildren(sr, typed);

    const start = performance.now() + TYPE_START_DELAY_MS;
    const perChar = 1000 / TYPE_CHARS_PER_SECOND;
    let shown = 0;
    let raf = 0;
    const tick = (now: number) => {
      if (now >= start) hero.classList.add("is-typing");
      const due = Math.max(0, Math.min(chars.length, Math.floor((now - start) / perChar)));
      while (shown < due) {
        chars[shown].classList.add("is-on");
        chars[shown].after(cursor);
        shown += 1;
      }
      if (shown < chars.length) raf = requestAnimationFrame(tick);
      else cursor.classList.add("is-done");
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [bootComplete]);

  useEffect(() => {
    if (!bootComplete || prefersReducedMotion()) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .pencil"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          // Titles are pencilled until they enter, then inked (see .pencil in globals.css).
          if (element.classList.contains("pencil")) {
            element.classList.add("is-inked");
            observer.unobserve(element);
            return;
          }
          if (element.dataset.revealed === "true") return;
          element.dataset.revealed = "true";
          const number = element.querySelector<HTMLElement>(".chapter-number");
          if (number) countUp(number);
          // native WAAPI; fill "none" returns to natural styles, which match
          // the final keyframe, so nothing is left inline after the reveal
          element.animate(
            [
              { opacity: 0, transform: "translateY(12px)" },
              { opacity: 1, transform: "none" },
            ],
            { duration: 420, easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" },
          );
          observer.unobserve(element);
        });
      },
      { threshold: 0.1 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [bootComplete]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <BootSequence onComplete={handleBootComplete} />

      <div className={`site-shell ${bootComplete ? "is-ready" : ""}`}>
        <header className="site-header">
          <a className="wordmark" href="#top">
            {/* The mark, drawn as a casebook figure: construction first, then the letter, then its measure. */}
            <svg className={`mark ${markBuilt ? "mark--built" : ""}`} viewBox="0 0 64 64" width="22" height="22" aria-hidden="true" focusable="false">
              <circle className="m-circle" cx="26" cy="32" r="18" pathLength={1} />
              <path className="m-lines" d="M10 14H54M10 50H54" pathLength={1} />
              <path className="m-letter" fillRule="evenodd" d="M16 14h10a18 18 0 0 1 0 36H16Zm10 8v20a10 10 0 0 0 0-20Z" />
              <path className="m-ticks" d="M16 56H44M16 54v4M44 54v4" pathLength={1} />
            </svg>
            Davide Gozzi
          </a>
          <nav aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#osus">OSUS</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main id="main">
          <section id="top" className={`hero ${bootComplete ? "is-drafting" : ""}`} ref={heroRef}>
            {/* The wordmark is traced letter by letter from the font's outlines, then inked. */}
            <h1 className="h1" aria-label="Davide Gozzi">
              <svg
                className="h1-draw"
                viewBox={wordmark.viewBox}
                style={{ height: `${wordmark.heightEm}em` }}
                aria-hidden="true"
                focusable="false"
              >
                {wordmark.paths.map((d, i) => (
                  <path key={d.slice(0, 24) + i} d={d} pathLength={1} style={{ "--i": i } as React.CSSProperties} />
                ))}
              </svg>
              <span className="h1-cursor" aria-hidden="true" />
            </h1>
            <div className="hero-grid">
              <div>
                <p className="hero-statement" ref={statementRef}>
                  I design and evolve software that has to keep working: distributed
                  services, legacy platforms and systems connected to real machines.
                </p>
                <p className="hero-neighborhood">Your friendly neighborhood .NET developer.</p>
                <p className="hero-links">
                  {/* relative: the site deploys under a basePath on GitHub Pages */}
                  <a href="Davide_Gozzi_CV.pdf" target="_blank" rel="noreferrer">CV</a>
                  <a href="mailto:david3gozz1@gmail.com">Email</a>
                  <a href="https://www.linkedin.com/in/davide-gozzi5/" target="_blank" rel="noreferrer">LinkedIn</a>
                  <a href="https://github.com/g4solio" target="_blank" rel="noreferrer">GitHub</a>
                  <a href="https://store.steampowered.com/app/513960/Galactic_Fighters/" target="_blank" rel="noreferrer">Galactic Fighters</a>
                </p>
              </div>
              <dl className="hero-facts">
                <div><dt>Role</dt><dd>Senior software engineer</dd></div>
                <div><dt>Range</dt><dd><span className="pix">7</span> years professional · shipping code since 2016</dd></div>
                <div><dt>Workflow</dt><dd>AI agents do most of the typing; architecture, review and verification stay mine</dd></div>
                <div><dt>Base</dt><dd>Modena, Italy</dd></div>
                <div><dt>Status</dt><dd><span className="status-dot" aria-hidden="true" />open to remote · CET</dd></div>
              </dl>
            </div>
          </section>

          <section id="work" className="work">
            <h2 className="pencil">Work</h2>
            <p className="section-intro">
              Seven professional years, and two before them, moving toward systems with more
              constraints and less room for error.
            </p>
            <Chapters />
          </section>

          <section id="ai" className="ai reveal">
            <h2 className="pencil">AI-assisted development</h2>
            <p className="section-intro">
              My background is backend; interfaces were the part I used to hand to someone
              else. AI changed that first, then it changed how I build everything. Agents now
              do most of the typing. What stays mine is the part that makes that safe: the
              product spec, the domain glossary, the architecture decisions, the coding
              standards, the review, and the CI that enforces whatever a script can check.
            </p>
            <div className="ai-grid">
              <div>
                <h3>What the agents do</h3>
                <p>Implementation, the first draft of tests and docs, refactors, visual iteration.</p>
              </div>
              <div>
                <h3>What stays mine</h3>
                <p>Product spec, glossary, architecture decisions, coding standards, review — and what “done” means.</p>
              </div>
              <div>
                <h3>What enforces it</h3>
                <p>The test suite on every pull request, warnings as errors. Rules a script can check live in CI, not in review notes. Decisions are ADRs that cite the issue that made them.</p>
              </div>
            </div>
            <p className="ai-case">
              This site was the first example. <strong>CollectionVault</strong>, a personal catalog
              for books and comics, is the latest: scope agreed on 16 October 2026, in daily use
              since the 29th, <span className="pix">357</span> commits and{" "}
              <span className="pix">77</span> pull requests in 19 days, and a CI step that fails
              the build if the catalog core ever reads a clock, a file or the network. The
              operating model behind it is public:{" "}
              <a href="https://github.com/g4solio/CollectionVault_Peek" target="_blank" rel="noreferrer">CollectionVault_Peek</a>.
            </p>
          </section>

          <section id="osus" className="osus reveal">
            <div className="osus-inner">
              <h2 className="pencil">OSUS</h2>
              <p className="section-intro">
                A small independent lab where I build the products I keep thinking about.
                Four projects — separate ideas, one ecosystem. Two of them are live, and
                you can use one without an account.
              </p>

              <div className="osus-feature">
                <div className={`osus-feature-copy tone-${osusFeature.tone}`}>
                  <h3>
                    <a href={osusFeature.url} target="_blank" rel="noreferrer">{osusFeature.name}</a>
                  </h3>
                  <p>{osusFeature.summary}</p>
                  <span className="osus-status"><i aria-hidden="true" />{osusFeature.status}</span>
                </div>
                <figure className="osus-artifact osus-artifact--live">
                  {/* ponytail: live iframe preview, swap for a static screenshot if the embed ever breaks */}
                  {/* aria-hidden: the embed is a non-interactive visual; the figcaption link is the accessible path */}
                  <iframe src={osusFeature.url} title="RosettAI — live preview" loading="lazy" tabIndex={-1} aria-hidden="true" />
                  <figcaption>
                    <a href={osusFeature.url} target="_blank" rel="noreferrer">rosettai.osus.it — live ↗</a>
                  </figcaption>
                </figure>
              </div>

              <ul className="osus-index">
                {osusProjects.map((project) => (
                  <li className={`osus-item tone-${project.tone}`} key={project.name}>
                    <h3>
                      {project.url ? (
                        <a href={project.url} target="_blank" rel="noreferrer">{project.name}</a>
                      ) : (
                        project.name
                      )}
                    </h3>
                    <p>{project.summary}</p>
                    <span className="osus-status"><i aria-hidden="true" />{project.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="credentials reveal">
            <h2 className="pencil">Credentials</h2>
            <p>
              English — C2 comprehension, EF SET 84/100 (reading 78, listening 90). The
              certificate covers reading and listening comprehension.{" "}
              <a href="https://cert.efset.org/fRRHgz" target="_blank" rel="noreferrer">
                Verified certificate
              </a>
            </p>
            <p>Education — IIS F. Corni, Modena. Diploma di perito informatico.</p>
          </section>

          <section id="contact" className="contact reveal">
            <h2 className="pencil">Contact</h2>
            <p>
              Email is the most reliable way to reach me. I read everything, including the
              interesting problems.
            </p>
            <p className="contact-links">
              <a href="Davide_Gozzi_CV.pdf" target="_blank" rel="noreferrer">CV (PDF)</a>
              <a href="mailto:david3gozz1@gmail.com">david3gozz1@gmail.com</a>
              <a href="https://www.linkedin.com/in/davide-gozzi5/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/g4solio" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://store.steampowered.com/app/513960/Galactic_Fighters/" target="_blank" rel="noreferrer">Galactic Fighters</a>
            </p>
          </section>
        </main>

        <footer className="site-footer">
          <span>Davide Gozzi · {new Date().getFullYear()}</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </div>
    </>
  );
}
