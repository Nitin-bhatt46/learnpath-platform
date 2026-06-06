import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import {
  RouteIcon,
  FolderIcon,
  TrendingUpIcon,
  TargetIcon,
  GitBranchIcon,
  SparklesIcon,
  CheckCircleIcon,
  BookOpenIcon,
  ChevronRightIcon
} from "@/components/ui/icons";

const pathChips = [
  { name: "Full Stack Engineer", href: "/courses/web-development" },
  { name: "Backend Engineer", href: "/courses/backend-engineering" },
  { name: "AI Engineer", href: "/courses/ai-engineering" },
  { name: "Data Engineer", href: "/courses/data-engineering" },
  { name: "DevOps Engineer", href: "/courses/devops-engineering" }
];

const trustItems = [
  { 
    title: "Structured Roadmaps", 
    desc: "No choice fatigue. A clear step-by-step path from zero to job-ready.", 
    icon: <RouteIcon className="h-5 w-5 text-primary" /> 
  },
  { 
    title: "Real Projects", 
    desc: "Learn by building production-grade software applications.", 
    icon: <FolderIcon className="h-5 w-5 text-primary" /> 
  },
  { 
    title: "Progress Tracking", 
    desc: "Detailed breakdown of milestones, concepts, and quiz progress.", 
    icon: <TrendingUpIcon className="h-5 w-5 text-primary" /> 
  },
  { 
    title: "Career Focused Learning", 
    desc: "Curriculum tailored for direct industry entry and engineering roles.", 
    icon: <TargetIcon className="h-5 w-5 text-primary" /> 
  }
];

const featureCards = [
  {
    title: "Guided Roadmaps",
    desc: "Navigate through sequential topics, skills, and architectures without getting lost in tutorial hell.",
    icon: <GitBranchIcon className="h-5 w-5 text-primary" />
  },
  {
    title: "Project-Based Learning",
    desc: "Build real-world systems, frontend applications, and command-line tools that showcase your practical abilities.",
    icon: <FolderIcon className="h-5 w-5 text-primary" />
  },
  {
    title: "AI Learning Assistant",
    desc: "Integrated conceptual helpers that break down complex algorithms, operators, and memory models in real-time.",
    icon: <SparklesIcon className="h-5 w-5 text-primary" />
  },
  {
    title: "Progress Dashboard",
    desc: "Visualize your educational journey with persistent tracking of your completed modules, parts, and quiz scores.",
    icon: <CheckCircleIcon className="h-5 w-5 text-primary" />
  }
];

const roadmapNodes = [
  { name: "HTML", side: "left", num: 1 },
  { name: "CSS", side: "right", num: 2 },
  { name: "JavaScript", side: "left", num: 3 },
  { name: "React", side: "right", num: 4 },
  { name: "Node.js", side: "left", num: 5 },
  { name: "System Design", side: "right", num: 6 }
];

const careerPaths = [
  {
    name: "Full Stack Engineer",
    desc: "Build modern web client interfaces and scale secure backend APIs.",
    duration: "12 Weeks",
    difficulty: "Beginner → Advanced",
    skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "SQL"],
    href: "/courses/web-development"
  },
  {
    name: "Backend Engineer",
    desc: "Architect databases, design API interfaces, server cache, and queuing systems.",
    duration: "10 Weeks",
    difficulty: "Intermediate → Advanced",
    skills: ["Go / Python", "SQL/NoSQL", "Redis", "Docker", "APIs"],
    href: "/courses/backend-engineering"
  },
  {
    name: "AI Engineer",
    desc: "Develop vector embeddings, prompt pipelines, and autonomous agent architectures.",
    duration: "8 Weeks",
    difficulty: "Intermediate → Advanced",
    skills: ["Python", "LLMs", "LangChain", "VectorDBs", "RAG"],
    href: "/courses/ai-engineering"
  },
  {
    name: "Data Engineer",
    desc: "Construct pipelines, warehouse schemas, and distributed computational processes.",
    duration: "14 Weeks",
    difficulty: "Intermediate → Advanced",
    skills: ["Python", "Apache Spark", "Airflow", "Snowflake", "Kafka"],
    href: "/courses/data-engineering"
  },
  {
    name: "DevOps Engineer",
    desc: "Deploy cloud environments, provision Terraform infrastructure, and manage logs.",
    duration: "10 Weeks",
    difficulty: "Intermediate → Advanced",
    skills: ["Linux/Bash", "Kubernetes", "Terraform", "CI/CD", "AWS"],
    href: "/courses/devops-engineering"
  }
];

export default function Home() {
  return (
    <main className="bg-bg-primary px-4 py-12 text-text-main sm:px-6 sm:py-16 transition-colors duration-200">
      
      {/* HERO SECTION */}
      <section className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border-color bg-card-bg px-3 py-1 text-[11px] font-semibold text-primary shadow-3xs">
            <TargetIcon className="h-3 w-3" />
            <span>Structured Career Roadmaps</span>
          </div>
          
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-main sm:text-4xl sm:leading-[1.15]">
            Master In-Demand Tech Skills Through Structured Learning Paths
          </h1>
          
          <p className="text-sm leading-6 text-text-muted">
            Learn Backend Engineering, AI Engineering, Data Engineering, Full Stack Development and more through project-based roadmaps designed for real-world careers.
          </p>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/courses" variant="primary" size="md" className="w-full sm:w-auto">
              Start Learning
            </ButtonLink>
            <ButtonLink href="#paths" variant="secondary" size="md" className="w-full sm:w-auto">
              Explore Learning Paths
            </ButtonLink>
          </div>
          
          <div className="pt-4 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Active Tracks</span>
            <div className="flex flex-wrap gap-1.5">
              {pathChips.map((chip) => (
                <Link
                  key={chip.name}
                  href={chip.href}
                  className="rounded-lg border border-border-color bg-card-bg px-2.5 py-1 text-xs font-semibold text-text-muted hover:border-primary/40 hover:text-primary transition-colors duration-150"
                >
                  {chip.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Staggered Node Graph Visualizer */}
        <div className="rounded-xl border border-border-color bg-card-bg p-6 shadow-3xs relative overflow-hidden">
          <div className="border-b border-border-color/50 pb-3 mb-6 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Engineering Skill Progression Map</span>
            <span className="flex h-2 w-2 rounded-full bg-primary" />
          </div>
          
          <div className="relative w-full max-w-[280px] mx-auto py-2">
            {/* Center Dashed Progression Line */}
            <div className="absolute left-1/2 top-4 bottom-4 w-0.5 border-l border-dashed border-border-color -translate-x-1/2" />

            {/* Nodes Layout */}
            <div className="space-y-4 relative">
              {roadmapNodes.map((node) => {
                const isLeft = node.side === "left";
                return (
                  <div key={node.name} className="relative flex items-center justify-between w-full h-9">
                    {/* Left Slot */}
                    <div className="w-[42%] text-right pr-2">
                      {isLeft && (
                        <span className="inline-block rounded-md border border-border-color bg-bg-primary px-2.5 py-1 text-2xs font-semibold text-text-main hover:border-primary/40 transition-colors">
                          {node.name}
                        </span>
                      )}
                    </div>
                    
                    {/* Node Dot */}
                    <div className="absolute left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-card-bg text-[9px] font-bold text-text-muted border border-border-color shadow-3xs">
                      {node.num}
                    </div>

                    {/* Right Slot */}
                    <div className="w-[42%] pl-2">
                      {!isLeft && (
                        <span className="inline-block rounded-md border border-border-color bg-bg-primary px-2.5 py-1 text-2xs font-semibold text-text-main hover:border-primary/40 transition-colors">
                          {node.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Centered Final Milestone Node */}
              <div className="pt-2 flex flex-col items-center justify-center relative w-full">
                <div className="h-6 w-px bg-border-color absolute -top-2" />
                <div className="rounded-lg border border-primary/30 bg-accent px-4 py-1.5 text-center text-xs font-bold text-accent-text shadow-sm roadmap-glow">
                  Industry Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="mx-auto mt-16 max-w-5xl border-y border-border-color py-8 transition-colors duration-200">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <div key={item.title} className="flex gap-3 items-start">
              <div className="flex-shrink-0 mt-0.5">{item.icon}</div>
              <div>
                <h3 className="text-xs font-bold text-text-main">{item.title}</h3>
                <p className="mt-1 text-[11px] leading-4 text-text-muted">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="mx-auto mt-16 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-display font-semibold text-text-main">Engineered for Technical Mastery</h2>
          <p className="text-xs text-text-muted">A structured visual curriculum designed specifically to bypass choose-your-own-adventure choice fatigue.</p>
        </div>
        
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {featureCards.map((feat) => (
            <article key={feat.title} className="hover-lift flex gap-4 rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs">
              <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent/40">
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-text-main">{feat.title}</h3>
                <p className="text-xs leading-5 text-text-muted">{feat.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CAREER PATH SECTION */}
      <section id="paths" className="mx-auto mt-20 max-w-5xl">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Core Curriculum Paths</span>
          <h2 className="text-2xl font-display font-semibold text-text-main">Choose Your Software Career Track</h2>
          <p className="text-xs text-text-muted">Follow clean milestone-mapped paths structured directly around corporate engineering requirements.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {careerPaths.map((path) => (
            <article key={path.name} className="hover-lift flex flex-col justify-between rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs hover:border-primary/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-text">
                    {path.duration}
                  </span>
                  <span className="text-[10px] font-semibold text-text-muted">
                    {path.difficulty}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-base font-bold text-text-main">{path.name}</h3>
                  <p className="mt-1 text-xs text-text-muted leading-5">{path.desc}</p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {path.skills.map((skill) => (
                    <span key={skill} className="rounded bg-bg-primary border border-border-color/50 px-2 py-0.5 text-[10px] font-medium text-text-muted">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-color/40">
                <ButtonLink href={path.href} variant="primary" size="sm" className="w-full">
                  Explore Roadmap
                </ButtonLink>
              </div>
            </article>
          ))}
        </div>
      </section>
      
    </main>
  );
}
