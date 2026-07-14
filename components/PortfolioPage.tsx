"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { animate, stagger } from "animejs";
import { BootSequence } from "./BootSequence";
import { SignalGrid } from "./SignalGrid";
import { OriginScene } from "./OriginScene";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { OsusOrbit } from "./OsusOrbit";

const rotatingSystems = ["complex systems", "legacy systems", "industrial systems", "distributed systems"];

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PortfolioPage() {
  const [bootComplete, setBootComplete] = useState(false);
  const [systemIndex, setSystemIndex] = useState(0);

  const handleBootComplete = useCallback(() => setBootComplete(true), []);

  useEffect(() => {
    console.info("%cDormammu, I've come to retry.", "color:#b8ff45;font-family:monospace;");
  }, []);

  useEffect(() => {
    if (!bootComplete || prefersReducedMotion()) return;

    const heroItems = document.querySelectorAll(".hero-reveal");
    animate(heroItems, {
      opacity: { from: 0 },
      translateY: { from: 24 },
      delay: stagger(95),
      duration: 720,
      ease: "out(4)",
    });
  }, [bootComplete]);

  useEffect(() => {
    if (!bootComplete || prefersReducedMotion()) return;

    const interval = window.setInterval(() => {
      const word = document.querySelector(".rotating-system");
      if (!word) return;
      animate(word, {
        opacity: [1, 0],
        translateY: [0, -12],
        duration: 250,
        ease: "in(2)",
        onComplete: () => {
          setSystemIndex((index) => (index + 1) % rotatingSystems.length);
          animate(word, {
            opacity: [0, 1],
            translateY: [12, 0],
            duration: 350,
            ease: "out(3)",
          });
        },
      });
    }, 2300);

    return () => window.clearInterval(interval);
  }, [bootComplete]);

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
            translateY: { from: 30 },
            duration: 650,
            ease: "out(3)",
          });
          observer.unobserve(element);
        });
      },
      { threshold: 0.12 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [bootComplete]);

  // Entering OSUS opens the palette; leaving closes it again.
  useEffect(() => {
    if (!bootComplete) return;
    const osus = document.getElementById("osus");
    if (!osus) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        document.documentElement.classList.toggle("osus-mode", entry.isIntersecting);
      },
      { threshold: 0.25 },
    );
    observer.observe(osus);
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("osus-mode");
    };
  }, [bootComplete]);

  const currentSystem = useMemo(() => rotatingSystems[systemIndex], [systemIndex]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <BootSequence onComplete={handleBootComplete} />
      <SignalGrid />

      <div className={`site-shell ${bootComplete ? "is-ready" : ""}`}>
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="Davide Gozzi, home">
            <span>DG</span>
            <strong>DAVIDE GOZZI</strong>
          </a>
          <nav aria-label="Primary navigation">
            <a href="#experience">Experience</a>
            <a href="#growth">Growth</a>
            <a href="#osus">OSUS</a>
            <a className="nav-cta" href="#contact">Contact</a>
          </nav>
        </header>

        <main id="main">
          <section id="top" className="hero section-frame">
            <div className="hero-meta hero-reveal">
              <span>SOFTWARE ENGINEER</span>
              <span>MODENA · ITALY</span>
              <span>AVAILABLE FOR HARD PROBLEMS</span>
            </div>
            <div className="hero-copy">
              <p className="kicker hero-reveal">REAL-WORLD SYSTEMS / PRODUCT AMBITION</p>
              <h1 className="hero-reveal">
                I make <span className="rotating-system">{currentSystem}</span><br />understandable.
              </h1>
              <p className="hero-intro hero-reveal">
                I don’t chase complexity. I make it understandable — across industrial software,
                distributed architectures and AI-assisted development.
              </p>
              <p className="neighborhood-line hero-reveal">
                Your friendly neighborhood <span>.NET developer</span>.
              </p>
              <div className="hero-actions hero-reveal">
                <a className="primary-button" href="#experience">Explore my experience <span>↓</span></a>
                <a className="text-link" href="#osus">Discover OSUS <span>↗</span></a>
              </div>
            </div>
            <div className="hero-dashboard hero-reveal" aria-label="Career snapshot">
              <div><strong>09+</strong><span>years building software</span></div>
              <div><strong>C2</strong><span>English comprehension</span></div>
              <div><strong>2016</strong><span>first professional team</span></div>
              <div><strong>∞</strong><span>curiosity budget</span></div>
            </div>
            <div className="hero-scanline" aria-hidden="true" />
          </section>

          <section className="origin section-frame section-lightline">
            <div className="section-heading reveal">
              <p className="kicker">ORIGIN / 2016</p>
              <h2>I started before<br />I was supposed to.</h2>
            </div>
            <div className="origin-grid">
              <div className="origin-copy reveal">
                <p className="large-copy">
                  During my fourth year of high school, the curriculum had started feeling too small.
                  I joined a game startup because I needed real problems, real teammates and software
                  that had to work.
                </p>
                <p>
                  My first serious challenge was not a tutorial: it was a configurable, real-time
                  collision predictor for a 3D bullet-hell game, under the performance limits of
                  ordinary hardware.
                </p>
                <div className="inline-note">
                  <span>FIRST PRINCIPLE</span>
                  <strong>Learning accelerates when the problem is real.</strong>
                </div>
              </div>
              <OriginScene />
            </div>
          </section>

          <section id="experience" className="experience section-frame">
            <div className="section-heading reveal">
              <p className="kicker">PROFESSIONAL EXPERIENCE</p>
              <h2>Built in the<br />real world.</h2>
              <p>
                Every step led to a system with more users, more constraints and more expensive ways
                to fail. The case studies open — the reasoning matters more than the stack.
              </p>
            </div>
            <ExperienceTimeline />
          </section>

          <section id="growth" className="growth section-frame">
            <div className="growth-track" aria-hidden="true"><span /><span /><span /><span /></div>
            <div className="growth-copy">
              <p className="kicker reveal">GROWTH / BEYOND CODE</p>
              <p className="growth-line reveal"><span>01</span> First, I learned to build things myself.</p>
              <p className="growth-line reveal"><span>02</span> Then, I learned to delegate.</p>
              <p className="growth-line reveal"><span>03</span> Later, I learned that ownership also means knowing when to say no.</p>
              <p className="growth-line reveal"><span>04</span> Now, I try to make priorities as explicit as the architecture.</p>
            </div>
            <blockquote className="growth-quote reveal">
              Seniority is not doing everything.<br />It is protecting the work that matters.
            </blockquote>
          </section>

          <section className="ai-section section-frame section-lightline">
            <div className="section-heading reveal">
              <p className="kicker">AI AS LEVERAGE</p>
              <h2>Experience sets the direction.<br />AI increases the range.</h2>
            </div>
            <div className="ai-layout">
              <div className="ai-copy reveal">
                <p className="large-copy">
                  My strongest background is backend engineering, system architecture and integration
                  with the physical world.
                </p>
                <p>
                  AI-assisted development helps me cross disciplines that were historically outside my
                  strongest area—especially interface design and frontend implementation—without
                  outsourcing judgment, quality or responsibility.
                </p>
                <p>
                  Architecture, technical judgment, validation, testing, maintainability, security and
                  deciding what should actually be built: that part stays human.
                </p>
              </div>
              <div className="capability-map reveal">
                <div className="capability-core">
                  <span>ENGINEERING<br />JUDGMENT</span>
                </div>
                <div className="capability-node node-backend">Backend</div>
                <div className="capability-node node-architecture">Architecture</div>
                <div className="capability-node node-integration">Integration</div>
                <div className="capability-node node-product">Product</div>
                <div className="capability-node node-interfaces">Interfaces</div>
                <div className="capability-node node-prototyping">Prototyping</div>
                <div className="capability-aura" aria-hidden="true">AI-ASSISTED RANGE</div>
              </div>
            </div>
          </section>

          <section id="osus" className="osus section-frame">
            <div className="osus-intro reveal">
              <p className="kicker">FUTURE DIRECTION / PERSONAL R&amp;D</p>
              <h2>Experience is what I’ve built.<br /><span>OSUS is where I’m going.</span></h2>
              <p>
                An independent product and engineering lab for ideas too interesting to leave
                unexplored — connected parts of one evolving ecosystem.
              </p>
            </div>
            <OsusOrbit />
          </section>

          <section className="credentials section-frame section-lightline">
            <div className="credential-card reveal">
              <p className="kicker">LANGUAGE</p>
              <strong>C2</strong>
              <h3>English comprehension</h3>
              <p>EF SET 84/100 · Reading 78 · Listening 90</p>
              <p className="credential-precision">Certifies reading and listening comprehension.</p>
              <a href="https://cert.efset.org/fRRHgz" target="_blank" rel="noreferrer">Verified certificate ↗</a>
            </div>
            <div className="credential-card reveal">
              <p className="kicker">EDUCATION</p>
              <h3>IIS F. Corni, Modena</h3>
              <p>Diploma — Perito Informatico (IT technician).</p>
              <p className="credential-precision">Already shipping production software by the fourth year.</p>
            </div>
            <div className="credential-card credential-philosophy reveal">
              <p className="kicker">CAREER COMPASS</p>
              <h3>I change when I stop learning.</h3>
              <p>
                So far, every meaningful step has moved me toward a harder problem—not away from one.
              </p>
            </div>
          </section>

          <section id="contact" className="contact section-frame">
            <p className="kicker reveal">NEXT SYSTEM / OPEN</p>
            <h2 className="reveal">Let’s build<br />the next one.</h2>
            <p className="contact-copy reveal">
              I am interested in ambitious teams, difficult systems and work where engineering judgment
              has visible consequences.
            </p>
            <div className="contact-links reveal">
              <a href="mailto:david3gozz1@gmail.com">Email me <span>↗</span></a>
              <a href="https://www.linkedin.com/in/davide-gozzi5/" target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
              <a href="https://github.com/g4solio" target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <span>© {new Date().getFullYear()} DAVIDE GOZZI</span>
          <span>WITH GREAT PRODUCTION ACCESS COMES GREAT RESPONSIBILITY.</span>
          <a href="#top">BACK TO TOP ↑</a>
        </footer>
      </div>
    </>
  );
}
