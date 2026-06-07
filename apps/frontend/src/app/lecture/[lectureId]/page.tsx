import { notFound } from "next/navigation";
import { getConceptImageUrl, getLectureBundle, getCourses } from "@/lib/content";
import { ProgressProvider } from "@/lib/progress";
import { LearningFlow } from "@/components/learning/learning-flow";

export default async function LecturePage({ params }: { params: Promise<{ lectureId: string }> }) {
  const { lectureId } = await params;
  const bundle = await getLectureBundle(lectureId);

  if (!bundle) {
    notFound();
  }

  const courses = await getCourses();
  const parentCourse = courses.find((course) =>
    course.skills.some((skill) =>
      skill.lectures.some((lecture) => lecture.id.toLowerCase() === lectureId.toLowerCase())
    )
  );

  const parentSkill = parentCourse?.skills.find((skill) =>
    skill.lectures.some((lecture) => lecture.id.toLowerCase() === lectureId.toLowerCase())
  );

  const courseLecturesData = parentCourse
    ? parentCourse.skills.flatMap((skill) =>
        skill.lectures.map((lecture) => ({
          id: lecture.id,
          conceptCount: lecture.conceptCount
        }))
      )
    : [];

  const moduleLecturesData = parentSkill
    ? parentSkill.lectures.map((lecture) => ({
        id: lecture.id,
        conceptCount: lecture.conceptCount
      }))
    : [];

  const courseName = parentCourse?.title || "";
  const moduleName = parentSkill?.title || "";

  const imageUrls = Object.fromEntries(
    bundle.concepts.map((concept) => [concept.id, getConceptImageUrl(bundle.lecture.id, concept)])
  );

  return (
    <ProgressProvider>
      <LearningFlow
        lecture={bundle.lecture}
        concepts={bundle.concepts}
        imageUrls={imageUrls}
        courseLecturesData={courseLecturesData}
        courseName={courseName}
        moduleLecturesData={moduleLecturesData}
        moduleName={moduleName}
        courseId={parentCourse?.id}
      />
    </ProgressProvider>
  );
}
