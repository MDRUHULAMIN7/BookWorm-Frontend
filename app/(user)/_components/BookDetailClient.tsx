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
} from 'lucide-react';
import Link from 'next/link';
import AddToLibraryModal from './AddToLibraryModal';

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: { _id: string; name: string; description?: string };
  coverImage: string;
  description: string;
  summary: string;
};

type Props = {
  book: Book;
};

export default function BookDetailClient({ book }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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
        (item: any) => item.book._id === book._id // eslint-disable-line @typescript-eslint/no-explicit-any
      );
      setIsInLibrary(exists);
    }
  } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
    console.error(error.message || 'Failed to check library status');
  } finally {
    setLoading(false);
  }
}, [userId, book._id,BASE_URL]);

useEffect(() => {
  checkLibraryStatus();
}, [checkLibraryStatus]);


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


  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 lg:p-8">
      
          <div className="lg:col-span-1">
            <div className="relative aspect-2/3 rounded-lg overflow-hidden shadow-2xl">
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
            <div className="mt-6">
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
                </div>
              ) : (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                >
                  <BookmarkPlus size={20} />
                  Add to Library
                </button>
              )}
            </div>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2 space-y-6">
        
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
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{book.summary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add to Library Modal */}
  {showAddModal && (
  <AddToLibraryModal
    onClose={() => setShowAddModal(false)}
    onConfirm={handleAddToLibrary}
  />
)}
    </div>
  );
}