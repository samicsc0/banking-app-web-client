import { useQuery } from "@tanstack/react-query"

import { queryKeys } from "@/core/api/query-client"
import { fetchProfile } from "@/features/profile/api/profile"

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: fetchProfile,
  })
}
