import { useInfiniteQuery } from "@tanstack/react-query"

import { queryKeys } from "@/core/api/query-client"
import { fetchTransactions } from "@/features/activity/api/transactions"

export function useTransactions(accountId: number | undefined) {
  return useInfiniteQuery({
    queryKey: queryKeys.transactions(accountId ?? 0),
    queryFn: ({ pageParam }) => fetchTransactions(accountId ?? 0, pageParam),
    initialPageParam: 0,
    enabled: Boolean(accountId),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.number + 1,
  })
}
