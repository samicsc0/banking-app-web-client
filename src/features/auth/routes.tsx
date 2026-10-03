import { lazy } from "react"
import type { RouteObject } from "react-router"

const LoginPage = lazy(() =>
  import("@/features/auth/components/login-page").then((module) => ({
    default: module.LoginPage,
  }))
)

const RegisterPage = lazy(() =>
  import("@/features/auth/components/register-page").then((module) => ({
    default: module.RegisterPage,
  }))
)

export const authRoutes: RouteObject[] = [
  { path: "login", element: <LoginPage /> },
  { path: "register", element: <RegisterPage /> },
]
