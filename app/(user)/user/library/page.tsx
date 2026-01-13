'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { parseCookies } from 'nookies';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import {
  BookOpen,
  Loader2,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import UpdateProgressModal from '../../_components/UpdateProgressModal';
import Header from '@/app/(admin)/_components/Header';

type LibraryItem = {
  _id: string;
  book: {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
    genre: { name: string };
  };
  shelf: 'want' | 'reading' | 'read';
  progress: number;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
};

export default function LibraryPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [library, setLibrary] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'want' | 'reading' | 'read'>('all');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.user) {
      const user = JSON.parse(cookies.user);
      setUserId(user._id || user.id);
    }
  }, []);



  useEffect(() => {
    // Reset to page 1 when filter changes
    setCurrentPage(1);
  }, [filter]);

 
const fetchLibrary = useCallback(async () => {
  if (!userId) return;

  setLoading(true);
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/library/${userId}`);
    if (res.data.success) {
      setLibrary(res.data.data);
    }
  } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
    toast.error(error.message || 'Failed to load library');
  } finally {
    setLoading(false);
  }
}, [userId,BASE_URL]);

useEffect(() => {
  fetchLibrary();
}, [fetchLibrary]);

  const handleMoveShelf = async (bookId: string, newShelf: 'want' | 'reading' | 'read') => {
    if (!userId) return;

    try {
      const res = await axios.put(`${BASE_URL}/api/v1/library/moveBook/${userId}`, {
        bookId,
        shelf: newShelf,
      });

      if (res.data.success) {
        toast.success('Book moved successfully!');
        fetchLibrary();
      }
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Failed to move book');
    }
  };

  const handleUpdateProgress = async (progress: number) => {
    if (!userId || !selectedItem) return;

    try {
      const res = await axios.put(`${BASE_URL}/api/v1/library/progress/${userId}`, {
        bookId: selectedItem.book._id,
        progress,
      });

      if (res.data.success) {
        toast.success('Progress updated!');
        setShowProgressModal(false);
        setSelectedItem(null);
        fetchLibrary();
      }
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Failed to update progress');
    }
  };

  const openProgressModal = (item: LibraryItem) => {
    setSelectedItem(item);
    setShowProgressModal(true);
  };

  const getShelfLabel = (shelf: string) => {
    switch (shelf) {
      case 'want': return 'Want to Read';
      case 'reading': return 'Currently Reading';
      case 'read': return 'Read';
      default: return shelf;
    }
  };

  const getShelfColor = (shelf: string) => {
    switch (shelf) {
      case 'want': return 'bg-blue-100 text-blue-700';
      case 'reading': return 'bg-purple-100 text-purple-700';
      case 'read': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredLibrary = filter === 'all' 
    ? library 
    : library.filter(item => item.shelf === filter);

  const totalPages = Math.ceil(filteredLibrary.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLibrary.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

  <Header title='My Library' subtitle='Manage your reading collection' />

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap gap-2">
            {(['all', 'want', 'reading', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? 'All Books' : getShelfLabel(f)}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredLibrary.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No books found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start building your library by browsing books'
                : `You don't have any books in "${getShelfLabel(filter)}" yet`}
            </p>
            <Link
              href="/books"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLibrary.length)} of {filteredLibrary.length} books
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Book
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Author
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Progress
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentItems.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-16 shrink-0 rounded overflow-hidden">
                            <Image
                              src={item.book.coverImage}
                              alt={item.book.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/books/${item.book._id}`}
                              className="font-medium text-gray-900 hover:text-blue-600 transition"
                            >
                              {item.book.title}
                            </Link>
                            <p className="text-sm text-gray-500">{item.book.genre.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{item.book.author}</td>
                      <td className="px-6 py-4">
                        <select
                          value={item.shelf}
                          onChange={(e) => handleMoveShelf(item.book._id, e.target.value as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getShelfColor(item.shelf)} border-0 cursor-pointer`}
                        >
                          <option value="want">Want to Read</option>
                          <option value="reading">Reading</option>
                          <option value="read">Read</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {item.shelf === 'reading' || item.shelf === 'read' ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-30">
                              <div
                                className="h-full bg-blue-500 transition-all"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 w-12">
                              {item.progress}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/user/books/${item.book._id}`}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </Link>
                          {(item.shelf === 'reading' || item.shelf === 'read') && (
                            <button
                              onClick={() => openProgressModal(item)}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Update Progress"
                            >
                              <TrendingUp size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 mb-6">
              {currentItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-4 mb-4">
                    <div className="relative w-20 h-28 shrink-0 rounded overflow-hidden">
                      <Image
                        src={item.book.coverImage}
                        alt={item.book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/books/${item.book._id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600 transition block mb-1"
                      >
                        {item.book.title}
                      </Link>
                      <p className="text-sm text-gray-600 mb-2">{item.book.author}</p>
                      <span className="text-xs text-gray-500">{item.book.genre.name}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Status</label>
                      <select
                        value={item.shelf}
                        onChange={(e) => handleMoveShelf(item.book._id, e.target.value as any)}// eslint-disable-line @typescript-eslint/no-explicit-any
                        className={`w-full px-3 py-2 rounded-lg text-sm font-medium ${getShelfColor(item.shelf)} border-0`}
                      >
                        <option value="want">Want to Read</option>
                        <option value="reading">Reading</option>
                        <option value="read">Read</option>
                      </select>
                    </div>

                    {(item.shelf === 'reading' || item.shelf === 'read') && (
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Progress</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {item.progress}%
                          </span>
                        </div>
                        <button
                          onClick={() => openProgressModal(item)}
                          className="mt-2 w-full px-3 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition"
                        >
                          Update Progress
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && paginate(page)}
                        disabled={page === '...'}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          page === currentPage
                            ? 'bg-blue-500 text-white'
                            : page === '...'
                            ? 'bg-transparent text-gray-400 cursor-default'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Update Progress Modal */}
      {showProgressModal && selectedItem && (
        <UpdateProgressModal
          currentProgress={selectedItem.progress}
          onClose={() => {
            setShowProgressModal(false);
            setSelectedItem(null);
          }}
          onUpdate={handleUpdateProgress}
        />
      )}
    </div>
  );
}