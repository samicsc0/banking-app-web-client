import { hasSession } from "@/core/api/token"
import { Navigate, Outlet } from "react-router"

export function RequireAuth() {
  if (!hasSession()) {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}

export function RedirectIfAuthenticated() {
  if (hasSession()) {
    return <Navigate replace to="/" />
  }

  return <Outlet />
}
