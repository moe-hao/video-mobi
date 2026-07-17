import { Toast, ToastQueue } from "@heroui/react"
import { createContext, useContext, type ReactNode } from "react"

export interface ToastContent {
  title?: ReactNode,
  description?: ReactNode,
  variant?: "default" | "accent" | "success" | "warning" | "danger",
  timeout?: number,
}

interface ToastContextType {
  queue: ToastQueue<ToastContent>
}

const ToastContext = createContext<ToastContextType | null>(null)

const globalQueue = new ToastQueue<ToastContent>()

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <ToastContext.Provider value={{ queue: globalQueue }}>
      <Toast.Provider placement="top" queue={globalQueue} />
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context.queue
}
