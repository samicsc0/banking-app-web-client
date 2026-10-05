import { useAccounts } from "@/features/accounts/hooks/use-accounts"
import { useProfile } from "@/features/profile/hooks/use-profile"

export function useHome() {
  return {
    profile: useProfile(),
    accounts: useAccounts(),
  }
}
