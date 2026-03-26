// components/ui/Modal.tsx
"use client"

type Props = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  )
}