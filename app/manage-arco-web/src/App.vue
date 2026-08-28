<script setup lang="ts">
import Navigation from "./components/navigation/Navigation.vue";
import { routers } from "./router";
</script>

<template>
  <router-view v-if="$route.path === '/user/login'" />
  <a-layout v-else style="height: 100vh">
    <a-layout-sider style="width: 240px">
      <navigation :routes="routers" />
    </a-layout-sider>
    <a-layout-content style="padding: 24px;">
      <suspense>
        <router-view />
      </suspense>
    </a-layout-content>
  </a-layout>
</template>
