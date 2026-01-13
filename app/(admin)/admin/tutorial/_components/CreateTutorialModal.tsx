"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { parseCookies } from "nookies";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  description?: string;
  videoUrl: string;
}

export default function CreateTutorialModal({ onClose, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const cookies = parseCookies();
  const user = cookies.user ? JSON.parse(cookies.user) : null;
  const userId = user?._id;

  const onSubmit = async (data: FormData) => {
    if (!userId) {
      return toast.error("User not authenticated");
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tutorial`, {
        ...data,
        userId,
      });

      toast.success("Tutorial created successfully");
      onSuccess();
      onClose();
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || "Failed to create tutorial");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Create Tutorial</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: true })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">Title is required</span>
          )}

          <textarea
            placeholder="Description"
            {...register("description")}
            className="w-full border px-3 py-2 rounded"
          />

          <input
            type="text"
            placeholder="Video URL"
            {...register("videoUrl", { required: true })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.videoUrl && (
            <span className="text-red-500 text-sm">Video URL is required</span>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
