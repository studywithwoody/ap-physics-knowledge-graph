<script setup lang="ts">
import type { Evidence } from '../lib/schema'
import { evidenceLabel } from '../lib/labels'
import { WEAK_EVIDENCE_KIND } from '../lib/schema'

defineProps<{ evidence: Evidence }>()
</script>

<template>
  <div class="mt-1.5 rounded-md bg-paper px-2.5 py-2 text-xs leading-5">
    <span
      class="chip mb-1"
      :class="evidence.kind === WEAK_EVIDENCE_KIND ? 'bg-amber-200 text-amber-950' : 'bg-sky-100 text-sky-950'"
    >
      {{ evidenceLabel(evidence.kind) }}
    </span>
    <blockquote v-if="evidence.quote" class="border-l-2 border-vermilion/70 pl-2 text-ink">
      「{{ evidence.quote }}」
    </blockquote>
    <a
      v-if="evidence.link"
      :href="evidence.link"
      target="_blank"
      rel="noopener noreferrer"
      class="mt-1 inline-block text-navy underline decoration-navy/30 underline-offset-2"
    >
      {{ evidence.file || '開啟講義' }}<template v-if="evidence.page != null"> · 第 {{ evidence.page }} 頁</template>
    </a>
    <p v-else-if="evidence.file" class="mt-1 text-ink/70">
      {{ evidence.file }}<template v-if="evidence.page != null"> · 第 {{ evidence.page }} 頁</template>
    </p>
  </div>
</template>
