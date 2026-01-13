import { useState } from "react";
import { CheckCircle, Clock, Loader2, ChevronDown } from "lucide-react";
import { ReviewStatusBadgeProps } from "@/app/_types/review.types";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "approved", label: "Approved", color: "green" },
] as const;

export default function ReviewStatusBadge({
  review,
  updatingId,
  onStatusUpdate,
}: ReviewStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  const config = STATUS_OPTIONS.find((opt) => opt.value === review.status);
  if (!config) return null;

  const colorClasses = {
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    green: "bg-green-100 text-green-800 border-green-200",
  };

  const handleAction = (newStatus: "pending" | "approved") => {
    onStatusUpdate(review._id, newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-full text-xs font-medium border ${
          colorClasses[config.color]
        } flex items-center gap-1 hover:opacity-90 transition-opacity`}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      >
        {config.label}
        <ChevronDown size={12} />
      </button>

      {/* Status Change Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {review.status === "pending" ? (
              <button
                onClick={() => handleAction("approved")}
                disabled={updatingId === review._id}
                className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 disabled:opacity-50"
              >
                {updatingId === review._id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle size={14} />
                )}
                Approve Review
              </button>
            ) : (
              <button
                onClick={() => handleAction("pending")}
                disabled={updatingId === review._id}
                className="w-full px-4 py-2 text-left text-sm text-yellow-700 hover:bg-yellow-50 flex items-center gap-2 disabled:opacity-50"
              >
                {updatingId === review._id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Clock size={14} />
                )}
                Set to Pending
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
