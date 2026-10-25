<script setup lang="ts">
const explorer = provideExplorer()
const filtersOpen = ref(false)
const detailOpen = ref(false)

function openFilters() {
  detailOpen.value = false
  filtersOpen.value = true
}

function openDetail() {
  filtersOpen.value = false
  detailOpen.value = true
}

watch([explorer.selectedNodeId, explorer.selectedEdgeId, explorer.focusKey], () => {
  if (!import.meta.client) return
  if (!explorer.selectedNodeId.value && !explorer.selectedEdgeId.value) return
  if (window.innerWidth < 1280) openDetail()
})

onMounted(() => {
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
})

function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    filtersOpen.value = false
    detailOpen.value = false
    explorer.clearSelection()
  }
}
</script>

<template>
  <div class="app-shell flex flex-col bg-paper">
    <AppHeader />
    <div class="relative flex min-h-0 flex-1">
      <button
        v-if="filtersOpen || detailOpen"
        type="button"
        class="absolute inset-0 z-20 bg-ink/40 xl:hidden"
        aria-label="關閉側欄"
        @click="filtersOpen = false; detailOpen = false"
      />

      <div
        class="absolute inset-y-0 left-0 z-30 h-full w-[min(92vw,300px)] shadow-2xl xl:static xl:z-auto xl:w-[280px] xl:shrink-0 xl:shadow-none"
        :class="filtersOpen ? 'block' : 'hidden xl:block'"
      >
        <FilterPanel class="h-full border-r border-line" @close="filtersOpen = false" />
      </div>

      <main class="relative min-w-0 flex-1">
        <ClientOnly>
          <GraphCanvas class="absolute inset-0" />
          <template #fallback>
            <div class="graph-stage grid h-full place-items-center text-sm text-ink/70">正在準備圖譜…</div>
          </template>
        </ClientOnly>

        <div class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-2 p-3">
          <button type="button" class="toolbar-btn pointer-events-auto xl:hidden" @click="openFilters">
            篩選
          </button>
          <div class="pointer-events-auto ml-auto flex max-w-full flex-wrap justify-end gap-2">
            <div class="flex rounded-full border border-line bg-panel/95 p-0.5 shadow-sm" role="group" aria-label="圖形配置">
              <button type="button" class="rounded-full px-3 py-1.5 text-sm font-semibold" :class="explorer.layout.value === 'dagre' ? 'bg-navy text-paper' : ''" :aria-pressed="explorer.layout.value === 'dagre'" @click="explorer.layout.value = 'dagre'">
                先備階層
              </button>
              <button type="button" class="rounded-full px-3 py-1.5 text-sm font-semibold" :class="explorer.layout.value === 'fcose' ? 'bg-navy text-paper' : ''" :aria-pressed="explorer.layout.value === 'fcose'" @click="explorer.layout.value = 'fcose'">
                力導向
              </button>
            </div>
            <button type="button" class="toolbar-btn" @click="explorer.graphControls.relayout()">重排</button>
            <button type="button" class="toolbar-btn" @click="explorer.graphControls.fit()">全圖</button>
            <button type="button" class="toolbar-btn" @click="explorer.graphControls.zoomBy(1.2)">放大</button>
            <button type="button" class="toolbar-btn" @click="explorer.graphControls.zoomBy(0.8)">縮小</button>
            <button type="button" class="toolbar-btn xl:hidden" @click="openDetail">
              詳情
              <span v-if="explorer.selectedNodeId.value || explorer.selectedEdgeId.value" class="ml-1 inline-block h-2 w-2 rounded-full bg-vermilion" />
            </button>
          </div>
        </div>

        <GraphLegend class="absolute bottom-3 left-3 z-10 max-h-[70%] overflow-hidden" />
      </main>

      <div
        class="absolute inset-y-0 right-0 z-30 h-full w-[min(92vw,390px)] shadow-2xl xl:static xl:z-auto xl:w-[360px] xl:shrink-0 xl:shadow-none"
        :class="detailOpen ? 'block' : 'hidden xl:block'"
      >
        <DetailPanel class="h-full border-l border-line" @close="detailOpen = false" />
      </div>
    </div>
  </div>
</template>
