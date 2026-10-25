<script setup lang="ts">
const { catalog, courseId, course } = useCatalog()
</script>

<template>
  <header class="z-40 flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-vermilion bg-navy px-4 py-2.5 text-paper">
    <NuxtLink to="/" class="min-w-0">
      <span class="block font-serif text-lg leading-tight tracking-tight">講義知識圖譜</span>
      <span v-if="course" class="block truncate text-xs text-paper/75">
        {{ course.title }}<template v-if="course.meta.author"> · {{ course.meta.author }}</template>
      </span>
    </NuxtLink>

    <nav class="flex rounded-full bg-white/10 p-0.5 text-sm" aria-label="頁面">
      <NuxtLink
        to="/"
        class="rounded-full px-3 py-1 text-paper/90"
        exact-active-class="!bg-paper !text-navy"
      >
        圖譜
      </NuxtLink>
      <NuxtLink
        to="/gaps"
        class="rounded-full px-3 py-1 text-paper/90"
        exact-active-class="!bg-paper !text-navy"
      >
        缺口分析
      </NuxtLink>
    </nav>

    <div class="ml-auto flex flex-wrap items-center gap-3 text-sm">
      <label class="flex items-center gap-2">
        <span class="text-paper/75">課程</span>
        <select v-model="courseId" class="rounded-md border border-white/30 bg-paper px-2 py-1 text-ink">
          <option v-for="item in catalog" :key="item.id" :value="item.id">
            {{ item.title }}
          </option>
        </select>
      </label>
      <a
        v-if="course?.meta.sourceFolder"
        :href="course.meta.sourceFolder"
        target="_blank"
        rel="noopener noreferrer"
        class="text-paper underline decoration-white/30 underline-offset-2"
      >
        講義資料夾
      </a>
    </div>
  </header>
</template>
