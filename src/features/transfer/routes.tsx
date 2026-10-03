import { lazy } from "react"
import type { RouteObject } from "react-router"

const TransferPage = lazy(() =>
  import("@/features/transfer/components/transfer-page").then((module) => ({
    default: module.TransferPage,
  }))
)
const TransferSuccessPage = lazy(() =>
  import("@/features/transfer/components/transfer-success-page").then(
    (module) => ({
      default: module.TransferSuccessPage,
    })
  )
)

export const transferRoutes: RouteObject[] = [
  { path: "transfer", element: <TransferPage /> },
  { path: "transfer/success", element: <TransferSuccessPage /> },
]
