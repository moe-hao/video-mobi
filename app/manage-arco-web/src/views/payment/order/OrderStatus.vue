<script setup lang="ts">
const props = defineProps<{status: number, statusName: string}>();
</script>

<template>
  <a-badge v-if="props.status === 0" color="#86909C" :text="props.statusName" />
  <a-badge v-else-if="props.status === 1" color="#FF9900" :text="props.statusName" />
  <a-badge v-else-if="props.status === 2" color="#168CFF" :text="props.statusName" />
  <a-badge v-else-if="props.status === 3" color="#00B42A" :text="props.statusName" />
  <a-badge v-else-if="props.status === 4" color="#F53F3F" :text="props.statusName" />
  <a-badge v-else-if="props.status === 5" color="#FFFFFF" :text="props.statusName" />
  <a-badge v-else color="#86909C" :text="props.statusName" />
</template>

<style scoped>
:deep(.arco-badge-status-text) {
  font-size: 14px;
}
</style>
