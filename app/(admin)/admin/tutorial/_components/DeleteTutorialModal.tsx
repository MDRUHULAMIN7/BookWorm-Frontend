'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { parseCookies } from 'nookies';

interface Props {
  tutorial: { _id: string; title: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteTutorialModal({ tutorial, onClose, onSuccess }: Props) {
  const cookies = parseCookies();
  const user = cookies.user ? JSON.parse(cookies.user) : null;
  const userId = user?._id;

  const handleDelete = async () => {
    if (!userId) {
      return toast.error('User not authenticated');
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tutorial/${tutorial._id}`,
        {
          data: { userId },
        }
      );

      toast.success('Tutorial deleted successfully');
      onSuccess();
      onClose();
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Failed to delete tutorial');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-lg font-semibold mb-4">Delete Tutorial</h2>
        <p>
          Are you sure you want to delete{' '}
          <strong>{tutorial.title}</strong>?
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
