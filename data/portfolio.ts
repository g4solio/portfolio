export type SchematicId = "collision" | "schema" | "agents" | "tiles";

export type Decision = {
  /** "01".."04" — printed as DECISION NN */
  number: string;
  title: string;
  schematic: SchematicId;
  caption: string;
  problem: string;
  constraint: string;
  decision: string;
  lesson: string;
  /** Render expanded on load so technical depth is visible without discovery. */
  openByDefault?: boolean;
};

export type Chapter = {
  /** "01".."06" — margin-rail chapter number */
  number: string;
  years: string;
  employer: string;
  role: string;
  /**
   * side      — prose column with the diagram exposed in the side column
   * interlude — short, quieter, no diagram
   * wide      — dominant chapter; decision block spans the full canvas
   */
  layout: "side" | "interlude" | "wide";
  lead: string[];
  decision?: Decision;
  tail?: string[];
  aside?: string;
  /** Small factual caption (interludes), e.g. what shipped. */
  note?: string;
  stack?: string;
};

export const chapters: Chapter[] = [
  {
    number: "01",
    years: "2016–2017",
    employer: "StarworkGC",
    role: "Junior programmer, later particle effects",
    layout: "side",
    lead: [
      "I started working during my fourth year of high school, mostly because school had stopped being difficult and I wanted problems that didn’t come with a solutions page. StarworkGC was a small independent game startup building a games in Unity, and I joined as a junior programmer — later doing particle effects as well.",
      "It’s where object-oriented programming, design patterns and teamwork stopped being school topics. My code had teammates, a build and players waiting on it.",
    ],
    decision: {
      number: "01",
      title: "Predicting collisions without simulating the future",
      schematic: "collision",
      caption: "fig. 01 — ray-based collision prediction, Unity",
      problem:
        "The game needed to warn players early about incoming collisions with asteroids and enemies — far enough ahead to react, precise enough to trust.",
      constraint:
        "It had to run inside the frame budget on low-powered machines. Simulating future game states was too expensive and produced timing artefacts.",
      decision:
        "I rebuilt the predictor around projected movement and ray-based spatial checks — geometry instead of simulation — and kept the warning window configurable.",
      lesson: "A good approximation at the right time beats an exact answer that arrives late.",
    },
    stack: "Unity, C#, real-time constraints, particle systems.",
  },
  {
    number: "02",
    years: "2017–2018",
    employer: "Melazeta",
    role: "Development intern",
    layout: "interlude",
    lead: [
      "Two short school-work placements on Unity mobile projects: a Winx dress-up app that shipped on the Play Store, then Unity UI, in-app purchases and some early augmented-reality work. My first contact with constraints that had nothing to do with code — artists with their own deadlines, assets arriving late, a release date that didn’t move. We shipped anyway.",
    ],
    note: "shipped: Winx dress-up app — Google Play",
    stack: "Unity UI, mobile, in-app purchases, AR.",
  },
  {
    number: "03",
    years: "2019–2021",
    employer: "Amaris · Credemtel",
    role: ".NET backend developer",
    layout: "side",
    lead: [
      "At Amaris I worked as a .NET backend consultant for Credemtel, on a document-management platform in a banking environment — REST APIs, microservices, RabbitMQ, Elasticsearch and a lot of deeply nested JSON.",
      "The document structures weren’t fixed. They were defined at runtime by an external configuration system and could nest arbitrarily deep, which made reading and writing them correctly a shared problem for every service that touched them.",
    ],
    decision: {
      number: "02",
      title: "One package for documents that keep changing shape",
      schematic: "schema",
      caption: "fig. 02 — configuration-driven document schemas",
      problem:
        "Every consumer — APIs, services, ETL jobs — needed to read and write documents whose structure was defined elsewhere and kept evolving.",
      constraint:
        "Consistency between the configuration and the stored data had to hold across arbitrary nesting, for consumers that didn’t know about each other.",
      decision:
        "I redesigned the read/write/transform path around a reusable configuration-driven package, so document structure lived in one place and every consumer integrated the same behaviour.",
      lesson:
        "When configuration is the contract, treating it as architecture is what keeps an ecosystem coherent.",
    },
    aside:
      "Looking back, I still held too much of the design in my own head at this stage. Learning to hand ideas over early — before they feel finished — came later.",
    stack: ".NET, REST APIs, microservices, RabbitMQ, Elasticsearch, ETL.",
  },
  {
    number: "04",
    years: "2021",
    employer: "iSolutions",
    role: "Full-stack developer",
    layout: "interlude",
    lead: [
      "Nine months of full-stack work on established products. No big story — the skill I took away was how to enter an existing codebase, map its hidden dependencies, and make changes conservative enough not to break what already worked.",
    ],
  },
  {
    number: "05",
    years: "2021–2023",
    employer: "MSC",
    role: "Senior .NET developer",
    layout: "wide",
    lead: [
      "I worked on the software that processes container and shipping documentation for one of the largest shipping companies in the world. Parts of the codebase were older than some of the people maintaining it: C# next to C++, stored procedures measured in thousands of lines, components running in installations across the globe. I collaborated daily with colleagues in the United States, including six weeks of in-person knowledge sharing there.",
      "Two problems from those years stayed with me. The first was a manager-and-agent system that distributed DLL-based capabilities — file operations, checks, health activities — to installations around the world, scheduled with Quartz.",
    ],
    decision: {
      number: "03",
      title: "Shipping capabilities to installations you cannot update predictably",
      schematic: "agents",
      caption: "fig. 03 — manager and agents, Quartz scheduling",
      problem:
        "A central manager distributed DLL-based capabilities to agents installed around the world, and had to know from a distance whether each one was healthy.",
      constraint:
        "Some installations could realistically be updated once. Whatever we shipped had to keep working next to the oldest contracts still alive in the field.",
      decision:
        "We treated backward compatibility as the primary design input: explicit dependency loading, Quartz-based scheduling, and health reporting so an agent’s state was never a guess.",
      lesson: "In globally distributed systems, compatibility is availability.",
      openByDefault: true,
    },
    tail: [
      "The second was less glamorous: a document flow between a third-party service, our central application and SAP, communicating through shared Windows folders. You don’t always get to choose your infrastructure. What you can do is make it observable — where each document is, where it got stuck, on whose side it failed. I coordinated the implementation across a group of four people.",
    ],
    aside:
      "MSC is also where I learned to delegate — and what it costs to accept too many parallel responsibilities instead of saying no early.",
    stack: "C#, C++, SQL, stored procedures, Quartz, SAP integration.",
  },
  {
    number: "06",
    years: "2024–today",
    employer: "GIAMMAR · System Ceramics",
    role: "Software engineering consultant",
    layout: "side",
    lead: [
      "Since 2024 I’ve been consulting on industrial software for System Ceramics through GIAMMAR — systems that talk to physical machinery in ceramic manufacturing plants. Data flows from PLCs and vendor protocols up through custom connectors into modern .NET services, Redis and RabbitMQ; decisions flow back down to the line.",
      "The project I keep coming back to is a quality pipeline. A machine photographs tiles and detects surface defects; the software has to turn that stream into decisions.",
    ],
    decision: {
      number: "04",
      title: "Turning detected defects into usable tiles",
      schematic: "tiles",
      caption: "fig. 04 — defect map and largest usable area",
      problem:
        "Defect data arrives from the machine as images and detections, in real time, while production keeps moving.",
      constraint:
        "The same data serves two clocks: immediate decisions on the line — including the largest usable tile area that avoids the defects — and long-term traceability across production history.",
      decision:
        "We treat the defect stream as durable data rather than transient signals: imports can be reprocessed, the usable-area computation is repeatable, and storage is designed for analysis years later.",
      lesson:
        "Real-time and long-term aren’t competing requirements — they’re two consumers of the same well-designed data.",
    },
    tail: [
      "The other half of the job is lower level: connectors and drivers that speak to machines at the byte-stream level — serialization, memory areas, vendor protocols — and expose interfaces the rest of the system can use without knowing any of that.",
    ],
    stack: ".NET, Redis, RabbitMQ, OPC UA, PLC, binary protocols.",
  },
];

export type OsusProject = {
  name: string;
  summary: string;
  status: string;
  /** Muted print-like tone used only inside the OSUS band. */
  tone: "blue" | "green" | "amber" | "red";
};

export const osusFeature = {
  name: "RosettAI",
  summary:
    "An asynchronous translation platform for documents where everything except the language must survive: layout, structure, embedded data. Built around observable processing, validation, retries and fidelity checks.",
  status: "active build",
  tone: "blue" as const,
};

export const osusProjects: OsusProject[] = [
  {
    name: "FCHForge",
    summary: "Makes industrial feed-collector configuration visible and manageable.",
    status: "exploring",
    tone: "amber",
  },
  {
    name: "OSUS Ecosystem",
    summary: "Shared identity, trust and integration layer for the other projects.",
    status: "building",
    tone: "green",
  },
  {
    name: "Sounds",
    summary: "Music, played together.",
    status: "concept",
    tone: "red",
  },
];
