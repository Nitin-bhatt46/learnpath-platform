import { promises as fs } from "fs";
import path from "path";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type Lecture = {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  conceptOrder: string[];
};

export type Mcq = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type Concept = {
  id: string;
  title: string;
  image: string;
  learningObjectives: string[];
  content: {
    explanation: string;
    example: string;
    analogy: string;
    keyTakeaway: string;
  };
  tags: string[];
  mcqs: Mcq[];
};

export type Summary = {
  quickRevision: Array<{
    title: string;
    summary: string;
  }>;
  flow: string[];
};

export type LectureOverview = Lecture & {
  conceptCount: number;
  skillId?: string;
  courseId?: string;
  partId?: string;
  partTitle?: string;
  partOrder?: number;
  concepts?: Array<{ id: string; title: string; estimatedMinutes: number }>;
};

export type LectureBundle = {
  lecture: Lecture;
  concepts: Concept[];
  summary: Summary;
};

export type Skill = {
  id: string;
  title: string;
  description: string;
  courseId: string;
  lectures: LectureOverview[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
  duration?: string;
  projectsCount?: number;
  difficulty?: string;
  skillsIncluded?: string[];
  levelIndicator?: string;
  order?: number;
  roadmapOverview?: string[];
  comingSoon?: boolean;
};

const contentRoot = path.join(process.cwd(), "src", "content");

async function readJson<T>(filePath: string): Promise<T> {
  const file = await fs.readFile(filePath, "utf-8");
  return JSON.parse(file) as T;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function formatTitle(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

let cachedData: {
  courses: Course[];
  lectureMap: Record<string, string>;
} | null = null;

async function scanContent(): Promise<{ courses: Course[]; lectureMap: Record<string, string> }> {
  if (cachedData && process.env.NODE_ENV === "production") {
    return cachedData;
  }

  const courses: Course[] = [];
  const lectureMap: Record<string, string> = {};

  try {
    const level1Entries = await fs.readdir(contentRoot, { withFileTypes: true });

    for (const l1 of level1Entries) {
      if (!l1.isDirectory()) continue;
      const l1Path = path.join(contentRoot, l1.name);

      // 1. Is it a lecture directory directly under contentRoot (e.g. lecture-1)?
      const l1HasLecture = await fileExists(path.join(l1Path, "lecture.json"));
      if (l1HasLecture) {
        lectureMap[l1.name.toLowerCase()] = l1Path;
        try {
          const lectureData = await readJson<Lecture>(path.join(l1Path, "lecture.json"));
          lectureMap[lectureData.id.toLowerCase()] = l1Path;
        } catch (err) {
          console.error(`Error reading lecture metadata in ${l1Path}:`, err);
        }
        continue;
      }

      // 2. Is it a Course directory?
      const hasCourseMeta = await fileExists(path.join(l1Path, "course.json"));
      const courseMeta: {
        title?: string;
        description?: string;
        duration?: string;
        projectsCount?: number;
        difficulty?: string;
        skillsIncluded?: string[];
        levelIndicator?: string;
        order?: number;
        roadmapOverview?: string[];
        comingSoon?: boolean;
      } = hasCourseMeta
        ? await readJson<any>(path.join(l1Path, "course.json")).catch(() => ({}))
        : {};

      const course: Course = {
        id: l1.name,
        title: courseMeta.title ?? formatTitle(l1.name),
        description: courseMeta.description ?? "",
        skills: [],
        duration: courseMeta.duration,
        projectsCount: courseMeta.projectsCount,
        difficulty: courseMeta.difficulty,
        skillsIncluded: courseMeta.skillsIncluded,
        levelIndicator: courseMeta.levelIndicator,
        order: courseMeta.order,
        roadmapOverview: courseMeta.roadmapOverview,
        comingSoon: courseMeta.comingSoon
      };

      // Scan Level 2 (Skills)
      const level2Entries = await fs.readdir(l1Path, { withFileTypes: true }).catch(() => []);
      for (const l2 of level2Entries) {
        if (!l2.isDirectory()) continue;
        const l2Path = path.join(l1Path, l2.name);

        // Check if it's a lecture directly under Course
        const l2HasLecture = await fileExists(path.join(l2Path, "lecture.json"));
        if (l2HasLecture) {
          lectureMap[l2.name.toLowerCase()] = l2Path;
          try {
            const lectureData = await readJson<Lecture>(path.join(l2Path, "lecture.json"));
            lectureMap[lectureData.id.toLowerCase()] = l2Path;
          } catch (err) {
            console.error(`Error reading lecture metadata in ${l2Path}:`, err);
          }
          continue;
        }

        // Check if it's a Skill directory
        const hasSkillMeta = await fileExists(path.join(l2Path, "skill.json"));
        const skillMeta: { title?: string; description?: string } = hasSkillMeta
          ? await readJson<{ title?: string; description?: string }>(path.join(l2Path, "skill.json")).catch(() => ({}))
          : {};

        const hasMetadataJson = await fileExists(path.join(l2Path, "metadata.json"));
        const metadata: {
          title?: string;
          order?: number;
          parts?: Array<{ id: string; title: string; order: number }>;
        } | null = hasMetadataJson
          ? await readJson<{
              title?: string;
              order?: number;
              parts?: Array<{ id: string; title: string; order: number }>;
            }>(path.join(l2Path, "metadata.json")).catch(() => null)
          : null;

        const skill: Skill = {
          id: l2.name,
          title: metadata?.title ?? skillMeta.title ?? formatTitle(l2.name),
          description: skillMeta.description ?? "",
          courseId: course.id,
          lectures: []
        };

        // Scan Level 3 (Lectures under Skill)
        const level3Entries = await fs.readdir(l2Path, { withFileTypes: true }).catch(() => []);
        for (const l3 of level3Entries) {
          if (!l3.isDirectory()) continue;
          const l3Path = path.join(l2Path, l3.name);

          const l3HasLecture = await fileExists(path.join(l3Path, "lecture.json"));
          if (l3HasLecture) {
            lectureMap[l3.name.toLowerCase()] = l3Path;
            try {
              const lectureData = await readJson<Lecture>(path.join(l3Path, "lecture.json"));
              lectureMap[lectureData.id.toLowerCase()] = l3Path;

              const partMeta = metadata?.parts?.find((p) => p.id === l3.name);
              const partTitle = partMeta?.title ?? lectureData.title;
              const partOrder = partMeta?.order ?? 99;

              const resolvedConcepts: Array<{ id: string; title: string; estimatedMinutes: number }> = [];
              for (const conceptId of lectureData.conceptOrder) {
                const conceptDir = await findConceptDir(l3Path, conceptId);
                if (conceptDir) {
                  try {
                    const conceptMeta = await readJson<{ title?: string; estimatedMinutes?: number }>(
                      path.join(conceptDir, "concept.json")
                    );
                    resolvedConcepts.push({
                      id: conceptId,
                      title: conceptMeta.title ?? formatTitle(conceptId),
                      estimatedMinutes: conceptMeta.estimatedMinutes ?? 3
                    });
                  } catch {
                    resolvedConcepts.push({
                      id: conceptId,
                      title: formatTitle(conceptId),
                      estimatedMinutes: 3
                    });
                  }
                } else {
                  resolvedConcepts.push({
                    id: conceptId,
                    title: formatTitle(conceptId),
                    estimatedMinutes: 3
                  });
                }
              }

              skill.lectures.push({
                ...lectureData,
                conceptCount: lectureData.conceptOrder.length,
                skillId: skill.id,
                courseId: course.id,
                partId: l3.name,
                partTitle: partTitle,
                partOrder: partOrder,
                concepts: resolvedConcepts
              });
            } catch (err) {
              console.error(`Error reading lecture metadata in ${l3Path}:`, err);
            }
          }
        }

        if (metadata && metadata.parts) {
          skill.lectures.sort((a, b) => (a.partOrder ?? 99) - (b.partOrder ?? 99));
        } else {
          skill.lectures.sort((a, b) => a.title.localeCompare(b.title));
        }
        course.skills.push(skill);
      }

      courses.push(course);
    }
  } catch (err) {
    console.error("Error scanning content root directory:", err);
  }

  courses.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  cachedData = { courses, lectureMap };
  return cachedData;
}

export async function getCourses(): Promise<Course[]> {
  const { courses } = await scanContent();
  return courses;
}

export async function getCourse(courseId: string): Promise<Course | null> {
  const { courses } = await scanContent();
  return courses.find((c) => c.id.toLowerCase() === courseId.toLowerCase()) ?? null;
}

export async function getLectures(): Promise<LectureOverview[]> {
  const { courses, lectureMap } = await scanContent();
  const allLectures: LectureOverview[] = [];

  for (const course of courses) {
    for (const skill of course.skills) {
      allLectures.push(...skill.lectures);
    }
  }

  const pathSet = new Set(
    allLectures.map((l) => lectureMap[l.id.toLowerCase()] || lectureMap[l.title.toLowerCase()]).filter(Boolean)
  );

  for (const [key, lecturePath] of Object.entries(lectureMap)) {
    if (pathSet.has(lecturePath)) continue;
    try {
      const lectureData = await readJson<Lecture>(path.join(lecturePath, "lecture.json"));
      allLectures.push({
        ...lectureData,
        conceptCount: lectureData.conceptOrder.length
      });
      pathSet.add(lecturePath);
    } catch {
      // ignore
    }
  }

  return allLectures.sort((a, b) => a.title.localeCompare(b.title));
}

async function findConceptDir(lectureDir: string, conceptId: string): Promise<string | null> {
  const conceptsParentDir = path.join(lectureDir, "concepts");
  const entries = await fs.readdir(conceptsParentDir, { withFileTypes: true }).catch(() => []);

  const normalize = (name: string) => name.toLowerCase().replace(/[-_]+/g, "-");

  const targetNormalized = normalize(conceptId);
  const matchedEntry = entries.find(
    (entry) => entry.isDirectory() && normalize(entry.name) === targetNormalized
  );

  if (matchedEntry) {
    return path.join(conceptsParentDir, matchedEntry.name);
  }

  const directPath = path.join(conceptsParentDir, conceptId);
  if (await fileExists(path.join(directPath, "concept.json"))) {
    return directPath;
  }

  return null;
}

export async function getLectureBundle(lectureId: string): Promise<LectureBundle | null> {
  const { lectureMap } = await scanContent();
  const lectureDir = lectureMap[lectureId.toLowerCase()];

  if (!lectureDir) {
    return null;
  }

  try {
    const lecture = await readJson<Lecture>(path.join(lectureDir, "lecture.json"));
    const summary = await readJson<Summary>(path.join(lectureDir, "summary.json"));
    const concepts = (
      await Promise.all(
        lecture.conceptOrder.map(async (conceptId) => {
          const conceptDir = await findConceptDir(lectureDir, conceptId);
          if (!conceptDir) {
            console.warn(`Warning: Concept folder not found for ID "${conceptId}" in ${lectureDir}`);
            return null;
          }
          try {
            return await readJson<Concept>(path.join(conceptDir, "concept.json"));
          } catch {
            return null;
          }
        })
      )
    ).filter((c): c is Concept => c !== null);

    return { lecture, concepts, summary };
  } catch (err) {
    console.error("Error in getLectureBundle:", err);
    return null;
  }
}

export function getConceptImageUrl(lectureId: string, concept: Concept) {
  const imageName = concept.image.replace(/^\.\//, "");
  return `/api/content-image/${lectureId}/concepts/${concept.id}/${imageName}`;
}

export async function resolveContentAssetPath(segments: string[]): Promise<string> {
  const safeSegments = segments.filter((segment) => !segment.includes("..") && segment.length > 0);
  if (safeSegments.length > 0) {
    const lectureId = safeSegments[0];
    const { lectureMap } = await scanContent();
    const lectureDir = lectureMap[lectureId.toLowerCase()];
    if (lectureDir) {
      if (safeSegments[1] === "concepts" && safeSegments.length > 2) {
        const conceptId = safeSegments[2];
        const conceptDir = await findConceptDir(lectureDir, conceptId);
        if (conceptDir) {
          return path.join(conceptDir, ...safeSegments.slice(3));
        }
      }
      return path.join(lectureDir, ...safeSegments.slice(1));
    }
  }
  return path.join(contentRoot, ...safeSegments);
}

