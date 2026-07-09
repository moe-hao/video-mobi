import { Archive, CirclePlay, Display, FileCheck, House, Person } from '@gravity-ui/icons';
import loadable from '@loadable/component';
import { Route, Routes } from 'react-router';
import type { ReactElement, ComponentType } from 'react';

export interface RouterItem {
  name: string;
  icon?: ReactElement;
  path?: string;
  element?: ComponentType;
  isMenu?: boolean;
  children?: RouterItem[];
}

function renderRoutes(items: RouterItem[]): ReactElement[] {
  return items.flatMap(item => {
    const result: ReactElement[] = [];

    if (item.path && item.element) {
      result.push(
        <Route key={item.path} path={item.path} element={<item.element />} />
      );
    }

    if (item.children) {
      result.push(...renderRoutes(item.children));
    }

    return result;
  });
}

export const routers: RouterItem[] = [
  {
    name: '仪表盘',
    icon: <House />,
    path: '/dashboard/view',
    element: loadable(() => import('../pages/dashboard')),
    isMenu: true,
  },
  {
    name: '剧集管理',
    icon: <CirclePlay />,
    isMenu: true,
    children: [
      {
        name: '剧集列表',
        path: '/episode/list',
        element: loadable(() => import('../pages/episode/list')),
        isMenu: true,
      },
      {
        name: '首页推荐',
        path: '/episode/feature',
        element: loadable(() => import('../pages/episode/feature')),
        isMenu: true,
      },
      {
        name: '剧集详情',
        path: '/episode/video',
        element: loadable(() => import('../pages/episode/video')),
        isMenu: false,
      },
    ]
  },
  {
    name: '付费管理',
    icon: <FileCheck />,
    isMenu: true,
    children: [
      {
        name: '订单管理',
        path: '/order/list',
        element: loadable(() => import('../pages/payment/order')),
        isMenu: true,
      },
       {
        name: '订阅管理',
        path: '/subscription/list',
        element: loadable(() => import('../pages/payment/subscription')),
        isMenu: true,
      },
    ]
  },
  {
    name: '产品管理',
    icon: <Archive />,
    isMenu: true,
    children: [
      {
        name: '产品列表',
        path: '/product/list',
        element: loadable(() => import('../pages/product/list')),
        isMenu: true,
      },
      {
        name: '商品管理',
        path: '/product/sku',
        element: loadable(() => import('../pages/product/sku')),
        isMenu: true,
      }
    ]
  },
  {
    name: '运营报表',
    icon: <Display />,
    isMenu: true,
    children: [
      {
        name: '每日详情',
        path: '/report/daily',
        element: loadable(() => import('../pages/report/daily')),
        isMenu: true,
      },
    ]
  },
  {
    name: '用户管理',
    icon: <Person />,
    isMenu: true,
    children: [
      {
        name: '用户列表',
        path: '/user/list',
        element: loadable(() => import('../pages/user/list')),
        isMenu: true,
      },
      {
        name: '新增用户',
        path: '/user/new_list',
        element: loadable(() => import('../pages/user/list')),
        isMenu: true,
      },
    ]
  },
  {
    name: '设置',
    icon: <Person />,
    path: '/setting/info',
    element: loadable(() => import('../pages/setting/info')),
    isMenu: false,
  },
  {
    name: '用户登录',
    icon: <Person />,
    path: '/user/login',
    element: loadable(() => import('../pages/user/login')),
    isMenu: false,
  },
]

export default function ViewRouter() {
  return (
    <Routes>
      {renderRoutes(routers)}
    </Routes>
  )
}
