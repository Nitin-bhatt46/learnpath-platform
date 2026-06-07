import { ButtonLink } from "@/components/ui/button";
import { getCourses } from "@/lib/content";
import { TargetIcon } from "@/components/ui/icons";
import { CourseCardProgress } from "@/components/learning/course-card-progress";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="bg-bg-primary px-4 py-12 text-text-main sm:px-6 sm:py-16 transition-colors duration-200">
      <section className="mx-auto max-w-5xl space-y-10">
        
        {/* TITLE & SUBTITLE */}
        <div className="max-w-2xl text-center mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold text-accent-text border border-primary/10">
            <TargetIcon className="h-3 w-3" />
            <span>Pathways Catalog</span>
          </span>
          <h1 className="text-3xl font-display font-bold tracking-tight text-text-main sm:text-4xl">
            Choose Your Software Engineering Career Path
          </h1>
          <p className="text-xs text-text-muted leading-5">
            Follow structured roadmaps designed to take you from beginner to industry-ready through projects, milestones and practical learning.
          </p>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const isBeginner = !!course.difficulty?.toLowerCase().includes("beginner");
            const isIntermediate = !!course.difficulty?.toLowerCase().includes("intermediate");
            
            return (
              <article
                key={course.id}
                className="flex flex-col justify-between rounded-xl border border-border-color bg-card-bg p-5 shadow-3xs transition-all duration-200 hover:scale-[1.01] hover:border-primary/40 group relative overflow-hidden"
              >
                {course.comingSoon && (
                  <div className="absolute top-3 right-3">
                    <span className="rounded bg-bg-primary border border-border-color px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                      Coming Soon
                    </span>
                  </div>
                )}
                
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-text-muted">
                      Engineering Track
                    </span>
                    <h2 className="mt-0.5 text-base font-display font-bold text-text-main group-hover:text-primary transition-colors">
                      {course.title}
                    </h2>
                  </div>

                  <p className="text-xs leading-5 text-text-muted">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 border-y border-border-color/50 py-3 text-xs">
                    <div>
                      <span className="text-text-muted text-[10px] font-medium block">Duration</span>
                      <span className="font-bold text-text-main">{course.duration || "10 Weeks"}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-[10px] font-medium block">Projects</span>
                      <span className="font-bold text-text-main">{course.projectsCount || 3} Tasks</span>
                    </div>
                  </div>

                  {course.skillsIncluded && course.skillsIncluded.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-extrabold uppercase tracking-widest text-text-muted block">
                        Included Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {course.skillsIncluded.map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-bg-primary border border-border-color/50 px-2 py-0.5 text-[10px] text-text-muted font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <CourseCardProgress
                    course={course}
                    isBeginner={isBeginner}
                    isIntermediate={isIntermediate}
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-border-color/40">
                  <ButtonLink href={`/courses/${course.id}`} variant="primary" size="sm" className="w-full">
                    {course.comingSoon ? "Explore Structure" : "Explore Roadmap"}
                  </ButtonLink>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
