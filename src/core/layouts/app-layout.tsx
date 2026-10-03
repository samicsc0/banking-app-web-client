import { Suspense } from "react"
import { Link, Outlet, useLocation } from "react-router"

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
import { PageFallback } from "@/core/components/page-header"
import { ThemeToggle } from "@/core/components/theme-toggle"
import { Wordmark } from "@/core/components/wordmark"
import { NavIcon } from "@/core/lib/nav-icon"
import { navItems } from "@/core/lib/navigation"
import { cn } from "cn"

export function AppLayout() {
  const { pathname } = useLocation()

  return (
    <SidebarProvider>
      <Sidebar
        className="hidden border-sidebar-border md:flex"
        collapsible="none"
      >
        <SidebarHeader className="px-4 py-5">
          <Wordmark />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-3">
            {navItems.map((item) => {
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
        <SidebarFooter className="flex-row items-center justify-between px-4 py-4">
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-background">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </SidebarInset>
      <MobileTabBar pathname={pathname} />
    </SidebarProvider>
  )
}

function MobileTabBar({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface md:hidden">
      <div className="grid grid-cols-5 items-end px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
          const active = item.end
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(`${item.to}/`)
          const transfer = item.to === "/transfer"
          return (
            <Button
              className={cn(
                "h-auto min-w-0 shrink flex-col gap-1 px-0.5 py-1 text-center text-caption font-normal whitespace-normal",
                transfer &&
                  "relative -top-4 size-14 justify-center self-center rounded-full",
                active && !transfer && "bg-primary-soft text-primary",
                !active && !transfer && "text-ink-muted"
              )}
              key={item.to}
              render={<Link to={item.to} />}
              size={transfer ? "icon" : "compact"}
              variant={transfer ? "primary" : "ghost"}
            >
              <NavIcon
                className={transfer ? "size-5" : "size-4"}
                to={item.to}
              />
              {transfer ? (
                <span className="absolute top-14 text-caption text-primary">
                  {item.label}
                </span>
              ) : (
                <span>{item.label}</span>
              )}
            </Button>
          )
        })}
      </div>
    </nav>
  )
}
