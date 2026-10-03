import { axiosClient } from "@/core/api/axios-client"
import type { UserProfile } from "@/core/api/types"

export async function fetchProfile() {
  const { data } = await axiosClient.get<UserProfile>("/api/users/me")
  return data
}
