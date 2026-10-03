import { hasSession } from "@/core/api/token"

export function useHasSession() {
  return hasSession()
}
