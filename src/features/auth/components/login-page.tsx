import { zodResolver } from "@hookform/resolvers/zod"
import { LockIcon, UserIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { Link, useSearchParams } from "react-router"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/core/api/errors"
import { Field } from "@/core/components/field"
import { Wordmark } from "@/core/components/wordmark"
import { loginSchema, type LoginValues } from "@/features/auth/other/schema"
import { useLogin } from "@/features/auth/hooks/use-auth"
import { FormProvider } from "react-hook-form"

export function LoginPage() {
  const [params] = useSearchParams()
  const expired = params.get("expired") === "1"
  const login = useLogin()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  })

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-[22px]"
        noValidate
        onSubmit={form.handleSubmit((values) => login.mutate(values))}
      >
        <Wordmark className="mb-6 self-center md:hidden" size="lg" />
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-heading text-[26px] leading-[1.4] font-semibold text-ink">
            Welcome back
          </h1>
          <p className="text-copy text-ink-muted">
            Sign in to manage your accounts.
          </p>
        </header>
        {expired ? (
          <p
            className="rounded-control bg-primary-soft px-4 py-3 text-copy text-primary"
            role="status"
          >
            Your session expired. Please sign in again.
          </p>
        ) : null}
        <Field
          autoComplete="username"
          icon={UserIcon}
          label="Username"
          name="username"
          placeholder="demo.jane"
        />
        <Field
          autoComplete="current-password"
          icon={LockIcon}
          label="Password"
          name="password"
          placeholder="your password"
          type="password"
        />
        {login.isError ? (
          <p className="text-caption text-debit" role="alert">
            {getErrorMessage(login.error)}
          </p>
        ) : null}
        <Button loading={login.isPending} type="submit">
          Login
        </Button>
        <p className="text-center text-copy text-ink-muted">
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-primary" to="/register">
            Register
          </Link>
        </p>
      </form>
    </FormProvider>
  )
}
