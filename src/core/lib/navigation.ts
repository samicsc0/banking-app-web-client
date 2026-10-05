export const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/accounts", label: "Accounts", end: false },
  { to: "/transfer", label: "Transfer", end: false },
  { to: "/activity", label: "Activity", end: false },
  { to: "/profile", label: "Profile", end: false },
] as const

export const sidebarItems = [
  { to: "/", label: "Home", end: true },
  { to: "/accounts", label: "Accounts", end: false },
  { to: "/activity", label: "Activity", end: false },
  { to: "/transfer", label: "Transfer", end: false },
  { to: "/profile", label: "Profile", end: false },
] as const
