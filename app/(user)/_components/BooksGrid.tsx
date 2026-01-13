
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, X } from 'lucide-react';
import Pagination from './Pagination';
import BookCard from './BookCard';

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: { _id: string; name: string };
  coverImage: string;
};

type Genre = {
  _id: string;
  name: string;
};

type Props = {
  initialBooks: Book[];
  initialPagination: any;// eslint-disable-line @typescript-eslint/no-explicit-any
  genres: Genre[];
};

export default function BooksGrid({ initialBooks, initialPagination, genres }: Props) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialPagination?.pages || 1);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {// eslint-disable-line @typescript-eslint/no-explicit-any
        page: currentPage,
        limit,
        search: searchQuery,
        sortBy,
      };

      if (selectedGenres.length > 0) {
        params.genres = selectedGenres.join(',');
      }

      const res = await axios.get(`${BASE_URL}/api/v1/book`, { params });
      if (res.data.success) {
        setBooks(res.data.data);
        setTotalPages(res.data.pagination?.pages || 1);
      }
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, currentPage, searchQuery, sortBy, selectedGenres]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchBooks();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery,fetchBooks]);

  // Fetch on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
    fetchBooks();
  }, [selectedGenres, sortBy,fetchBooks]);

  // Fetch on page change
  useEffect(() => {
    fetchBooks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage,fetchBooks]);

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy('');
    setSearchQuery('');
  };

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sort By</option>
            <option value="title">Title (A-Z)</option>
            <option value="rating">Rating</option>
            <option value="mostShelved">Most Popular</option>
          </select>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Filter size={20} />
            <span>Filters</span>
            {selectedGenres.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white text-blue-500 rounded-full text-xs font-bold">
                {selectedGenres.length}
              </span>
            )}
          </button>
        </div>

        {/* Genre Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Filter by Genre</h3>
              {selectedGenres.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <X size={16} />
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre._id}
                  onClick={() => handleGenreToggle(genre._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    selectedGenres.includes(genre._id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-80 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">No books found</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}