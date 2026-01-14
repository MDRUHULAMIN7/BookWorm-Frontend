'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { parseCookies } from 'nookies';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  BookOpen,
  User,
  Tag,
  BookmarkPlus,
  Check,
  Loader2,
  Star,
} from 'lucide-react';
import Link from 'next/link';
import AddToLibraryModal from '@/app/(user)/_components/AddToLibraryModal';
import AddReviewModal from './AddReviewModal';
import ReviewList from './ReviewList';

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: { _id: string; name: string; description?: string };
  coverImage: string;
  description: string;
  summary: string;
};

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
  book: Book;
};

export default function BookDetailClient({ book }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [userReviewCount, setUserReviewCount] = useState(0);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.user) {
      const user = JSON.parse(cookies.user);
      setUserId(user._id || user.id);
    }
  }, []);

  const checkLibraryStatus = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/library/${userId}`);
      if (res.data.success) {
        const exists = res.data.data.some(
          (item: any) => item.book._id === book._id// eslint-disable-line @typescript-eslint/no-explicit-any
        );
        setIsInLibrary(exists);
      }
    } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      console.error(error.message || 'Failed to check library status');
    } finally {
      setLoading(false);
    }
  }, [userId, book._id, BASE_URL]);

  useEffect(() => {
    checkLibraryStatus();
  }, [checkLibraryStatus]);

  const fetchReviews = useCallback(async () => {
    try {
      setReviewLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/v1/review/approved/${book._id}`
      );
      if (res.data.success) {
        setReviews(res.data.data);
        
        // Check how many reviews current user has for this book
        if (userId) {
          const userReviews = res.data.data.filter(
            (review: Review) => review.userId._id === userId
          );
          setUserReviewCount(userReviews.length);
        }
      }
    } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Failed to fetch reviews:', error.message);
    } finally {
      setReviewLoading(false);
    }
  }, [book._id, userId, BASE_URL]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleAddToLibrary = async () => {
    if (!userId) {
      toast.error('Please login to add books to your library');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/library`, {
        userId,
        bookId: book._id,
        shelf: 'want',
      });

      if (res.data.success) {
        toast.success('Book added to library!');
        setShowAddModal(false);
        setIsInLibrary(true);
      }
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Failed to add book');
    }
  };

  const handleAddReview = async (rating: number, comment: string) => {
    if (!userId) {
      toast.error('Please login to add a review');
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/v1/review/${userId}`, {
        bookId: book._id,
        rating,
        comment,
      });

      if (res.data.success) {
        toast.success('Review submitted for approval!');
        setShowReviewModal(false);
        // Refresh reviews
        fetchReviews();
      }
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleWriteReviewClick = () => {
    if (!userId) {
      toast.error('Please login to write a review');
      return;
    }
    setShowReviewModal(true);
  };

  return (
    <div className="admin-container ">
      {/* Existing Book Details Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden admin-container mb-2">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 ">
          <div className="lg:col-span-3">
            <div className="relative aspect-3/3 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </div>

            {/* Library Actions */}
            <div className="mt-6 space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin text-blue-500" size={24} />
                </div>
              ) : isInLibrary ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Check className="text-green-600" size={20} />
                    <span className="text-sm font-medium text-green-700">
                      Already in your library
                    </span>
                  </div>
                  <Link
                    href="/user/library"
                    className="block w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium text-center"
                  >
                    Go to My Library
                  </Link>
                
                  {/* Write Review Button - Always show if user is logged in */}
                  {userId && (
                    <button
                      onClick={handleWriteReviewClick}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-medium"
                    >
                      <Star size={20} />
                      {userReviewCount > 0 ? 'Add Another Review' : 'Write a Review'}
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    <BookmarkPlus size={20} />
                    Add to Library
                  </button>
                  
                  {/* Write Review Button - Show even if not in library */}
                  {userId && (
                    <button
                      onClick={handleWriteReviewClick}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition font-medium"
                    >
                      <Star size={20} />
                      {userReviewCount > 0 ? 'Add Another Review' : 'Write a Review'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {book.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={18} />
                  <span className="font-medium">{book.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={18} />
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {book.genre.name}
                  </span>
                </div>
                {userReviewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Star size={18} className="text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      Your reviews: {userReviewCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {book.genre.description && (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Tag size={18} />
                  About {book.genre.name}
                </h3>
                <p className="text-gray-600 text-sm">{book.genre.description}</p>
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen size={20} />
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
            
            {/* Book Summary */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{book.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="admin-container">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Reviews ({reviews.length})
              </h2>
              {userReviewCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  You have {userReviewCount} review{userReviewCount > 1 ? 's' : ''} for this book
                </p>
              )}
            </div>
            
            {/* Add Review Button - Always show if user is logged in */}
            {userId && (
              <button
                onClick={handleWriteReviewClick}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <Star size={18} />
                {userReviewCount > 0 ? 'Add Another Review' : 'Add Review'}
              </button>
            )}
          </div>
          
          {reviewLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-blue-500" size={32} />
            </div>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddToLibraryModal
          onClose={() => setShowAddModal(false)}
          onConfirm={handleAddToLibrary}
        />
      )}

      {showReviewModal && (
        <AddReviewModal
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleAddReview}
        />
      )}
    </div>
  );
}