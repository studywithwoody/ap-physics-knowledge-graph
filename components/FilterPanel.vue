<script setup lang="ts">
import { typeLabel, relationLabel, basisLabel, formatTimestamp } from '../lib/labels'
import { unitColors } from '../lib/palette'

defineEmits<{ close: [] }>()

const explorer = useExplorer()
const searchBox = ref<HTMLInputElement | null>(null)

const counts = computed(() => explorer.course.value.meta.counts)
const totalByUnit = computed(() => {
  const map = new Map<string, number>()
  for (const node of explorer.course.value.nodes) {
    map.set(node.unit, (map.get(node.unit) ?? 0) + 1)
  }
  return map
})
const visibleByUnit = computed(() => {
  const map = new Map<string, number>()
  for (const node of explorer.visible.value.nodes) {
    map.set(node.unit, (map.get(node.unit) ?? 0) + 1)
  }
  return map
})
const typeCounts = computed(() => {
  const map = new Map<string, number>()
  for (const node of explorer.course.value.nodes) {
    map.set(node.type, (map.get(node.type) ?? 0) + 1)
  }
  return map
})
const maxUnitCount = computed(() => Math.max(1, ...totalByUnit.value.values()))

function onSearchKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    const first = explorer.searchHits.value[0]
    if (first) explorer.selectNode(first.id)
  }
  if (event.key === 'Escape' && explorer.searchText.value) {
    explorer.searchText.value = ''
    event.stopPropagation()
  }
}
</script>

<template>
  <aside class="flex h-full min-h-0 flex-col bg-panel">
    <div class="flex items-center justify-between border-b border-line px-3 py-2 xl:hidden">
      <h2 class="font-semibold">篩選與搜尋</h2>
      <button type="button" class="toolbar-btn" @click="$emit('close')">關閉</button>
    </div>
    <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-3">
      <section>
        <label class="field-label" for="concept-search">搜尋</label>
        <div class="mt-1.5 flex gap-2">
          <input
            id="concept-search"
            ref="searchBox"
            v-model="explorer.searchText.value"
            type="search"
            placeholder="搜尋概念、公式或定義"
            class="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none ring-navy/30 focus:ring-2"
            @keydown="onSearchKeydown"
          >
          <button v-if="explorer.searchText.value" type="button" class="toolbar-btn shrink-0" @click="explorer.searchText.value = ''">
            清除
          </button>
        </div>
        <p v-if="explorer.searchText.value.trim().length >= 2" class="mt-1 text-[11px] text-ink/55">
          符合 {{ explorer.matchCount.value }} 個概念，圖上會一併保留相鄰概念。
        </p>
        <ul v-if="explorer.searchHits.value.length" class="mt-2 overflow-hidden rounded-lg border border-line">
          <li v-for="hit in explorer.searchHits.value" :key="hit.id" class="border-b border-line last:border-b-0">
            <button
              type="button"
              class="flex w-full flex-col items-start px-2.5 py-1.5 text-left hover:bg-paper"
              @click="explorer.selectNode(hit.id)"
            >
              <span class="text-sm font-semibold leading-5"><MathText :text="hit.label" /></span>
              <span class="text-[11px] text-ink/55">{{ hit.meta }}</span>
            </button>
          </li>
        </ul>
        <p v-else-if="explorer.searchText.value.trim().length >= 2" class="mt-2 text-sm text-ink/60">
          找不到符合的概念。
        </p>
      </section>

      <section>
        <div class="flex items-center justify-between">
          <h2 class="field-label">單元</h2>
          <div class="flex gap-2 text-[11px]">
            <button type="button" class="underline" @click="explorer.setAllUnits(true)">全選</button>
            <button type="button" class="underline" @click="explorer.setAllUnits(false)">清除</button>
          </div>
        </div>
        <ul class="mt-2 space-y-1.5">
          <li v-for="unit in explorer.course.value.units" :key="unit.id">
            <label class="flex cursor-pointer items-start gap-2 text-sm leading-5">
              <input
                type="checkbox"
                class="mt-1"
                :checked="explorer.unitSet.value.includes(unit.unit)"
                @change="explorer.toggleValue(explorer.unitSet, unit.unit)"
              >
              <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" :style="{ background: unitColors(unit.unit).accent }" />
              <span class="min-w-0 flex-1">
                <span class="block">{{ unit.label }}</span>
              </span>
              <span class="shrink-0 tabular-nums text-ink/50">
                <template v-if="(visibleByUnit.get(unit.unit) ?? 0) !== (totalByUnit.get(unit.unit) ?? 0)">
                  {{ visibleByUnit.get(unit.unit) ?? 0 }}/
                </template>
                {{ totalByUnit.get(unit.unit) ?? 0 }}
              </span>
            </label>
            <span class="ml-7 mt-1 block h-1 overflow-hidden rounded bg-line">
              <span
                class="block h-full"
                :style="{
                  width: `${((totalByUnit.get(unit.unit) ?? 0) / maxUnitCount) * 100}%`,
                  background: unitColors(unit.unit).accent,
                }"
              />
            </span>
          </li>
        </ul>
      </section>

      <section>
        <div class="flex items-center justify-between">
          <h2 class="field-label">節點類型</h2>
          <div class="flex gap-2 text-[11px]">
            <button type="button" class="underline" @click="explorer.setAllTypes(true)">全選</button>
            <button type="button" class="underline" @click="explorer.setAllTypes(false)">清除</button>
          </div>
        </div>
        <ul class="mt-2 space-y-1">
          <li v-for="type in explorer.typeOptions.value" :key="type">
            <label class="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                :checked="explorer.typeSet.value.includes(type)"
                @change="explorer.toggleValue(explorer.typeSet, type)"
              >
              <span class="flex-1">{{ typeLabel(type) }} <span class="text-ink/40">{{ type }}</span></span>
              <span class="tabular-nums text-ink/50">{{ typeCounts.get(type) ?? 0 }}</span>
            </label>
          </li>
        </ul>
      </section>

      <section>
        <div class="flex items-center justify-between">
          <h2 class="field-label">關係類型</h2>
          <div class="flex gap-2 text-[11px]">
            <button type="button" class="underline" @click="explorer.setAllRelations(true)">全選</button>
            <button type="button" class="underline" @click="explorer.setAllRelations(false)">清除</button>
          </div>
        </div>
        <ul class="mt-2 space-y-1">
          <li v-for="relation in explorer.relationOptions.value" :key="relation">
            <label class="flex cursor-pointer items-center gap-2 text-sm" :title="explorer.course.value.meta.relations[relation]">
              <input
                type="checkbox"
                :checked="explorer.relationSet.value.includes(relation)"
                @change="explorer.toggleValue(explorer.relationSet, relation)"
              >
              <span class="flex-1">{{ relationLabel(relation) }} <span class="text-ink/40">{{ relation }}</span></span>
              <span class="tabular-nums text-ink/50">{{ counts?.edges_by_relation?.[relation] ?? '' }}</span>
            </label>
          </li>
        </ul>
      </section>

      <section class="space-y-2">
        <h2 class="field-label">顯示設定</h2>
        <label class="flex cursor-pointer items-start gap-2 text-sm">
          <input v-model="explorer.hideInferred.value" type="checkbox" class="mt-1">
          <span>
            <span class="font-semibold">隱藏推論連結</span>
            <span class="mt-0.5 block text-xs leading-5 text-ink/60">標準學科依賴，講義沒有明文寫出。</span>
          </span>
        </label>
        <label class="flex cursor-pointer items-start gap-2 text-sm">
          <input v-model="explorer.hideWeak.value" type="checkbox" class="mt-1">
          <span>
            <span class="font-semibold">隱藏弱證據連結</span>
            <span class="mt-0.5 block text-xs leading-5 text-ink/60">只隱藏鄰近投影片提及名稱的連結，多半反映講義順序。強證據與推論不受影響。</span>
          </span>
        </label>
        <label class="flex cursor-pointer items-start gap-2 text-sm">
          <input v-model="explorer.groupByUnit.value" type="checkbox" class="mt-1">
          <span>
            <span class="font-semibold">以區塊收納單元</span>
            <span class="mt-0.5 block text-xs leading-5 text-ink/60">單元外框代表 part_of。關閉後，單元改成節點，並畫出歸屬連線。</span>
          </span>
        </label>
      </section>

      <section class="space-y-2 border-t border-line pt-3">
        <h2 class="field-label">統計</h2>
        <dl class="grid grid-cols-3 gap-2 text-center">
          <div class="rounded-lg bg-paper px-2 py-2">
            <dt class="text-[11px] text-ink/55">概念</dt>
            <dd class="font-serif text-xl">{{ counts?.nodes ?? explorer.course.value.nodes.length }}</dd>
          </div>
          <div class="rounded-lg bg-paper px-2 py-2">
            <dt class="text-[11px] text-ink/55">單元</dt>
            <dd class="font-serif text-xl">{{ counts?.unit_nodes ?? explorer.course.value.units.length }}</dd>
          </div>
          <div class="rounded-lg bg-paper px-2 py-2">
            <dt class="text-[11px] text-ink/55">連結</dt>
            <dd class="font-serif text-xl">{{ counts?.edges_total ?? explorer.course.value.edges.length }}</dd>
          </div>
        </dl>
        <p class="text-xs leading-5 text-ink/70">
          目前畫面 {{ explorer.visible.value.nodes.length }} 個概念、{{ explorer.visible.value.edges.length }} 條連結。
          <template v-if="explorer.groupByUnit.value">單元歸屬以區塊表示。</template>
        </p>
        <ul v-if="counts?.edges_by_basis_excl_part_of" class="space-y-0.5 text-xs text-ink/70">
          <li v-for="(count, key) in counts.edges_by_basis_excl_part_of" :key="key">
            {{ basisLabel(String(key)) }} {{ count }}（不含歸屬）
          </li>
          <li v-if="counts.grounded_evidence_kind">
            強證據 {{ counts.grounded_evidence_kind.targeted_phrase ?? 0 }} · 弱證據 {{ counts.grounded_evidence_kind.label_mention_nearby ?? 0 }}
          </li>
          <li v-if="counts.cross_unit_edges != null">跨單元連結 {{ counts.cross_unit_edges }}</li>
        </ul>
        <details class="text-xs leading-5 text-ink/70">
          <summary class="cursor-pointer font-semibold text-ink">資料說明</summary>
          <div class="mt-2 space-y-2">
            <p v-for="(text, key) in explorer.course.value.meta.relations" :key="key">
              <span class="font-semibold">{{ relationLabel(String(key)) }}</span>：{{ text }}
            </p>
            <p v-for="(text, key) in explorer.course.value.meta.basis" :key="`basis-${key}`">
              <span class="font-semibold">{{ basisLabel(String(key)) }}</span>：{{ text }}
            </p>
            <p v-if="explorer.course.value.meta.notes">{{ explorer.course.value.meta.notes }}</p>
            <p v-if="explorer.course.value.meta.status">{{ explorer.course.value.meta.status }}</p>
            <p v-if="explorer.course.value.meta.generatedAt">資料時間 {{ formatTimestamp(explorer.course.value.meta.generatedAt) }}</p>
            <p v-if="explorer.course.value.warnings.length" class="text-vermilion">
              已略過 {{ explorer.course.value.warnings.length }} 筆無法對上的資料。
            </p>
          </div>
        </details>
      </section>
    </div>
  </aside>
</template>

