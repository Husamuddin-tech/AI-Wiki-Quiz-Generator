import React, { useEffect } from 'react';

export default function Modal({ open, onClose, title, children }) {
  // Close modal on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-navy-900 rounded-xl shadow-2xl w-full max-w-3xl sm:max-w-2xl md:max-w-3xl mx-4 p-6 transform transition-transform scale-90 sm:scale-100 animate-scale-in"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-navy-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 font-bold text-xl transition-colors"
            aria-label="Close Modal"
          >
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#A7BFD9]/60 scrollbar-track-transparent">
          {children}
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
}
