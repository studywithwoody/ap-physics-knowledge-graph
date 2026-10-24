<script setup lang="ts">
import { renderMarkdown } from '../lib/markdown'

const { course, gapsMarkdown } = useCatalog()

const html = computed(() => gapsMarkdown.value ? renderMarkdown(gapsMarkdown.value) : '')

useHead({
  title: computed(() => course.value ? `缺口分析 · ${course.value.title}` : '缺口分析'),
})
</script>

<template>
  <div class="app-shell flex flex-col bg-paper">
    <AppHeader />
    <main class="min-h-0 flex-1 overflow-y-auto">
      <article class="mx-auto max-w-4xl px-5 py-8">
        <p class="mb-6 rounded-xl border border-line bg-panel px-4 py-3 text-sm leading-6">
          以下整理講義順序與先備關係的落差，方便備課時覆核。概念名稱沿用英文。
          <template v-if="course">目前課程：{{ course.title }}。</template>
        </p>
        <div v-if="html" class="markdown" v-html="html" />
        <p v-else class="text-sm leading-6 text-ink/70">
          這門課還沒有缺口分析。把 Markdown 放到
          <code class="rounded bg-[#f3ecdf] px-1">data/courses/{{ course?.id }}.gaps.md</code>
          後重新建置即可。
        </p>
      </article>
    </main>
  </div>
</template>
