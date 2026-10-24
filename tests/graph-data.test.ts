/// <reference types="node" />
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildElements } from '../lib/elements'
import { applyFilters } from '../lib/filterGraph'
import { isWeakEvidence, normalizeCourse, type CourseGraph } from '../lib/schema'

const raw = JSON.parse(readFileSync(new URL('../data/courses/ap-physics-1.json', import.meta.url), 'utf8'))
const course = normalizeCourse(raw, 'ap-physics-1')

assert.equal(course.nodes.length, 180)
assert.equal(course.units.length, 11)
assert.equal(course.edges.length, 479)
assert.equal(course.meta.counts?.edges_total, 479)
assert.equal(course.meta.counts?.grounded_evidence_kind?.label_mention_nearby, 65)
assert.equal(course.nodeById.get('dimensional-analysis')?.equationsVerified, false)
assert.ok(course.nodeById.get('dimensional-analysis')?.slideExcerpt)
assert.equal(course.warnings.length, 0)

const base = {
  units: course.units.map((unit) => unit.unit),
  types: ['concept', 'equation', 'law', 'skill'],
  relations: ['prerequisite', 'derived_from', 'applies_to', 'contrasts_with', 'part_of'],
  hideInferred: false,
  hideWeak: false,
  groupByUnit: true,
  matchIds: null,
  pinnedIds: new Set<string>(),
}

let visible = applyFilters(course, base)
assert.equal(visible.nodes.length, 180)
assert.equal(visible.units.length, 11)
assert.equal(visible.edges.length, 299)
assert.equal(visible.edges.some((edge) => edge.relation === 'part_of'), false)

const grouped = buildElements(course, visible, true)
assert.ok(grouped.filter((item) => item.data.kind === 'concept').every((item) => item.data.parent))
assert.equal(grouped.some((item) => item.data.relation === 'part_of'), false)

visible = applyFilters(course, { ...base, groupByUnit: false })
assert.equal(visible.edges.length, 479)
assert.equal(visible.units.length, 11)

visible = applyFilters(course, { ...base, hideInferred: true })
assert.equal(visible.edges.length, 249)

visible = applyFilters(course, { ...base, hideWeak: true })
assert.equal(visible.edges.length, 234)
assert.equal(visible.edges.filter(isWeakEvidence).length, 0)

visible = applyFilters(course, { ...base, hideInferred: true, hideWeak: true })
assert.equal(visible.edges.length, 184)

visible = applyFilters(course, { ...base, groupByUnit: false, hideWeak: true })
assert.equal(visible.edges.filter((edge) => edge.relation === 'part_of').length, 180)
assert.equal(visible.edges.filter(isWeakEvidence).length, 0)

visible = applyFilters(course, { ...base, units: ['ch11'] })
assert.equal(visible.nodes.length, 21)
assert.ok(visible.nodes.every((node) => node.unit === 'ch11'))

const conceptsOnly = normalizeCourse({
  course: 'AP Physics 2',
  author: 'Test',
  status: 'concepts only',
  units: { ch01: 'Ch 1 Measurement' },
  nodes: [
    {
      id: 'sample',
      label: 'Sample',
      unit: 'ch01',
      unit_name: 'Ch 1 Measurement',
      type: 'equation',
      definition: 'A sample definition.',
      equations: ['E=mc^2'],
      equations_verified_in_slide_text: false,
      slide_excerpt: 'original slide',
      source: {
        file: 'ch1.pdf',
        file_id: 'abc',
        link: 'https://example.com',
        page: 3,
        slide_title: 'Sample',
      },
    },
  ],
}, 'ap-physics-2')

assert.equal(conceptsOnly.title, 'AP Physics 2')
assert.equal(conceptsOnly.nodes.length, 1)
assert.equal(conceptsOnly.units.length, 1)
assert.equal(conceptsOnly.units[0]?.id, 'unit-ch01')
assert.equal(conceptsOnly.edges.length, 0)
assert.equal(conceptsOnly.nodes[0]?.equationsVerified, false)
assert.equal(conceptsOnly.nodes[0]?.slideExcerpt, 'original slide')
assert.equal(conceptsOnly.meta.status, 'concepts only')

const dropped = normalizeCourse({
  course: 'Broken edge',
  units: { ch01: 'Ch 1' },
  nodes: [{ id: 'a', label: 'A', unit: 'ch01', type: 'concept', definition: 'A' }],
  edges: [{ source: 'a', target: 'missing', relation: 'prerequisite', basis: 'inferred', note: 'no' }],
}, 'broken')
assert.equal(dropped.edges.length, 0)
assert.equal(dropped.warnings.length, 1)

const nodesOnly = applyFilters(conceptsOnly, {
  ...base,
  units: ['ch01'],
  groupByUnit: true,
})
assert.equal(nodesOnly.nodes.length, 1)
assert.equal(nodesOnly.edges.length, 0)
const elements = buildElements(conceptsOnly, nodesOnly, true)
assert.equal(elements.find((item) => item.data.id === 'sample')?.data.parent, 'unit-ch01')

function countEdges(graph: CourseGraph, relation: string) {
  return graph.edges.filter((edge) => edge.relation === relation).length
}
assert.equal(countEdges(course, 'part_of'), 180)

console.log('graph data tests passed')
