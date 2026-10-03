import { createBrowserRouter } from "react-router"

import { RouteError } from "@/core/components/route-error"
import { AppLayout } from "@/core/layouts/app-layout"
import {
  RedirectIfAuthenticated,
  RequireAuth,
} from "@/core/layouts/session-guards"
import { AuthLayout } from "@/core/layouts/auth-layout"
import { accountRoutes } from "@/features/accounts/routes"
import { activityRoutes } from "@/features/activity/routes"
import { authRoutes } from "@/features/auth/routes"
import { billRoutes } from "@/features/bills/routes"
import { dashboardRoutes } from "@/features/dashboard/routes"
import { profileRoutes } from "@/features/profile/routes"
import { transferRoutes } from "@/features/transfer/routes"

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <RouteError />,
    children: [
      {
        element: <RedirectIfAuthenticated />,
        errorElement: <RouteError />,
        children: [
          {
            element: <AuthLayout />,
            children: authRoutes,
          },
        ],
      },
      {
        element: <RequireAuth />,
        errorElement: <RouteError />,
        children: [
          {
            element: <AppLayout />,
            children: [
              ...dashboardRoutes,
              ...accountRoutes,
              ...transferRoutes,
              ...billRoutes,
              ...activityRoutes,
              ...profileRoutes,
            ],
          },
        ],
      },
    ],
  },
])
