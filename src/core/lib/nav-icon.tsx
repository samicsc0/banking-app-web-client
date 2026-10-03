import {
  ArrowLeftRightIcon,
  CreditCardIcon,
  HouseIcon,
  PlusIcon,
  ReceiptIcon,
  UserIcon,
} from "lucide-react"

export function NavIcon({ to, className }: { to: string; className?: string }) {
  switch (to) {
    case "/accounts":
      return <CreditCardIcon className={className} />
    case "/accounts/new":
      return <PlusIcon className={className} />
    case "/transfer":
      return <ArrowLeftRightIcon className={className} />
    case "/bills":
      return <ReceiptIcon className={className} />
    case "/activity":
      return <ReceiptIcon className={className} />
    case "/profile":
      return <UserIcon className={className} />
    default:
      return <HouseIcon className={className} />
  }
}
