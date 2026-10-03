import { z } from "zod"

const optionalEmail = z
  .string()
  .trim()
  .refine(
    (value) => value.length === 0 || z.email().safeParse(value).success,
    "Enter a valid email."
  )

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter your username."),
  password: z.string().min(1, "Enter your password."),
})

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter your first name."),
    lastName: z.string().trim().min(1, "Enter your last name."),
    username: z.string().trim().min(1, "Choose a username."),
    phoneNumber: z.string().trim().min(7, "Enter your phone number."),
    email: optionalEmail,
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  })

export type LoginValues = z.infer<typeof loginSchema>
export type RegisterValues = z.infer<typeof registerSchema>
