"use client";

import { useCallback, useEffect, useState } from "react";
import { animate } from "animejs";
import { BootSequence } from "./BootSequence";
import { Chapters } from "./Chapters";
import { osusFeature, osusProjects } from "@/data/portfolio";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PortfolioPage() {
  const [bootComplete, setBootComplete] = useState(false);
  const handleBootComplete = useCallback(() => setBootComplete(true), []);

  useEffect(() => {
    if (!bootComplete || prefersReducedMotion()) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          if (element.dataset.revealed === "true") return;
          element.dataset.revealed = "true";
          animate(element, {
            opacity: { from: 0 },
            translateY: { from: 12 },
            duration: 420,
            ease: "out(2)",
          });
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
          <a className="wordmark" href="#top">Davide Gozzi</a>
          <nav aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#osus">OSUS</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <main id="main">
          <section id="top" className="hero">
            <h1>DAVIDE GOZZI</h1>
            <div className="hero-grid">
              <div>
                <p className="hero-statement">
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
                  <a href="https://steamcommunity.com/profiles/76561197986572794/" target="_blank" rel="noreferrer">Steam</a>
                </p>
              </div>
              <dl className="hero-facts">
                <div><dt>Role</dt><dd>Software engineer</dd></div>
                <div><dt>Range</dt><dd>9+ years across distributed, legacy and industrial systems</dd></div>
                <div><dt>Base</dt><dd>Modena, Italy</dd></div>
              </dl>
            </div>
          </section>

          <section id="work" className="work">
            <h2>Work</h2>
            <p className="section-intro">
              Nine years of moving toward systems with more constraints and less room for error.
            </p>
            <Chapters />
          </section>

          <section className="ai reveal">
            <h2>AI-assisted development</h2>
            <p className="section-intro">
              My background is backend; interfaces were the part I used to hand to someone
              else. AI-assisted development changed that — not by replacing judgment, but by
              making me faster exactly where I had the least muscle memory. This site is a
              concrete example: built with an AI pair, with me setting the direction,
              reviewing the implementation and owning the final result.
            </p>
            <div className="ai-grid">
              <div>
                <h3>My core territory</h3>
                <p>Backend, architecture, distributed systems, integration with machines.</p>
              </div>
              <div>
                <h3>Extended with AI</h3>
                <p>Interface implementation, interaction prototyping, visual iteration.</p>
              </div>
              <div>
                <h3>Still my responsibility</h3>
                <p>Architecture, verification, tests, security, trade-offs — and what “done” means.</p>
              </div>
            </div>
          </section>

          <section id="osus" className="osus reveal">
            <div className="osus-inner">
              <h2>OSUS</h2>
              <p className="section-intro">
                A small independent lab where I build the products I keep thinking about.
                Four projects so far — separate ideas, one ecosystem.
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
                  <iframe src={osusFeature.url} title="RosettAI — live preview" loading="lazy" tabIndex={-1} />
                  <figcaption>
                    <a href={osusFeature.url} target="_blank" rel="noreferrer">rosettai.osus.it — live ↗</a>
                  </figcaption>
                </figure>
              </div>

              <ul className="osus-index">
                {osusProjects.map((project) => (
                  <li className={`osus-item tone-${project.tone}`} key={project.name}>
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                    <span className="osus-status"><i aria-hidden="true" />{project.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="credentials reveal">
            <h2>Credentials</h2>
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
            <h2>Contact</h2>
            <p>
              Email is the most reliable way to reach me. I read everything, including the
              interesting problems.
            </p>
            <p className="contact-links">
              <a href="Davide_Gozzi_CV.pdf" target="_blank" rel="noreferrer">CV (PDF)</a>
              <a href="mailto:david3gozz1@gmail.com">david3gozz1@gmail.com</a>
              <a href="https://www.linkedin.com/in/davide-gozzi5/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/g4solio" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://steamcommunity.com/profiles/76561197986572794/" target="_blank" rel="noreferrer">Steam</a>
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
