import { chapters, type Decision } from "@/data/portfolio";
import { Schematic } from "./Schematic";

function Fig({ decision }: { decision: Decision }) {
  return (
    <figure className="fig">
      <Schematic id={decision.schematic} />
      <figcaption>{decision.caption}</figcaption>
    </figure>
  );
}

function DecisionBlock({ decision, withFigure = false }: { decision: Decision; withFigure?: boolean }) {
  return (
    <details className="decision" open={decision.openByDefault}>
      <summary>
        <span className="decision-label">Decision {decision.number}</span>
        <strong>{decision.title}</strong>
        <span className="decision-cta">Read the engineering note →</span>
        <span className="decision-cta decision-cta-close">Close the note ↑</span>
      </summary>
      <div className={`decision-body ${withFigure ? "decision-body--fig" : ""}`}>
        {withFigure && <Fig decision={decision} />}
        <dl>
          <div><dt>Problem</dt><dd>{decision.problem}</dd></div>
          <div><dt>Constraint</dt><dd>{decision.constraint}</dd></div>
          <div><dt>Decision</dt><dd>{decision.decision}</dd></div>
          <div><dt>What it taught me</dt><dd>{decision.lesson}</dd></div>
        </dl>
      </div>
    </details>
  );
}

export function Chapters() {
  return (
    <div className="chapters">
      {chapters.map((chapter) => {
        const closing = (
          <>
            {chapter.aside && <aside className="chapter-aside">{chapter.aside}</aside>}
            {chapter.note && <p className="chapter-note">{chapter.note}</p>}
            {chapter.stack && <p className="chapter-stack">{chapter.stack}</p>}
          </>
        );

        return (
          <article className={`chapter chapter--${chapter.layout} reveal`} key={chapter.employer}>
            <div className="chapter-rail">
              <span className="chapter-number" aria-hidden="true">{chapter.number}</span>
              <span className="chapter-years">{chapter.years}</span>
            </div>

            <div className="chapter-main">
              <header className="chapter-head">
                <h3>{chapter.employer}</h3>
                <p className="chapter-role">{chapter.role}</p>
              </header>
              {chapter.lead.map((paragraph) => (
                <p className="chapter-body" key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              {chapter.layout !== "wide" && chapter.decision && (
                <DecisionBlock decision={chapter.decision} />
              )}
              {chapter.layout !== "wide" && (
                <>
                  {chapter.tail?.map((paragraph) => (
                    <p className="chapter-body" key={paragraph.slice(0, 40)}>{paragraph}</p>
                  ))}
                  {closing}
                </>
              )}
            </div>

            {chapter.layout === "side" && chapter.decision && (
              <div className="chapter-side">
                <Fig decision={chapter.decision} />
              </div>
            )}

            {chapter.layout === "wide" && chapter.decision && (
              <div className="chapter-wide">
                <DecisionBlock decision={chapter.decision} withFigure />
              </div>
            )}

            {chapter.layout === "wide" && (
              <div className="chapter-main chapter-cont">
                {chapter.tail?.map((paragraph) => (
                  <p className="chapter-body" key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
                {closing}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
