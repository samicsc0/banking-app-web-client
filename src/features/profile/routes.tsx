import { lazy } from "react"
import type { RouteObject } from "react-router"

const ProfilePage = lazy(() =>
  import("@/features/profile/components/profile-page").then((module) => ({
    default: module.ProfilePage,
  }))
)

export const profileRoutes: RouteObject[] = [
  { path: "profile", element: <ProfilePage /> },
]
