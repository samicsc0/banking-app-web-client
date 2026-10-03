import type { ReactNode } from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type ResponsiveOverlayProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: ReactNode
}

export function ResponsiveOverlay({
  open,
  onOpenChange,
  title,
  children,
}: ResponsiveOverlayProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet onOpenChange={onOpenChange} open={open}>
        <SheetContent
          className="max-h-[92svh] overflow-y-auto rounded-t-xl px-4 pb-8"
          side="bottom"
        >
          <SheetHeader>
            <SheetTitle className="font-heading text-section text-ink">
              {title}
            </SheetTitle>
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md bg-surface sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-section text-ink">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
