import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: false })

export function renderMarkdown(source: string): string {
  const parsed = marked.parse(source, { async: false })
  return typeof parsed === 'string' ? parsed : ''
}
