import { lazy } from "react"
import type { RouteObject } from "react-router"

const PayBillPage = lazy(() =>
  import("@/features/bills/components/pay-bill-page").then((module) => ({
    default: module.PayBillPage,
  }))
)

export const billRoutes: RouteObject[] = [
  { path: "bills", element: <PayBillPage /> },
]
