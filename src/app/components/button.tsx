import type { ReactNode } from "react"
import { FiLoader } from "react-icons/fi";

interface ButtonProps {
  type: HTMLButtonElement['type']
  children: ReactNode
  disabled?: boolean
  loading?: boolean
  className?: string
  onClick?: () => void
}

export default function Button({
  children,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${className}`}
    >
      {loading ? (
        <FiLoader className="animate-spin" size={20} />
      ) : (
        children
      )}
    </button>
  )
}
