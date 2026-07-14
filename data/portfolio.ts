export type SchematicId =
  | "collision"
  | "schema"
  | "agents"
  | "docflow"
  | "tiles"
  | "bytes";

export type CaseStudy = {
  title: string;
  schematic: SchematicId;
  context: string;
  constraints: string;
  decision: string;
  lesson: string;
};

export type Experience = {
  period: string;
  company: string;
  role: string;
  eyebrow: string;
  title: string;
  summary: string;
  details: string[];
  /** Personal growth woven into the chapter where it actually happened. */
  learning?: string;
  stories: CaseStudy[];
  technologies: string[];
  accent: string;
};

export type OsusProject = {
  name: string;
  category: string;
  statement: string;
  description: string;
  status: string;
  accent: string;
  position: "top" | "right" | "bottom" | "left";
};

export const experiences: Experience[] = [
  {
    period: "2016 — 2017",
    company: "StarworkGC",
    role: "Junior Programmer · Particle Effect Artist",
    eyebrow: "The first real system",
    title: "From learning code to building with a team.",
    summary:
      "I joined a game startup during my fourth year of high school. It was where object-oriented programming, design patterns and teamwork stopped being school subjects and became production constraints.",
    details: [
      "Designed a real-time collision prediction system for a 3D bullet-hell game in Unity and C#.",
      "Balanced useful early warnings against the performance limits of lower-powered hardware.",
      "Learned to ship inside a team rather than treating code as an individual exercise.",
    ],
    stories: [
      {
        title: "Predict collisions without simulating the future",
        schematic: "collision",
        context:
          "A 3D bullet-hell game needed to warn players about future collisions with asteroids and enemies — early enough to react, precise enough to trust.",
        constraints:
          "The predictor had to run inside the real-time loop on modest hardware. Simulating full future game states every frame was too expensive and would have produced timing artefacts.",
        decision:
          "I built the prediction around projected movement and ray-based spatial checks: geometry instead of simulation. The warning system stayed configurable and cheap enough for low-end machines.",
        lesson:
          "A useful approximation delivered at the right time beats a theoretically perfect model delivered too late.",
      },
    ],
    technologies: ["Unity", "C#", "Real-time systems", "OOP", "Performance"],
    accent: "mint",
  },
  {
    period: "2017 — 2018",
    company: "Melazeta",
    role: "Software Development Intern",
    eyebrow: "Software meets deadlines",
    title: "Interactive products, artists and real delivery pressure.",
    summary:
      "Two short school-work placements turned my Unity experience into shipped mobile work, including a Winx dress-up application released on the Play Store.",
    details: [
      "Worked across Unity UI, in-app purchases and augmented-reality experiments.",
      "Collaborated with artists and adapted when assets arrived late in the delivery cycle.",
      "First exposure to production constraints: coordination, timing and pragmatism.",
    ],
    stories: [],
    technologies: ["Unity UI", "Mobile", "IAP", "AR", "Delivery"],
    accent: "amber",
  },
  {
    period: "2019 — 2021",
    company: "Amaris · Credemtel",
    role: ".NET Backend Developer",
    eyebrow: "Configurable data",
    title: "From rigid documents to schemas that could evolve.",
    summary:
      "Banking and document management: backend services built around Elasticsearch, RabbitMQ and deeply nested JSON structures whose shape was defined by an external configuration system.",
    details: [
      "Redesigned how deeply nested JSON document data was read, written and transformed.",
      "Built a reusable package that REST APIs, microservices and other consumers could integrate.",
      "Preserved consistency between document configuration and stored data across arbitrary nesting.",
    ],
    learning:
      "This is also where I noticed a limit: I still held too much of the design in my own head. Learning to hand ideas over — early and explicitly — came later.",
    stories: [
      {
        title: "Support evolving schemas without rewriting every consumer",
        schematic: "schema",
        context:
          "Document structures were defined dynamically through an external configuration system and could contain arbitrary nesting levels. Every consumer needed to read and write them correctly.",
        constraints:
          "REST APIs, microservices and ETL jobs all needed consistent behaviour while schemas kept changing underneath them.",
        decision:
          "I designed a reusable configuration-driven package and rewrote the read/write/transform path around it, separating document structure from each consumer.",
        lesson:
          "Configuration becomes architecture when it is the contract that keeps an ecosystem coherent.",
      },
    ],
    technologies: [".NET", "REST APIs", "Microservices", "RabbitMQ", "Elasticsearch", "ETL"],
    accent: "cyan",
  },
  {
    period: "2021",
    company: "iSolutions",
    role: "Full-stack Developer",
    eyebrow: "Careful evolution",
    title: "Change the system. Don’t break the product.",
    summary:
      "A shorter chapter working mainly with established software — and a discipline that stayed with me: inspect an existing codebase, understand its hidden dependencies, make conservative changes.",
    details: [
      "Worked across existing full-stack products rather than greenfield code.",
      "Practised impact analysis and regression-aware, conservative change.",
      "Strengthened collaboration inside a team with shared ownership of live systems.",
    ],
    stories: [],
    technologies: [".NET", "Full-stack", "Legacy code", "Regression awareness"],
    accent: "violet",
  },
  {
    period: "2021 — 2023",
    company: "MSC",
    role: "Senior .NET Developer",
    eyebrow: "Global operations",
    title: "Large-scale systems with no room for casual breakage.",
    summary:
      "Container and shipping documentation processed at very large scale, on systems older than many of their maintainers. I worked with international teams, including six weeks of in-person knowledge sharing in the United States.",
    details: [
      "Evolved large legacy C# and C++ codebases with complex SQL and stored procedures.",
      "Worked on components distributed across global installations, where operational risk was real.",
      "Provided technical leadership for a document-processing flow, coordinating three to four people.",
    ],
    learning:
      "MSC is where I learned to delegate — and where I learned the cost of agreeing to too many parallel responsibilities instead of saying no and forcing priorities to become explicit.",
    stories: [
      {
        title: "Deploy new capabilities without abandoning old installations",
        schematic: "agents",
        context:
          "A manager-and-agent system remotely distributed DLL-based capabilities — checks, file operations, health activities — to installations around the world, orchestrated with Quartz.",
        constraints:
          "Strict backward compatibility: some installations could not be upgraded frequently, possibly not more than once. New components had to coexist with very old runtime contracts.",
        decision:
          "We built around explicit dependency loading, health reporting and Quartz-based scheduling while treating compatibility as a first-class requirement, not an afterthought.",
        lesson: "In global systems, compatibility is not polish. It is part of availability.",
      },
      {
        title: "Integrate systems that communicate through files",
        schematic: "docflow",
        context:
          "A document-processing flow connected a third-party service, the central application and SAP — through shared Windows folders and file-based communication.",
        constraints:
          "No ideal event-driven interfaces. The system needed enough observability to understand where documents became stuck or failed across three organisations’ software.",
        decision:
          "I led the work across a group of three to four people, adding operational visibility around file movement, failures and hand-offs between systems.",
        lesson:
          "Good engineering is not waiting for perfect infrastructure. It is making imperfect infrastructure observable and dependable.",
      },
    ],
    technologies: ["C#", "C++", "SQL", "Quartz", "SAP integration", "Distributed systems"],
    accent: "blue",
  },
  {
    period: "2024 — TODAY",
    company: "GIAMMAR · System Ceramics",
    role: "Software Engineering Consultant",
    eyebrow: "Software meets machines",
    title: "Industrial data, physical constraints and real-time decisions.",
    summary:
      "Industrial and ceramic manufacturing systems: software that talks to physical machinery across distributed environments, from OPC UA and PLCs down to byte-level protocols.",
    details: [
      "Build real-time extraction and publication of machine data through OPC UA and custom connectors.",
      "Work at the byte-stream level — serialization, memory areas, binary protocols — behind clean abstractions.",
      "Contribute to a quality-data pipeline that preserves defect data for traceability and production analysis.",
    ],
    stories: [
      {
        title: "Turn tile defects into decisions, in real time",
        schematic: "tiles",
        context:
          "A machine detects defects on tile images. The pipeline imports and reprocesses them, helps determine the largest usable tile area that avoids the defects, and supports real-time inspection.",
        constraints:
          "The data had to serve two clocks at once: immediate production decisions on the line, and long-term traceability and analysis across production history.",
        decision:
          "We treated the defect stream as durable data, not transient signals — reprocessable imports, usable-area computation and storage designed for later analysis.",
        lesson:
          "Real-time and long-term are not competing requirements. They are two consumers of the same well-designed data.",
      },
      {
        title: "Turn byte streams into software people can reason about",
        schematic: "bytes",
        context:
          "Industrial machines expose data through PLC memory areas, vendor-specific protocols and custom binary messages.",
        constraints:
          "The physical protocol had to remain exact — byte-level serialization, memory addressing — while application developers needed abstractions they could safely use.",
        decision:
          "I implemented connectors and drivers that own the protocol details and expose cleaner higher-level interfaces to the rest of the system.",
        lesson: "The lower the abstraction boundary, the more deliberate its design must be.",
      },
    ],
    technologies: [".NET", "Redis", "RabbitMQ", "OPC UA", "PLC", "Binary protocols"],
    accent: "lime",
  },
];

export const osusProjects: OsusProject[] = [
  {
    name: "RosettAI",
    category: "AI · Documents · Distributed processing",
    statement: "Translate the content. Preserve everything else.",
    description:
      "An asynchronous translation platform designed around document fidelity, validation, retries and observable processing.",
    status: "ACTIVE BUILD",
    accent: "violet",
    position: "top",
  },
  {
    name: "OSUS Ecosystem",
    category: "Identity · Credits · Trusted applications",
    statement: "Infrastructure for products designed to belong together.",
    description:
      "A shared foundation for identity, application trust, typed integrations and cross-product capabilities.",
    status: "FOUNDATION",
    accent: "cyan",
    position: "right",
  },
  {
    name: "FCHForge",
    category: "Industrial software · Configuration · DX",
    statement: "Complex machine integrations made visible and manageable.",
    description:
      "A tool shaped by real industrial constraints, turning feed-collector configuration into something engineers can understand and evolve.",
    status: "EXPLORATION",
    accent: "lime",
    position: "bottom",
  },
  {
    name: "Sounds",
    category: "Music · Product design · Social interaction",
    statement: "A reminder that software can also be playful.",
    description:
      "A product experiment around music, social rituals and the parts of software that should feel joyful rather than merely correct.",
    status: "CONCEPT",
    accent: "amber",
    position: "left",
  },
];
