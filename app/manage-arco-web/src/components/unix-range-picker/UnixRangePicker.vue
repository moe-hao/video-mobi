<script setup lang="ts">
const start = defineModel<string>("start");
const end = defineModel<string>("end");

const handleChange = (val: string[]) => {
  const [startTime, endTime] = val ?? [];
  start.value = startTime ? String(Math.floor(new Date(startTime).setHours(0, 0, 0, 0) / 1000)) : "";
  end.value = endTime ? String(Math.floor(new Date(endTime).setHours(23, 59, 59, 999) / 1000)) : "";
};
</script>

<template>
  <a-range-picker @change="handleChange" />
</template>
