"use client"

import { useSyncExternalStore, type CSSProperties } from "react"
import { createPortal } from "react-dom"

import { useTheme } from "@/components/theme-provider"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const emptySubscribe = () => () => {}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  const toaster = (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--ink)",
          "--normal-text": "var(--surface)",
          "--normal-border": "var(--ink)",
          "--border-radius": "var(--radius-control)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
        style: {
          background: "var(--ink)",
          color: "var(--surface)",
          borderColor: "var(--ink)",
          fontSize: "14px",
          lineHeight: "1.45",
          fontWeight: 500,
        },
      }}
      {...props}
    />
  )

  if (!isClient) {
    return toaster
  }

  return createPortal(toaster, document.body)
}

export { Toaster }
