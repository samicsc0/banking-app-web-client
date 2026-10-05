import { zodResolver } from "@hookform/resolvers/zod"
import { LockIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/core/api/errors"
import { Field } from "@/core/components/field"
import { Wordmark } from "@/core/components/wordmark"
import { useRegister } from "@/features/auth/hooks/use-auth"
import {
  registerSchema,
  type RegisterValues,
} from "@/features/auth/other/schema"

export function RegisterPage() {
  const register = useRegister()
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-[22px]"
        noValidate
        onSubmit={form.handleSubmit((values) => register.mutate(values))}
      >
        <Wordmark className="mb-6 self-center md:hidden" size="lg" />
        <header className="flex flex-col gap-2 text-center">
          <h1 className="font-heading text-[26px] leading-[1.4] font-semibold text-ink">
            Create your account
          </h1>
          <p className="text-copy text-ink-muted">
            A checking account is opened for you automatically.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3">
          <Field
            autoComplete="given-name"
            label="First name"
            name="firstName"
            placeholder="Jane"
          />
          <Field
            autoComplete="family-name"
            label="Last name"
            name="lastName"
            placeholder="Doe"
          />
        </div>
        <Field
          autoComplete="username"
          icon={UserIcon}
          label="Username"
          name="username"
          placeholder="choose a username"
        />
        <div className="grid gap-[22px] md:grid-cols-2 md:gap-3">
          <Field
            autoComplete="tel"
            icon={PhoneIcon}
            label="Phone number"
            name="phoneNumber"
            placeholder="+251 9xx xxx xxx"
            type="tel"
          />
          <Field
            autoComplete="email"
            icon={MailIcon}
            label="Email (optional)"
            name="email"
            placeholder="you@example.com"
            type="email"
          />
        </div>
        <div className="grid gap-[22px] md:grid-cols-2 md:gap-3">
          <Field
            autoComplete="new-password"
            hint="At least 6 characters."
            icon={LockIcon}
            label="Password"
            name="password"
            placeholder="at least 6 characters"
            type="password"
          />
          <Field
            autoComplete="new-password"
            icon={LockIcon}
            label="Confirm password"
            name="confirmPassword"
            placeholder="repeat password"
            type="password"
          />
        </div>
        {register.isError ? (
          <p className="text-caption text-debit" role="alert">
            {getErrorMessage(register.error)}
          </p>
        ) : null}
        <Button loading={register.isPending} type="submit">
          Register
        </Button>
        <p className="text-center text-copy text-ink-muted">
          Already have an account?{" "}
          <Link className="font-medium text-primary" to="/login">
            Login
          </Link>
        </p>
      </form>
    </FormProvider>
  )
}
