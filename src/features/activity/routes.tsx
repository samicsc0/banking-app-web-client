import { lazy } from "react"
import type { RouteObject } from "react-router"

const ActivityPage = lazy(() =>
  import("@/features/activity/components/activity-page").then((module) => ({
    default: module.ActivityPage,
  }))
)

export const activityRoutes: RouteObject[] = [
  { path: "activity", element: <ActivityPage /> },
]
