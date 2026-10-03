import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/core/api/query-client"
import { fetchAccounts, fetchProfile } from "@/features/dashboard/api/home"

export function useHome() {
  const profile = useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchProfile,
  })
  const accounts = useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => fetchAccounts(0, 20),
  })

  return { profile, accounts }
}
