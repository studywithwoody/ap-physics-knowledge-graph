<script setup lang="ts">
import { RELATION_LABEL } from '../lib/labels'
import { unitColors } from '../lib/palette'

const explorer = useExplorer()
const open = ref(true)

const shapes = [
  { label: '概念', shape: 'h-3.5 w-5 rounded' },
  { label: '公式', shape: 'h-3.5 w-3.5 rotate-45' },
  { label: '定律', shape: 'h-3.5 w-4 [clip-path:polygon(30%_0,70%_0,100%_30%,100%_70%,70%_100%,30%_100%,0_70%,0_30%)]' },
  { label: '技能', shape: 'h-3.5 w-5 rounded-full' },
]

const relations = computed(() => {
  const defined = Object.keys(explorer.course.value.meta.relations)
  const keys = defined.length ? defined : Object.keys(RELATION_LABEL)
  return keys.map((key) => ({
    key,
    label: RELATION_LABEL[key] ?? key,
    description: explorer.course.value.meta.relations[key] ?? '',
  }))
})

function relationColor(relation: string) {
  if (relation === 'derived_from') return '#1d4ed8'
  if (relation === 'applies_to') return '#0f766e'
  if (relation === 'contrasts_with') return '#c2410c'
  if (relation === 'part_of') return '#a8a29e'
  return '#334155'
}

onMounted(() => {
  if (window.innerWidth < 1280) open.value = false
})
</script>

<template>
  <aside class="max-w-[min(100%-1.5rem,280px)] rounded-xl border border-line bg-panel/95 text-xs shadow-sm backdrop-blur-sm">
    <button type="button" class="flex w-full items-center justify-between px-3 py-2 font-semibold" :aria-expanded="open" @click="open = !open">
      圖例
      <span class="text-ink/50">{{ open ? '收合' : '展開' }}</span>
    </button>
    <div v-if="open" class="max-h-[46vh] space-y-3 overflow-y-auto border-t border-line px-3 py-3">
      <div>
        <p class="field-label mb-1">形狀 · 類型</p>
        <ul class="grid grid-cols-2 gap-1.5">
          <li v-for="item in shapes" :key="item.label" class="flex items-center gap-2">
            <span class="inline-block border-2 border-navy bg-[#d7e4f2]" :class="item.shape" />
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div>
        <p class="field-label mb-1">顏色 · 單元</p>
        <ul class="grid grid-cols-1 gap-1">
          <li v-for="unit in explorer.course.value.units" :key="unit.id" class="flex items-center gap-1.5">
            <span class="h-2.5 w-2.5 shrink-0 rounded-sm" :style="{ background: unitColors(unit.unit).accent }" />
            <span class="truncate">{{ unit.label }}</span>
          </li>
        </ul>
      </div>
      <div>
        <p class="field-label mb-1">線條 · 關係</p>
        <ul class="space-y-1">
          <li v-for="relation in relations" :key="relation.key" class="flex items-center gap-2" :title="relation.description">
            <svg width="36" height="10" aria-hidden="true">
              <line x1="1" y1="5" x2="30" y2="5" :stroke="relationColor(relation.key)" stroke-width="2" />
              <polygon v-if="relation.key !== 'contrasts_with'" points="30,2 36,5 30,8" :fill="relationColor(relation.key)" />
            </svg>
            <span>{{ relation.label }}</span>
          </li>
        </ul>
      </div>
      <div>
        <p class="field-label mb-1">證據</p>
        <ul class="space-y-1">
          <li class="flex items-center gap-2">
            <svg width="36" height="8" aria-hidden="true"><line x1="0" y1="4" x2="36" y2="4" stroke="#334155" stroke-width="2" /></svg>
            實線 · 強證據
          </li>
          <li class="flex items-center gap-2">
            <svg width="36" height="8" aria-hidden="true"><line x1="0" y1="4" x2="36" y2="4" stroke="#334155" stroke-width="2" stroke-dasharray="1.5 3" /></svg>
            點線 · 弱證據（鄰近提及）
          </li>
          <li class="flex items-center gap-2">
            <svg width="36" height="8" aria-hidden="true"><line x1="0" y1="4" x2="36" y2="4" stroke="#334155" stroke-width="2" stroke-dasharray="6 4" /></svg>
            虛線 · 推論
          </li>
        </ul>
      </div>
      <p class="text-[11px] leading-4 text-ink/55">縮小總覽時會隱藏節點小字，放大後即可看到名稱。</p>
    </div>
  </aside>
</template>
