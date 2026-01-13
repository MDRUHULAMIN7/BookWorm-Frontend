import Image from "next/image";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import ReviewStatusBadge from "./ReviewStatusBadge";
import { ReviewsTableProps } from "@/app/_types/review.types";

export default function ReviewsTable({
  reviews,
  updatingId,
  onStatusUpdate,
  onDeleteClick,
}: ReviewsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      absolute: format(date, "MMM dd, yyyy HH:mm"),
    };
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-xl ${
              index < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}.0</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                User & Book
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                Rating & Comment
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                Date
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <div className="text-gray-500">No reviews found</div>
                </td>
              </tr>
            ) : (
              reviews.map((review) => {
                const dateInfo = formatDate(review.createdAt);
                return (
                  <tr
                    key={review._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                            {review.userId.photo ? (
                              <Image
                                src={review.userId.photo}
                                alt={review.userId.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                                {review.userId.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {review.userId.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {review.userId.email}
                            </div>
                          </div>
                        </div>

                        <div className="pl-13">
                          <div className="font-medium text-gray-900">
                            {review.bookId.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {review.bookId.author}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Rating & Comment */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        {renderStars(review.rating)}
                        <div className="max-w-xs">
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <ReviewStatusBadge
                        review={review}
                        updatingId={updatingId}
                        onStatusUpdate={onStatusUpdate}
                      />
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {dateInfo.relative}
                        </div>
                        <div className="text-xs text-gray-500">
                          {dateInfo.absolute}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            onDeleteClick(
                              review._id,
                              review.bookId.title,
                              review.userId.name
                            )
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete review"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
