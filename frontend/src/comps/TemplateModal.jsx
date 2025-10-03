// Modal.jsx
import { FaWandMagicSparkles } from 'react-icons/fa6';
import { MdEdit } from 'react-icons/md';
import LoadingImg from '../assets/loader.gif'
export default function TemplateModal({
  open,
  onClose,
  imgSrc,
  onCustomize,
  onRegenerate,
  loading = false,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100]" // elevate above headers using z-50
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[101]"
        onClick={onClose}
        
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[102] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Certificate Preview</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

        {/* Body */}
        <div className="px-5 py-4">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                {loading ? (
                 <>
              <img src={LoadingImg} style={{
                mixBlendMode: 'multiply'
              }}/>
                   </>
                ) : (
                    <img
                        src={imgSrc}
                        alt="Certificate template preview"
                        className="h-full w-full object-contain"
                        draggable={false}
                    />
                )}
            </div>
        </div>

        {/* Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 px-5 py-4 border-t border-gray-200">
            
            <button
              onClick={onRegenerate}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 hover:bg-gray-50 transition"
            >
              <FaWandMagicSparkles />
              {loading ? 'Regenerating…' : 'Regenerate'}
            </button>
            <button
              onClick={onCustomize}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition"

            >
              <MdEdit className="text-lg" />
              Customize this template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
