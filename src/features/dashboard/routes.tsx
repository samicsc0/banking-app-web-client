import { lazy } from "react"
import type { RouteObject } from "react-router"

const DashboardPage = lazy(() =>
  import("@/features/dashboard/components/dashboard-page").then((module) => ({
    default: module.DashboardPage,
  }))
)

export const dashboardRoutes: RouteObject[] = [
  { index: true, element: <DashboardPage /> },
]
