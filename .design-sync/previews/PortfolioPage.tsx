import { PortfolioPage } from "davide-gozzi-portfolio";

// The whole site as one component: boot overlay, hero, work chapters,
// AI section, OSUS band, credentials, contact, footer.
// The H1 block cursor blinks on a compositor-driven CSS animation the frozen
// page clock can't hold still — pin it solid so captures are deterministic.
const style = document.createElement("style");
style.textContent = ".h1-cursor { animation: none !important; opacity: 1 !important; }";
document.head.appendChild(style);

export const FullSite = () => <PortfolioPage />;
