import React from 'react'

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-navy-900 rounded-lg shadow-lg w-11/12 max-w-3xl mx-4 p-6 transform transition-transform scale-100"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 font-bold text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
