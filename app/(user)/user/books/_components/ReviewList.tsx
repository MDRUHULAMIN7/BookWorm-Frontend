'use client';

import Image from 'next/image';
import { Star, Calendar } from 'lucide-react';

type Review = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    photo: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
};

type Props = {
  reviews: Review[];
};

export default function ReviewList({ reviews }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <Star size={48} className="mx-auto opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-500">
          Be the first to share your thoughts about this book!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews?.map((review) => (
        <div
          key={review._id}
          className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition"
        >
          <div className="flex flex-col md:flex-row gap-2 items-start mb-4">
            <div className="flex items-center gap-3 ">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                {review.userId.photo ? (
                  <Image
                    src={review.userId.photo}
                    alt={review.userId.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-semibold">
                    {review.userId.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {review.userId.name}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={20}
                  className={`${
                    star <= review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-300 text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 font-medium text-gray-700">
                {review.rating}.0
              </span>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}