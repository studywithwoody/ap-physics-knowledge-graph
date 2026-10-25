<script setup lang="ts">
import type { GraphEdge } from '../lib/schema'
import { basisLabel, relationLabel, typeLabel } from '../lib/labels'

defineEmits<{ close: [] }>()

const explorer = useExplorer()

const node = computed(() => explorer.selectedNode.value)
const edge = computed(() => explorer.selectedEdge.value)

const unitInfo = computed(() => {
  const current = node.value
  if (!current) return null
  return explorer.course.value.units.find((unit) => unit.id === current.unitId || unit.id === current.id) ?? null
})

const unitConcepts = computed(() => {
  if (node.value?.type !== 'unit') return []
  return explorer.course.value.nodes.filter((item) => item.unitId === node.value?.id)
})

const membership = computed(() => {
  if (!node.value || node.value.type === 'unit') return null
  return explorer.course.value.edges.find((item) => item.relation === 'part_of' && item.source === node.value?.id) ?? null
})

const outgoing = computed(() => linked('out'))
const incoming = computed(() => linked('in'))

const edgeHidden = computed(() => {
  if (!edge.value) return false
  return !explorer.visible.value.edges.some((item) => item.id === edge.value?.id)
})

function linked(direction: 'out' | 'in') {
  const current = node.value
  if (!current) return []
  return explorer.course.value.edges
    .filter((item) => item.relation !== 'part_of' && (direction === 'out' ? item.source === current.id : item.target === current.id))
    .sort((a, b) => a.relation.localeCompare(b.relation) || labelOf(otherId(a, current.id)).localeCompare(labelOf(otherId(b, current.id))))
}

function otherId(item: GraphEdge, currentId: string) {
  return item.source === currentId ? item.target : item.source
}

function labelOf(id: string) {
  return explorer.course.value.nodeById.get(id)?.label ?? id
}

function relationText(relation: string) {
  return explorer.course.value.meta.relations[relation] ?? ''
}
</script>

<template>
  <aside class="flex h-full min-h-0 min-w-0 max-w-full flex-col bg-panel">
    <div class="flex items-center justify-between border-b border-line px-3 py-2 xl:hidden">
      <h2 class="font-semibold">詳情</h2>
      <button type="button" class="toolbar-btn" @click="$emit('close')">關閉</button>
    </div>

    <div class="min-h-0 min-w-0 flex-1 overflow-auto px-4 py-4">
      <div v-if="edge" class="space-y-4">
        <div>
          <p class="field-label">連結</p>
          <h2 class="mt-1 font-serif text-2xl leading-tight text-navy">
            {{ relationLabel(edge.relation) }}
          </h2>
          <p class="text-xs text-ink/50">{{ edge.relation }}</p>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span class="chip bg-navy/10 text-navy">{{ basisLabel(edge.basis) }}</span>
          <span v-if="edge.crossUnit" class="chip bg-paper text-ink ring-1 ring-line">跨單元</span>
        </div>
        <p v-if="relationText(edge.relation)" class="text-sm leading-6 text-ink/75">{{ relationText(edge.relation) }}</p>
        <p v-if="edge.note" class="text-sm leading-6">
          <span class="font-semibold">備註　</span><MathText :text="edge.note" />
        </p>
        <div class="grid gap-2">
          <button type="button" class="rounded-lg border border-line bg-paper px-3 py-2 text-left text-sm hover:border-navy" @click="explorer.selectNode(edge.source)">
            <span class="block text-[11px] text-ink/50">起點</span>
            <MathText :text="labelOf(edge.source)" />
          </button>
          <button type="button" class="rounded-lg border border-line bg-paper px-3 py-2 text-left text-sm hover:border-navy" @click="explorer.selectNode(edge.target)">
            <span class="block text-[11px] text-ink/50">終點</span>
            <MathText :text="labelOf(edge.target)" />
          </button>
        </div>
        <p v-if="edgeHidden" class="rounded-md bg-amber-100 px-2 py-1 text-xs text-amber-950">
          這條連結目前被篩選隱藏，圖上不會畫出來。
        </p>
        <EvidenceBlock v-if="edge.evidence" :evidence="edge.evidence" />
        <p v-else class="text-sm text-ink/60">這條連結沒有講義引文。</p>
      </div>

      <div v-else-if="node && node.type === 'unit'" class="space-y-4">
        <div>
          <p class="field-label">單元</p>
          <h2 class="mt-1 font-serif text-2xl leading-tight text-navy"><MathText :text="node.label" /></h2>
        </div>
        <p class="text-sm leading-6">這個單元有 {{ unitConcepts.length }} 個概念。點名稱可在圖上定位。</p>
        <section v-if="unitInfo?.files.length" class="space-y-2">
          <h3 class="font-serif text-base text-navy">講義檔案</h3>
          <a
            v-for="file in unitInfo.files"
            :key="file.fileId || file.file"
            :href="file.link || undefined"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-lg border border-line bg-paper px-3 py-2 text-sm leading-5 text-navy underline-offset-2 hover:border-navy"
            :class="file.link ? 'underline' : 'pointer-events-none no-underline'"
          >
            {{ file.file }}
            <span v-if="file.pages != null" class="block text-xs text-ink/55 no-underline">{{ file.pages }} 頁</span>
          </a>
        </section>
        <ul class="space-y-1">
          <li v-for="concept in unitConcepts" :key="concept.id">
            <button type="button" class="w-full rounded-md px-2 py-1 text-left text-sm hover:bg-paper" @click="explorer.selectNode(concept.id)">
              <span class="text-ink/45">{{ typeLabel(concept.type) }}</span>
              <MathText :text="concept.label" />
            </button>
          </li>
        </ul>
      </div>

      <div v-else-if="node" class="space-y-4">
        <div>
          <p class="field-label">{{ typeLabel(node.type) }} · {{ node.type }}</p>
          <h2 class="mt-1 font-serif text-2xl leading-tight text-navy"><MathText :text="node.label" /></h2>
          <p class="mt-1 text-xs text-ink/45">{{ node.id }}</p>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <span class="chip bg-navy/10 text-navy">{{ node.unitName }}</span>
          <span v-if="node.equationsVerified === false" class="chip bg-vermilion text-white">待確認</span>
          <span v-else-if="node.equations.length && node.equationsVerified === true" class="chip bg-emerald-800/10 text-emerald-950">已核對</span>
        </div>

        <section v-if="node.definition" class="space-y-1">
          <h3 class="font-serif text-base text-navy">定義</h3>
          <p class="text-sm leading-6"><MathText :text="node.definition" /></p>
          <p v-if="node.definitionNote" class="text-[11px] leading-4 text-ink/50">此處為講義內容的簡要改寫，原文可在下方展開。</p>
        </section>

        <EquationList v-if="node.equations.length" :equations="node.equations" :verified="node.equationsVerified" />

        <details v-if="node.slideExcerpt" class="rounded-lg border border-line bg-paper px-3 py-2">
          <summary class="cursor-pointer text-sm font-semibold">投影片原文</summary>
          <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink/80">{{ node.slideExcerpt }}</p>
        </details>

        <section v-if="node.source" class="space-y-1">
          <h3 class="font-serif text-base text-navy">來源講義</h3>
          <p class="text-sm leading-6">{{ node.source.file }}</p>
          <p v-if="node.source.slideTitle" class="text-sm text-ink/75">{{ node.source.slideTitle }}</p>
          <p v-if="node.source.page != null" class="text-sm">第 {{ node.source.page }} 頁</p>
          <a
            v-if="node.source.link"
            :href="node.source.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block text-sm text-navy underline"
          >
            在 Google Drive 開啟
          </a>
        </section>

        <section v-if="membership" class="space-y-1">
          <h3 class="font-serif text-base text-navy">所屬單元</h3>
          <button type="button" class="text-sm font-semibold text-navy underline" @click="explorer.selectNode(membership.target)">
            <MathText :text="labelOf(membership.target)" />
          </button>
          <EvidenceBlock v-if="membership.evidence" :evidence="membership.evidence" />
        </section>

        <section class="space-y-2">
          <h3 class="font-serif text-base text-navy">連出 · {{ outgoing.length }}</h3>
          <p v-if="!outgoing.length" class="text-sm text-ink/55">尚無連出的概念。</p>
          <article v-for="item in outgoing" :key="item.id" class="rounded-lg border border-line px-2.5 py-2">
            <div class="flex flex-wrap items-center gap-1.5">
              <button type="button" class="chip bg-navy/10 text-navy" @click="explorer.selectEdge(item.id)">{{ relationLabel(item.relation) }}</button>
              <span class="chip bg-paper ring-1 ring-line">{{ basisLabel(item.basis) }}</span>
              <span v-if="item.crossUnit" class="chip bg-paper ring-1 ring-line">跨單元</span>
            </div>
            <p class="mt-1 text-sm leading-5">
              <span class="text-ink/50">這個概念 → </span>
              <button type="button" class="font-semibold text-navy underline" @click="explorer.selectNode(item.target)"><MathText :text="labelOf(item.target)" /></button>
            </p>
            <p v-if="item.note" class="mt-1 text-xs leading-5 text-ink/70"><MathText :text="item.note" /></p>
            <EvidenceBlock v-if="item.evidence" :evidence="item.evidence" />
          </article>
        </section>

        <section class="space-y-2">
          <h3 class="font-serif text-base text-navy">連入 · {{ incoming.length }}</h3>
          <p v-if="!incoming.length" class="text-sm text-ink/55">尚無連入的概念。</p>
          <article v-for="item in incoming" :key="item.id" class="rounded-lg border border-line px-2.5 py-2">
            <div class="flex flex-wrap items-center gap-1.5">
              <button type="button" class="chip bg-navy/10 text-navy" @click="explorer.selectEdge(item.id)">{{ relationLabel(item.relation) }}</button>
              <span class="chip bg-paper ring-1 ring-line">{{ basisLabel(item.basis) }}</span>
              <span v-if="item.crossUnit" class="chip bg-paper ring-1 ring-line">跨單元</span>
            </div>
            <p class="mt-1 text-sm leading-5">
              <button type="button" class="font-semibold text-navy underline" @click="explorer.selectNode(item.source)"><MathText :text="labelOf(item.source)" /></button>
              <span class="text-ink/50"> → 這個概念</span>
            </p>
            <p v-if="item.note" class="mt-1 text-xs leading-5 text-ink/70"><MathText :text="item.note" /></p>
            <EvidenceBlock v-if="item.evidence" :evidence="item.evidence" />
          </article>
        </section>
      </div>

      <div v-else class="grid min-h-full place-items-center text-center">
        <div class="max-w-xs space-y-2">
          <p class="font-serif text-xl text-navy">選擇一個概念</p>
          <p class="text-sm leading-6 text-ink/65">點圖上的節點或連結，這裡會顯示定義、公式、講義出處，以及相鄰概念。</p>
        </div>
      </div>
    </div>
  </aside>
</template>
