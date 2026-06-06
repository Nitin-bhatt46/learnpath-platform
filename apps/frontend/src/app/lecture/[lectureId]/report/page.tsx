import { notFound } from "next/navigation";
import { getLectureBundle } from "@/lib/content";
import { ProgressProvider } from "@/lib/progress";
import { ReportView } from "@/components/learning/report-view";

export default async function ReportPage({ params }: { params: Promise<{ lectureId: string }> }) {
  const { lectureId } = await params;
  const bundle = await getLectureBundle(lectureId);

  if (!bundle) {
    notFound();
  }

  return (
    <ProgressProvider>
      <ReportView lecture={bundle.lecture} concepts={bundle.concepts} summary={bundle.summary} />
    </ProgressProvider>
  );
}
