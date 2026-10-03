import type { AccountType, TransactionType } from "@/core/api/types"
import {
  ArrowLeftRightIcon,
  LandmarkIcon,
  PercentIcon,
  PiggyBankIcon,
  ReceiptIcon,
  RefreshCwIcon,
  WalletIcon,
} from "lucide-react"

export function AccountGlyph({
  type,
  className,
}: {
  type: AccountType
  className?: string
}) {
  switch (type) {
    case "SAVINGS":
      return <PiggyBankIcon className={className} />
    case "MONEY_MARKET":
      return <PercentIcon className={className} />
    case "INDIVIDUAL_RETIREMENT_ACCOUNT":
      return <WalletIcon className={className} />
    case "CHECKING":
    case "FIXED_TIME_DEPOSIT":
    case "SPECIAL_BLOCKED_ACCOUNT":
      return <LandmarkIcon className={className} />
  }
}

export function TransactionGlyph({
  type,
  className,
}: {
  type: TransactionType
  className?: string
}) {
  switch (type) {
    case "REFUND":
    case "INTEREST_EARNED":
    case "TELLER_DEPOSIT":
      return <RefreshCwIcon className={className} />
    case "FUND_TRANSFER":
    case "TELLER_TRANSFER":
      return <ArrowLeftRightIcon className={className} />
    default:
      return <ReceiptIcon className={className} />
  }
}
