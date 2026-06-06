import { ButtonLink } from "@/components/ui/button";
import {
  GitBranchIcon,
  FolderIcon,
  TrendingUpIcon,
  BookOpenIcon,
  TargetIcon,
  CheckCircleIcon,
  RouteIcon
} from "@/components/ui/icons";

const missions = [
  {
    title: "Structured Learning",
    desc: "We clear the fog by defining unambiguous step-by-step pathways, eliminating analysis paralysis and guiding you clearly through each concept.",
    icon: <GitBranchIcon className="h-6 w-6 text-primary" />
  },
  {
    title: "Project-Based Learning",
    desc: "Concepts are only real when applied. Our roadmap tasks prompt you to build actual applications and scripts that test your systems design skills.",
    icon: <FolderIcon className="h-6 w-6 text-primary" />
  },
  {
    title: "Career Growth",
    desc: "Every track is designed backwards from real job postings, focusing only on the tools, paradigms, and logic that modern engineering teams use.",
    icon: <TrendingUpIcon className="h-6 w-6 text-primary" />
  }
];

const timelineSteps = [
  { step: "1", title: "Choose Path", desc: "Select a specialized engineering path suited to your ambitions.", icon: <RouteIcon className="h-4 w-4" /> },
  { step: "2", title: "Learn Concepts", desc: "Absorb bite-sized structural tutorials with modern code explanations.", icon: <BookOpenIcon className="h-4 w-4" /> },
  { step: "3", title: "Build Projects", desc: "Compile real systems and verify integration with live milestones.", icon: <TargetIcon className="h-4 w-4" /> },
  { step: "4", title: "Practice Quizzes", desc: "Solidify core concepts through smart, feedback-backed multiple choice tests.", icon: <CheckCircleIcon className="h-4 w-4" /> },
  { step: "5", title: "Track Progress", desc: "Watch your dashboard completion rates rise as skills become permanent.", icon: <TrendingUpIcon className="h-4 w-4" /> },
  { step: "6", title: "Become Industry Ready", desc: "Apply to real-world roles with a structured, verified portfolio.", icon: <TargetIcon className="h-4 w-4" /> }
];

const stats = [
  { label: "Career Paths", value: "5" },
  { label: "Topics Map", value: "40+" },
  { label: "Real Projects", value: "15+" },
  { label: "Quiz Questions", value: "100+" }
];

export default function AboutPage() {
  return (
    <main className="bg-bg-primary px-4 py-12 text-text-main sm:px-6 sm:py-16 transition-colors duration-200">
      <div className="mx-auto max-w-5xl space-y-20">
        
        {/* SECTION 1: HERO */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-text border border-primary/10">
            Our Purpose
          </span>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-main sm:text-4xl">
            Building Future Software Engineers
          </h1>
          <p className="text-sm leading-6 text-text-muted">
            LearnPath helps students and professionals master software engineering through structured roadmaps, practical projects, quizzes and progress tracking.
          </p>
        </section>

        {/* SECTION 2: MISSION CARDS */}
        <section className="grid gap-6 sm:grid-cols-3">
          {missions.map((m) => (
            <div key={m.title} className="rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs hover-lift space-y-4">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent/40">
                {m.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main">{m.title}</h3>
                <p className="mt-2 text-xs leading-5 text-text-muted">{m.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* SECTION 3: LEARNING JOURNEY TIMELINE */}
        <section className="space-y-10">
          <div className="text-center">
            <h2 className="text-2xl font-display font-semibold text-text-main">The Learning Journey Timeline</h2>
            <p className="text-xs text-text-muted">Your step-by-step roadmap to professional software development.</p>
          </div>
          
          <div className="relative border-l border-border-color ml-4 md:ml-6 space-y-8 max-w-2xl mx-auto">
            {timelineSteps.map((s) => (
              <div key={s.title} className="relative pl-8 md:pl-10">
                <span className="absolute -left-[15px] top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-surface ring-4 ring-bg-primary shadow-3xs">
                  {s.icon}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text-main">{s.title}</h3>
                  <p className="mt-1.5 text-xs leading-5 text-text-muted">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: PLATFORM STATISTICS */}
        <section className="rounded-xl border border-border-color bg-card-bg p-6 shadow-3xs">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: CTA */}
        <section className="text-center border border-border-color bg-card-bg rounded-xl p-8 md:p-12 shadow-3xs space-y-5">
          <h2 className="text-2xl font-display font-semibold text-text-main">Start Your Learning Journey</h2>
          <p className="max-w-md mx-auto text-xs text-text-muted leading-5">
            Get absolute clarity on what skills you need next. Learn, test, and trace your achievements in a unified dashboard.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:items-center pt-2">
            <ButtonLink href="/courses" variant="secondary" size="md">
              Explore Career Paths
            </ButtonLink>
            <ButtonLink href="/courses/web-development" variant="primary" size="md">
              Start Learning
            </ButtonLink>
          </div>
        </section>

      </div>
    </main>
  );
}
