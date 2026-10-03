import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"

import { invalidateBankingData } from "@/core/api/invalidate"
import { queryKeys } from "@/core/api/query-client"
import type { AccountType } from "@/core/api/types"
import {
  createAccount,
  fetchAccount,
  fetchAccounts,
} from "@/features/accounts/api/accounts"

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => fetchAccounts(0, 50),
  })
}

export function useAccountList() {
  return useInfiniteQuery({
    queryKey: [...queryKeys.accounts, "list"],
    queryFn: ({ pageParam }) => fetchAccounts(pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
  })
}

export function useAccount(id: number) {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => fetchAccount(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateAccount() {
  return useMutation({
    mutationFn: (input: { accountType: AccountType; initialBalance: number }) =>
      createAccount(input),
    onSuccess: () => invalidateBankingData(),
  })
}
