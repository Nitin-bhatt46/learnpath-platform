import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getCourses } from "@/lib/content";
import { CourseRoadmapView } from "@/components/learning/course-roadmap-view";

export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((course) => ({ courseId: course.id }));
}

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = await getCourse(courseId);

  if (!course) {
    notFound();
  }

  return (
    <main className="bg-bg-primary px-4 py-8 text-text-main sm:px-6 sm:py-12 transition-colors duration-200">
      <section className="mx-auto max-w-5xl space-y-6">
        <div>
          <Link href="/courses" className="inline-flex h-9 items-center text-xs font-bold text-text-muted hover:text-primary transition-colors">
            &larr; Back to Career Paths
          </Link>
        </div>

        <CourseRoadmapView course={course} />
      </section>
    </main>
  );
}

