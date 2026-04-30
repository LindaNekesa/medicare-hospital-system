import * as React from "react"

type Variant = "default" | "ghost" |"outline"
type Size = "default" | "icon-sm"

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const base = "rounded font-medium transition"

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    ghost:   "bg-transparent hover:bg-gray-100 text-gray-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  }

  const sizes = {
    default: "px-4 py-2",
    "icon-sm": "p-2 text-sm"
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}