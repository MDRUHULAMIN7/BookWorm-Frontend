import { DeleteReviewModalProps } from '@/app/_types/review.types';
import { AlertTriangle, Trash2 } from 'lucide-react';



export default function DeleteReviewModal({
  isOpen,
  onClose,
  onConfirm,
  reviewTitle,
  userName,
}: DeleteReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Delete Review
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete the review for{' '}
            <span className="font-medium">{reviewTitle}</span> by{' '}
            <span className="font-medium">{userName}</span>?
            <br />
            <span className="text-red-600 font-medium">
              This action cannot be undone.
            </span>
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium flex-1"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium flex-1 flex items-center justify-center gap-2"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}