import { LogOutIcon } from "lucide-react"
import { Suspense } from "react"
import { Link, Outlet, useLocation, useNavigate } from "react-router"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { queryClient } from "@/core/api/query-client"
import { clearTokens } from "@/core/api/token"
import { PageFallback } from "@/core/components/page-header"
import { Wordmark } from "@/core/components/wordmark"
import { initials } from "@/core/lib/format"
import { NavIcon } from "@/core/lib/nav-icon"
import { navItems, sidebarItems } from "@/core/lib/navigation"
import { useProfile } from "@/features/profile/hooks/use-profile"
import { cn } from "cn"

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <Sidebar
        className="hidden h-full shrink-0 border-r border-sidebar-border md:flex"
        collapsible="none"
      >
        <SidebarHeader className="px-4 py-5">
          <Wordmark />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-3">
            {sidebarItems.map((item) => {
              const active = item.end
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(`${item.to}/`)
              return (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton
                    className="h-11 rounded-control text-copy"
                    isActive={active}
                    render={<Link to={item.to} />}
                  >
                    <NavIcon to={item.to} />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter className="p-3">
          <SidebarUser />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-h-0 overflow-y-auto bg-background">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </SidebarInset>
      <MobileTabBar pathname={pathname} />
    </SidebarProvider>
  )
}

function SidebarUser() {
  const navigate = useNavigate()
  const profile = useProfile()
  const user = profile.data

  const logout = () => {
    clearTokens()
    queryClient.clear()
    navigate("/login")
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9 bg-primary text-on-primary">
        <AvatarFallback className="bg-primary text-sm text-on-primary">
          {initials(user.firstName, user.lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body text-ink">
          {user.firstName} {user.lastName}
        </p>
        <p className="truncate text-caption text-ink-muted">{user.username}</p>
      </div>
      <Button
        aria-label="Log out"
        className="text-ink-muted"
        onClick={logout}
        size="icon-sm"
        type="button"
        variant="ghost"
      >
        <LogOutIcon />
      </Button>
    </div>
  )
}

function MobileTabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface md:hidden">
      <div className="grid grid-cols-5 items-end px-1 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const active = item.end
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(`${item.to}/`)
          const transfer = item.to === "/transfer"
          return (
            <Button
              className="h-auto w-full min-w-0 shrink flex-col gap-2 rounded-none bg-transparent px-0 py-0 text-[12px] font-normal whitespace-normal hover:bg-transparent"
              key={item.to}
              render={<Link to={item.to} />}
              variant="ghost"
            >
              <span className="relative flex h-8 w-14 items-center justify-center">
                {transfer ? (
                  <span className="absolute bottom-0 flex size-14 items-center justify-center rounded-full bg-primary text-white dark:bg-primary-hover">
                    <NavIcon className="size-5" to={item.to} />
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex h-8 w-14 items-center justify-center rounded-full",
                      active
                        ? "bg-primary-soft text-primary"
                        : "text-ink-subtle"
                    )}
                  >
                    <NavIcon className="size-[18px]" to={item.to} />
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-[12px] leading-none",
                  active || transfer
                    ? "font-medium text-primary"
                    : "font-normal text-ink-subtle"
                )}
              >
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
