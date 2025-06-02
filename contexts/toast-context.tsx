"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import type { ToastProps } from "@/components/ui/toast"

type ToastContextType = {
  toasts: ToastProps[]
  addToast: (toast: ToastProps) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const addToast = (toast: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToastContext must be used within a ToastProvider")
  }
  return context
}
