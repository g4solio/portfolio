import { experiences } from "@/data/portfolio";
import { Schematic } from "./Schematic";

export function ExperienceTimeline() {
  return (
    <div className="experience-timeline">
      <div className="timeline-rail" aria-hidden="true"><span /></div>
      {experiences.map((experience, index) => (
        <article
          className={`experience-card reveal accent-${experience.accent}`}
          key={`${experience.company}-${experience.period}`}
        >
          <div className="experience-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
          <header className="experience-header">
            <div>
              <p className="kicker">{experience.period} · {experience.eyebrow}</p>
              <h3>{experience.company}</h3>
              <p className="experience-role">{experience.role}</p>
            </div>
            <span className="experience-status">FIELD EXPERIENCE</span>
          </header>
          <div className="experience-copy">
            <h4>{experience.title}</h4>
            <p>{experience.summary}</p>
          </div>
          <ul className="experience-details">
            {experience.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
          {experience.stories.map((story) => (
            <details className="case-study" key={story.title}>
              <summary>
                <span className="case-study-kicker">CASE STUDY</span>
                <strong>{story.title}</strong>
                <i aria-hidden="true" />
              </summary>
              <div className="case-study-body">
                <Schematic id={story.schematic} />
                <dl>
                  <div><dt>Context</dt><dd>{story.context}</dd></div>
                  <div><dt>Constraints</dt><dd>{story.constraints}</dd></div>
                  <div><dt>Decision</dt><dd>{story.decision}</dd></div>
                  <div><dt>What it taught me</dt><dd>{story.lesson}</dd></div>
                </dl>
              </div>
            </details>
          ))}
          {experience.learning && (
            <aside className="experience-learning">
              <span>GROWTH NOTE</span>
              <p>{experience.learning}</p>
            </aside>
          )}
          <div className="tag-row" aria-label="Technologies and themes">
            {experience.technologies.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
        </article>
      ))}
    </div>
  );
}
