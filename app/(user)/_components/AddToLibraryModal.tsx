'use client';

import { X, BookmarkPlus } from 'lucide-react';

type Props = {
  onClose: () => void;
  onConfirm: () => void; 
};

export default function AddToLibraryModal({ onClose, onConfirm }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
       
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Add to Library
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <BookmarkPlus size={28} />
          </div>

          <p className="text-gray-700 mb-6">
            This book will be added to your library.
          </p>

          <button
            onClick={onConfirm}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Add to Library
          </button>
        </div>
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
