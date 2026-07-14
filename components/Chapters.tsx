import { chapters } from "@/data/portfolio";
import { Schematic } from "./Schematic";

export function Chapters() {
  return (
    <div className="chapters">
      {chapters.map((chapter) => (
        <article className="chapter reveal" key={chapter.employer}>
          <header className="chapter-head">
            <p className="chapter-years">{chapter.years}</p>
            <h3>{chapter.employer}</h3>
            <p className="chapter-role">{chapter.role}</p>
          </header>
          {chapter.lead.map((paragraph) => (
            <p className="chapter-body" key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          {chapter.study && (
            <details className="case-study">
              <summary>
                <span aria-hidden="true">▸</span>
                Case study — {chapter.study.title}
              </summary>
              <div className="case-study-body">
                <Schematic id={chapter.study.schematic} />
                <dl>
                  <div><dt>Problem</dt><dd>{chapter.study.problem}</dd></div>
                  <div><dt>Constraint</dt><dd>{chapter.study.constraint}</dd></div>
                  <div><dt>Decision</dt><dd>{chapter.study.decision}</dd></div>
                  <div><dt>What it taught me</dt><dd>{chapter.study.lesson}</dd></div>
                </dl>
              </div>
            </details>
          )}
          {chapter.tail?.map((paragraph) => (
            <p className="chapter-body" key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
          {chapter.aside && <aside className="chapter-aside">{chapter.aside}</aside>}
          {chapter.stack && <p className="chapter-stack">{chapter.stack}</p>}
        </article>
      ))}
    </div>
  );
}
