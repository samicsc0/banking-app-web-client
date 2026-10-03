import { axiosClient } from "@/core/api/axios-client"
import { setTokens } from "@/core/api/token"
import type { LoginResponse, RegisterResponse } from "@/core/api/types"

export type LoginInput = {
  username: string
  password: string
}

export type RegisterInput = {
  firstName: string
  lastName: string
  username: string
  phoneNumber: string
  email: string
  password: string
}

export async function login(input: LoginInput) {
  const { data } = await axiosClient.post<LoginResponse>("/api/auth/login", {
    username: input.username,
    passwordHash: input.password,
  })
  setTokens(data.accessToken, data.refreshToken)
  return data
}

export async function register(input: RegisterInput) {
  const { data } = await axiosClient.post<RegisterResponse>(
    "/api/auth/register",
    {
      username: input.username,
      passwordHash: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      phoneNumber: input.phoneNumber,
      email: input.email || undefined,
    }
  )
  return data
}
