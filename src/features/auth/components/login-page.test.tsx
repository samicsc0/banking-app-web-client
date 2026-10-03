import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createMemoryRouter, RouterProvider } from "react-router"
import { describe, expect, it } from "vitest"

import { LoginPage } from "@/features/auth/components/login-page"

function renderLogin(initialEntry = "/login") {
  const queryClient = new QueryClient()
  const router = createMemoryRouter(
    [
      { path: "/login", element: <LoginPage /> },
      { path: "/", element: <p>Home</p> },
    ],
    { initialEntries: [initialEntry] }
  )

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

describe("LoginPage", () => {
  it("shows a validation message before calling the API", async () => {
    const user = userEvent.setup()
    renderLogin()

    await user.click(screen.getByRole("button", { name: "Login" }))

    expect(await screen.findByText("Enter your username.")).toBeInTheDocument()
  })

  it("shows the session-expired message", () => {
    renderLogin("/login?expired=1")

    expect(
      screen.getByText("Your session expired. Please sign in again.")
    ).toBeInTheDocument()
  })
})
