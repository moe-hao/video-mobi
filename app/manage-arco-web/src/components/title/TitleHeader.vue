<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="title-container">
    <div class="title-text">{{ title }}</div>
  </div>
</template>

<style scoped>
.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.title-text {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
}
</style>
