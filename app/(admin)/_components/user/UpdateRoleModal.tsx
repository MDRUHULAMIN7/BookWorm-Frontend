'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface UpdateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: (updatedUser: User) => void;
}

export default function UpdateRoleModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UpdateRoleModalProps) {
  const [loading, setLoading] = useState(false);
  const newRole = user.role === 'admin' ? 'user' : 'admin';

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/${user._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('User role updated');
      onSuccess(data.data);
      onClose();
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Update User Role
          </h3>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-gray-700">
            <p className="font-medium">{user.name}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <p className="text-sm text-gray-600">
            Are you sure you want to change this user role to{' '}
            <span className="font-semibold capitalize">{newRole}</span>?
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 px-4 py-2 rounded-lg text-white transition disabled:opacity-50 ${
              newRole === 'admin'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Updating...' : `Make ${newRole}`}
          </button>
        </div>
      </div>
    </div>
  );
}
