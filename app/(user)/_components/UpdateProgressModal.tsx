"use client";

import { useState } from "react";
import { X, TrendingUp } from "lucide-react";

type Props = {
  currentProgress: number;
  onClose: () => void;
  onUpdate: (progress: number) => void;
};

export default function UpdateProgressModal({
  currentProgress,
  onClose,
  onUpdate,
}: Props) {
  const [progress, setProgress] = useState(currentProgress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(progress);
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Update Progress</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Progress Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">
                Reading Progress
              </label>
              <span className="text-2xl font-bold text-blue-600">
                {progress}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-linear-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Quick Select:
            </p>
            <div className="grid grid-cols-5 gap-2">
              {[0, 25, 50, 75, 100].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setProgress(value)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition ${
                    progress === value
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>

          {progress === 100 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                Congratulations! This book will be moved to Read shelf.
              </p>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              Update Progress
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
