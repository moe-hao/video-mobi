import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import RouteGuard from "../components/route-guard";


const routes = [
    { path: '/', Component: lazy(() => import("../pages/collection/list")) },
    { path: '/video/watch', Component: lazy(() => import("../pages/video/watch")) },
    { path: '/user/info', Component: lazy(() => import("../pages/user/info")) },
    { path: '/user/store', Component: lazy(() => import("../pages/user/store")) },
    { path: '/user/feedback', Component: lazy(() => import("../pages/user/feedback")) },
    { path: '/user/login', Component: lazy(() => import("../pages/user/login")) },
    { path: '/user/login/email', Component: lazy(() => import("../pages/user/login/email")) },
    { path: '/user/login/verify', Component: lazy(() => import("../pages/user/login/verify")) },
    { path: '/user/coin', Component: lazy(() => import("../pages/user/coin")) },
    { path: '/history/list', Component: lazy(() => import("../pages/history/list")) },
];

export const router = createBrowserRouter([
    {
        element: <RouteGuard />,
        children: routes,
    }
]);
