import { axiosClient } from "@/core/api/axios-client"
import type { Account, AccountType, Page } from "@/core/api/types"

export const ACCOUNT_SUMMARY_SIZE = 50

export async function fetchAccounts(page = 0, size = ACCOUNT_SUMMARY_SIZE) {
  const { data } = await axiosClient.get<Page<Account>>("/api/accounts", {
    params: { page, size, sort: "id,asc" },
  })
  return data
}

export async function fetchAccount(id: number) {
  const { data } = await axiosClient.get<Account>(`/api/accounts/${id}`)
  return data
}

export async function createAccount(input: {
  accountType: AccountType
  initialBalance: number
}) {
  const { data } = await axiosClient.post<Account>("/api/accounts", input)
  return data
}
