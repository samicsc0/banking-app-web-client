import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GENERIC_ERROR_MESSAGE, getErrorMessage } from "@/core/api/errors"
import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router"

export function RouteError() {
  const error = useRouteError()
  const navigate = useNavigate()
  const message = isRouteErrorResponse(error)
    ? error.status === 404
      ? "That page doesn't exist."
      : GENERIC_ERROR_MESSAGE
    : getErrorMessage(error)

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md bg-surface ring-border">
        <CardHeader>
          <CardTitle className="font-heading text-title text-ink">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-copy text-ink-muted" role="alert">
            {message}
          </p>
          <Button onClick={() => navigate("/")} type="button">
            Go to home
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
