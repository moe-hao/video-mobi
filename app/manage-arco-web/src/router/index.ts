import {
  IconCheckCircle,
  IconDesktop,
  IconFolderDelete,
  IconHome,
  IconPlayCircle,
  IconUser,
} from "@arco-design/web-vue/es/icon";
import type { Component } from "vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

export interface RouterItem {
  name: string;
  icon?: Component;
  path?: string;
  element?: () => Promise<Component>;
  isMenu: boolean;
  children?: RouterItem[];
}

export const routers: RouterItem[] = [
  {
    name: "仪表盘",
    icon: IconHome,
    path: "/dashboard/view",
    isMenu: true,
  },
  {
    name: "剧集管理",
    icon: IconPlayCircle,
    isMenu: true,
    children: [
      {
        name: "剧集列表",
        path: "/episode/list",
        isMenu: true,
      },
      {
        name: "首页推荐",
        path: "/episode/feature",
        isMenu: true,
      },
      {
        name: "剧集详情",
        path: "/episode/video",
        isMenu: false,
      },
    ],
  },
  {
    name: "付费管理",
    icon: IconCheckCircle,
    isMenu: true,
    children: [
      {
        name: "订单管理",
        path: "/order/list",
        isMenu: true,
        element: () => import("@/views/payment/order/OrderList.vue"),
      },
      {
        name: "订阅管理",
        path: "/subscription/list",
        isMenu: true,
      },
      {
        name: "争议证明",
        path: "/payment/dispute",
        isMenu: true,
      },
    ],
  },
  {
    name: "产品管理",
    icon: IconFolderDelete,
    isMenu: true,
    children: [
      {
        name: "产品列表",
        path: "/product/list",
        isMenu: true,
      },
      {
        name: "商品管理",
        path: "/product/sku",
        isMenu: true,
      },
      {
        name: "挽回配置",
        path: "/product/recover",
        isMenu: true,
      },
      {
        name: "支付选项",
        path: "/product/payment_option",
        isMenu: true,
      },
    ],
  },
  {
    name: "运营报表",
    icon: IconDesktop,
    isMenu: true,
    children: [
      {
        name: "每日详情",
        path: "/report/daily",
        isMenu: true,
      },
      {
        name: "续订统计",
        path: "/report/subscription_renewal",
        isMenu: true,
      },
    ],
  },
  {
    name: "用户管理",
    icon: IconUser,
    isMenu: true,
    children: [
      {
        name: "用户列表",
        path: "/user/list",
        isMenu: true,
      },
      {
        name: "新增用户",
        path: "/user/new_list",
        isMenu: true,
      },
    ],
  },
  {
    name: "设置",
    path: "/setting/info",
    isMenu: false,
  },
  {
    name: "用户登录",
    path: "/user/login",
    isMenu: false,
    element: () => import("@/views/user/login/Login.vue"),
  },
];

// 转换为 vue-router 路由格式
function transformRoutes(routes: RouterItem[]): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = [];

  routes.forEach((route) => {
    if (route.path) {
      result.push({
        path: route.path,
        name: route.name,
        component: route.element || (() => Promise.resolve({ render: () => null })),
      });
    }

    if (route.children) {
      result.push(...transformRoutes(route.children));
    }
  });

  return result;
}

export const routeRecords = transformRoutes(routers);
export const router = createRouter({
  history: createWebHistory(),
  routes: routeRecords,
});
