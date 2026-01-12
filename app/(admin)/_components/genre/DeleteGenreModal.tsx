'use client';

import { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Genre {
  _id: string;
  name: string;
  description: string;
}

interface DeleteGenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  genre: Genre;
  onSuccess: (id: string) => void;
}

export default function DeleteGenreModal({
  isOpen,
  onClose,
  genre,
  onSuccess,
}: DeleteGenreModalProps) {
  const [loading, setLoading] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/genre/${genre._id}`
      );

      if (res.data.success) {
        toast.success(res.data.message || 'Genre deleted successfully!');
        onSuccess(genre._id);
        onClose();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete genre');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-0  bg-opacity-80 backdrop-blur-xs pointer-events-auto" />
      
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Delete Genre</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete the genre{' '}
            <span className="font-semibold text-gray-900">"{genre.name}"</span>?
          </p>
          <p className="text-sm text-gray-500">
            This action cannot be undone. All books associated with this genre may
            be affected.
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-1">{genre.name}</h4>
            <p className="text-sm text-gray-600">{genre.description}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Deleting...' : 'Delete Genre'}
          </button>
        </div>
      </div>
    </div>
  );
}