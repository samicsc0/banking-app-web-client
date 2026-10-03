import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"

import { invalidateBankingData } from "@/core/api/invalidate"
import { login, register, type RegisterInput } from "@/features/auth/api/auth"

export function useLogin() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      await queryClient.invalidateQueries()
      navigate("/")
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      await register(input)
      await login({ username: input.username, password: input.password })
    },
    onSuccess: async () => {
      await invalidateBankingData()
      navigate("/")
    },
  })
}
