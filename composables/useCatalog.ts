import { getCatalog, getCourse, getGapsMarkdown } from '../lib/courseData'

export function useCatalog() {
  const catalog = getCatalog()
  const courseId = useState<string>('course-id', () => catalog[0]?.id ?? '')

  const course = computed(() => {
    return getCourse(courseId.value) ?? getCourse(catalog[0]?.id ?? '') ?? null
  })

  const gapsMarkdown = computed(() => (course.value ? getGapsMarkdown(course.value.id) : null))

  return { catalog, courseId, course, gapsMarkdown }
}
