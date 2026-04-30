"use client"

export default function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div
        className="bg-white p-4 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}