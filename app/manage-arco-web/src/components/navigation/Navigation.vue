<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouterItem } from "@/router";

const props = defineProps<{
  routes: RouterItem[];
  title?: string;
}>();

const router = useRouter();

const handleMenuClick = (path: string) => {
  router.push(path);
};
</script>

<template>
  <div class="nav-container">
    <div class="nav-header">🌟 Red BlinBlin 后台管理</div>
    <a-menu breakpoint="xl" :accordion="true" style="flex: 1; overflow-y: auto;">
      <template v-for="(route, index) in routes" :key="index">
        <a-sub-menu v-if="route.children && route.children.length > 0" :key="`sub-${index}`">
          <template #icon>
            <component :is="route.icon" v-if="route.icon" />
          </template>
          <template #title>{{ route.name }}</template>
          <template v-for="(child, childIndex) in route.children" :key="`${index}-${childIndex}`">
            <a-menu-item v-if="child.isMenu" :key="`${index}-${childIndex}`"
              @click="child.path && handleMenuClick(child.path)">
              {{ child.name }}
            </a-menu-item>
          </template>
        </a-sub-menu>

        <a-menu-item v-else-if="route.isMenu && route.path" :key="`item-${index}`" @click="handleMenuClick(route.path)">
          <template #icon>
            <component :is="route.icon" v-if="route.icon" />
          </template>
          {{ route.name }}
        </a-menu-item>
      </template>
    </a-menu>
    <div class="nav-user">
      <div class="nav-user-left">
        <a-avatar :size="32" class="nav-user-avatar">A</a-avatar>
        <span class="nav-user-name">luohao</span>
      </div>
      <a-dropdown>
        <a-button type="text">
          <template #icon>
            <icon-more />
          </template>
        </a-button>
        <template #content>
          <a-doption>
            <template #icon>
              <icon-export />
            </template>
            退出登录
          </a-doption>
          <a-doption>
            <template #icon>
              <icon-settings />
            </template>
            设置
          </a-doption>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<style scoped>
.nav-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.nav-header {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 700;
  text-align: center;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-user {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  font-size: 14px;
}

.nav-user-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
