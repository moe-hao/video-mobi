import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface ToastContent {
  title?: ReactNode,
  description?: ReactNode,
  variant?: "default" | "accent" | "success" | "warning" | "danger",
  timeout?: number,
}

interface ToastItem extends ToastContent {
  id: number
  removing?: boolean
}

interface ToastContextType {
  add: (content: ToastContent) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

let toastId = 0

const variantStyles: Record<string, { bg: string, icon: string }> = {
  default: {
    bg: "bg-[#1e2433]/95 backdrop-blur-xl border border-white/[0.08]",
    icon: "text-white/70"
  },
  accent: {
    bg: "bg-[#1e2433]/95 backdrop-blur-xl border border-indigo-500/30",
    icon: "text-indigo-400"
  },
  success: {
    bg: "bg-[#1e2433]/95 backdrop-blur-xl border border-emerald-500/30",
    icon: "text-emerald-400"
  },
  warning: {
    bg: "bg-[#1e2433]/95 backdrop-blur-xl border border-amber-500/30",
    icon: "text-amber-400"
  },
  danger: {
    bg: "bg-[#1e2433]/95 backdrop-blur-xl border border-red-500/30",
    icon: "text-red-400"
  },
}

const variantIcons: Record<string, string> = {
  default: "○",
  accent: "★",
  success: "✓",
  warning: "⚠",
  danger: "✕",
}

const iconAnimations: Record<string, string> = {
  default: "",
  accent: "animate-bounce",
  success: "",
  warning: "animate-pulse",
  danger: "animate-[shake_0.5s_ease-in-out]",
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const add = useCallback((content: ToastContent) => {
    const id = ++toastId
    const newToast: ToastItem = { ...content, id, removing: false }
    setToasts(prev => [...prev, newToast])

    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t))
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 400)
    }, content.timeout || 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ add }}>
      {children}
      <div className="fixed top-16 left-0 right-0 z-[100] flex flex-col items-center gap-3 pointer-events-none px-4">
        {toasts.map(toast => {
          const style = variantStyles[toast.variant || 'default']
          return (
            <div
              key={toast.id}
              className={`${style.bg} px-5 py-3.5 rounded-2xl max-w-[360px] w-full pointer-events-auto flex items-start gap-3 transition-all duration-400 ease-out ${toast.removing ? 'opacity-0 translate-y-[-20px] scale-95' : ''}`}
              style={{
                animation: toast.removing ? 'none' : 'toastIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              <div className={`${style.icon} w-8 h-8 rounded-full flex items-center justify-center bg-white/[0.05] flex-shrink-0 ${iconAnimations[toast.variant || 'default']}`}>
                <span className="text-sm leading-none">
                  {variantIcons[toast.variant || 'default']}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                {toast.title && <div className="font-semibold text-sm text-white leading-tight">{toast.title}</div>}
                {toast.description && <div className="text-xs text-white/50 mt-1 leading-relaxed">{toast.description}</div>}
              </div>
              <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${style.icon} opacity-50`}
                  style={{
                    animation: `shrink ${toast.timeout || 3000}ms linear forwards`,
                    background: 'currentColor',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <style>{`
        @keyframes toastIn {
          0% {
            opacity: 0;
            transform: translateY(-30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-3px); }
          40% { transform: translateX(3px); }
          60% { transform: translateX(-2px); }
          80% { transform: translateX(2px); }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
