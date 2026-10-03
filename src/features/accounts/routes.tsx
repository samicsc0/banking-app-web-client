import { lazy } from "react"
import type { RouteObject } from "react-router"

const AccountsPage = lazy(() =>
  import("@/features/accounts/components/accounts-page").then((module) => ({
    default: module.AccountsPage,
  }))
)
const OpenAccountPage = lazy(() =>
  import("@/features/accounts/components/open-account-page").then((module) => ({
    default: module.OpenAccountPage,
  }))
)
const AccountDetailPage = lazy(() =>
  import("@/features/accounts/components/account-detail-page").then(
    (module) => ({
      default: module.AccountDetailPage,
    })
  )
)

export const accountRoutes: RouteObject[] = [
  { path: "accounts", element: <AccountsPage /> },
  { path: "accounts/new", element: <OpenAccountPage /> },
  { path: "accounts/:accountId", element: <AccountDetailPage /> },
]
