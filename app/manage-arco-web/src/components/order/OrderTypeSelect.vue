<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <a-select v-model="model" allow-clear placeholder="选择订单类型">
    <a-option value="subscription">订阅</a-option>
    <a-option value="coin">金币</a-option>
  </a-select>
</template>
