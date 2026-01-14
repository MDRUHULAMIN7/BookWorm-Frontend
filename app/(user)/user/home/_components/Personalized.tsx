'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Info, BookOpen, Star, Users } from 'lucide-react';
import { parseCookies } from 'nookies';
import { RecommendationData } from '@/app/_types/user/Type';


export default function Personalized() {
    const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  // Get user ID from cookies
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.user) {
      const user = JSON.parse(cookies.user);
      setUserId(user._id || user.id);
    }
  }, []);
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/recommendation/${userId}?limit=12`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const result = await response.json();
        setData(result.data);
      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  if (loading) {
    return (
      <section className="admin-container">
        <div className="mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Recommended for You
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-2/3 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.recommendations.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className=" mx-auto">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No recommendations yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start reading books to get personalized recommendations!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='px-3'>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {data.isPersonalized ? 'Recommended for You' : 'Popular Picks'}
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            {data.isPersonalized ? (
              <>
                <BookOpen className="w-4 h-4" />
                Based on your {data.booksRead} books read
              </>
            ) : (
              <>
                <Info className="w-4 h-4" />
                Read at least 3 books to get personalized recommendations
              </>
            )}
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 ">
          {data.recommendations.map((book) => (
            <div
              key={book._id}
              className="group relative transition-transform duration-300 hover:scale-105"
              onMouseEnter={() => setShowTooltip(book._id)}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Link href={`/user/books/${book._id}`} className="block">
                {/* Book Cover */}
                <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 mb-3 bg-gray-200 dark:bg-gray-700">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-2 text-white text-xs mb-1">
                        <Star className="w-3 h-3 fill-blue-400 text-blue-400" />
                        <span>{book.avgRating > 0 ? book.avgRating.toFixed(1) : 'N/A'}</span>
                        <Users className="w-3 h-3 ml-1" />
                        <span>{book.shelvedCount}</span>
                      </div>
                      <span className="inline-block text-xs bg-blue-500/90 text-white px-2 py-1 rounded">
                        {book.genre.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Book Info */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {book.author}
                  </p>
                </div>
              </Link>

              {/* Tooltip - Why this book? */}
              {book.reason && showTooltip === book._id && (
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg whitespace-nowrap pointer-events-none">
                  <div className="flex items-start gap-2">
                    <Info className="w-3 h-3 shrink-0 mt-0.5" />
                    <span>{book.reason}</span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                    <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* View All Link */}
        {data.recommendations.length >= 12 && (
          <div className="text-center mt-8">
            <Link
              href="/user/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              <BookOpen className="w-5 h-5" />
              Explore More Books
            </Link>
          </div>
        )}
    
    </section>
  );
}