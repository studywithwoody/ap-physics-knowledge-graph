import { normalizeCourse, type CourseGraph } from './schema'

export interface CourseSummary {
  id: string
  title: string
  author: string
  hasGaps: boolean
}

type JsonModule = { default: unknown }

const courseModules = import.meta.glob('../data/courses/*.json', { eager: true }) as Record<string, JsonModule>
const gapModules = import.meta.glob('../data/courses/*.gaps.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const courses = new Map<string, CourseGraph>()
const gaps = new Map<string, string>()

for (const [path, mod] of Object.entries(courseModules)) {
  const id = idFromPath(path)
  courses.set(id, normalizeCourse(mod.default, id))
}

for (const [path, source] of Object.entries(gapModules)) {
  gaps.set(idFromPath(path), source)
}

if (courses.size === 0) {
  throw new Error('找不到課程資料。請在 data/courses/ 放入至少一個 JSON 檔。')
}

const DEFAULT_COURSE_ID = 'ap-physics-1'

export function defaultCourseId(): string {
  if (courses.has(DEFAULT_COURSE_ID)) return DEFAULT_COURSE_ID
  return [...courses.keys()][0] ?? ''
}

export function getCatalog(): CourseSummary[] {
  return [...courses.values()]
    .map((course) => ({
      id: course.id,
      title: course.title,
      author: course.meta.author,
      hasGaps: gaps.has(course.id),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'en'))
}

export function getCourse(id: string): CourseGraph | null {
  return courses.get(id) ?? null
}

export function getGapsMarkdown(id: string): string | null {
  return gaps.get(id) ?? null
}

function idFromPath(path: string): string {
  const file = path.split('/').pop() ?? path
  return file.replace(/\.gaps\.md$/, '').replace(/\.json$/, '')
}
