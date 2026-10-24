<script setup lang="ts">
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps<{
  equations: string[]
  verified: boolean | null
}>()

const rows = computed(() => props.equations.map((tex) => {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: true,
    strict: 'ignore',
    trust: false,
  })
  return { tex, html, failed: html.includes('katex-error') }
}))
</script>

<template>
  <section class="space-y-2">
    <div class="flex flex-wrap items-center gap-2">
      <h3 class="font-serif text-base text-navy">公式</h3>
      <span v-if="verified === false" class="chip bg-vermilion text-white">待確認</span>
      <span v-else-if="verified === true" class="chip bg-emerald-800/10 text-emerald-950" title="已在投影片文字中找到此公式">已核對</span>
    </div>
    <p v-if="verified === false" class="text-xs leading-5 text-vermilion">
      公式未能在投影片擷取文字中核對，請對照原始講義。
    </p>
    <div
      v-for="(row, index) in rows"
      :key="index"
      class="equation rounded-lg border bg-paper px-3 py-2"
      :class="verified === false ? 'border-vermilion/50' : 'border-line'"
    >
      <div v-html="row.html" />
      <p v-if="row.failed" class="mt-1 break-all font-mono text-xs text-vermilion">{{ row.tex }}</p>
      <details class="mt-1">
        <summary class="cursor-pointer text-[11px] text-ink/50">LaTeX</summary>
        <p class="mt-1 break-all font-mono text-[11px] text-ink/70">{{ row.tex }}</p>
      </details>
    </div>
  </section>
</template>
