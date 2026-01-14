"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Search, Filter, X } from "lucide-react";
import Pagination from "../../../_components/Pagination";
import BookCard from "./BookCard";

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: { _id: string; name: string };
  coverImage: string;
  avgRating?: number;
  shelvedCount?: number;
};

type Genre = {
  _id: string;
  name: string;
};

type Props = {
  initialBooks: Book[];
  initialPagination: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  genres: Genre[];
};

export default function BooksGrid({
  initialBooks,
  initialPagination,
  genres,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    searchParams.get("genres")?.split(",").filter(Boolean) || []
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "");
  const [ratingMin, setRatingMin] = useState<number>(
    parseFloat(searchParams.get("ratingMin") || "0") || 0
  );
  const [ratingMax, setRatingMax] = useState<number>(
    parseFloat(searchParams.get("ratingMax") || "5") || 5
  );
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1") || 1
  );
  const [totalPages, setTotalPages] = useState(initialPagination?.pages || 1);
  const [showFilters, setShowFilters] = useState(false);
  const limit = 10;

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    params.set("page", currentPage.toString());
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedGenres.length > 0)
      params.set("genres", selectedGenres.join(","));
    if (sortBy) params.set("sortBy", sortBy);
    if (ratingMin > 0) params.set("ratingMin", ratingMin.toString());
    if (ratingMax < 5) params.set("ratingMax", ratingMax.toString());

    router.push(`?${params.toString()}`, { scroll: false });
  }, [
    currentPage,
    searchQuery,
    selectedGenres,
    sortBy,
    ratingMin,
    ratingMax,
    router,
  ]);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        page: currentPage,
        limit,
        ratingMin,
        ratingMax,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (sortBy) params.sortBy = sortBy;
      if (selectedGenres.length > 0) params.genres = selectedGenres.join(",");
      const res = await axios.get(`${BASE_URL}/api/v1/book`, { params });

      if (res.data.success) {
        setBooks(res.data.data);
        setTotalPages(res.data.pagination?.pages || 1);
      } else {
        toast.error("Failed to fetch books");
      }
    } catch (err: any) {
      // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error("Error fetching books:", err);
      toast.error(err.response?.data?.message || "Failed to fetch books");
      setBooks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [
    BASE_URL,
    currentPage,
    searchQuery,
    sortBy,
    selectedGenres,
    ratingMin,
    ratingMax,
    limit,
  ]);

  // Fetch books and update URL
  useEffect(() => {
    updateURL();
    const timer = setTimeout(fetchBooks, 500);
    return () => clearTimeout(timer);
  }, [fetchBooks, updateURL]);

  const handleGenreToggle = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleRatingMinChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setRatingMin(0);
    } else {
      const validValue = Math.max(0, Math.min(5, numValue));
      setRatingMin(validValue);
      if (validValue > ratingMax) {
        setRatingMax(validValue);
      }
    }
    setCurrentPage(1);
  };

  const handleRatingMaxChange = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setRatingMax(5);
    } else {
      const validValue = Math.max(0, Math.min(5, numValue));
      setRatingMax(validValue);
      if (validValue < ratingMin) {
        setRatingMin(validValue);
      }
    }
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSortBy("");
    setRatingMin(0);
    setRatingMax(5);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedGenres.length > 0 || ratingMin > 0 || ratingMax < 5;

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Filter size={20} />
            <span>{showFilters ? "Hide" : "Show"} Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-white text-blue-500 rounded-full text-xs font-bold">
                {selectedGenres.length +
                  (ratingMin > 0 || ratingMax < 5 ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sort By (Default)</option>
            <option value="title">Title (A-Z)</option>
            <option value="rating">Highest Rating</option>
            <option value="mostShelved">Most Shelved</option>
          </select>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {/* Genre */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Filter by Genre</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                  >
                    <X size={16} /> Clear All Filters
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
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Filter by Rating
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Min:</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.5}
                    value={ratingMin}
                    onChange={(e) => handleRatingMinChange(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <span className="text-gray-400">to</span>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Max:</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={0.5}
                    value={ratingMax}
                    onChange={(e) => handleRatingMaxChange(e.target.value)}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <span className="text-sm text-gray-500">
                  ({ratingMin.toFixed(1)} - {ratingMax.toFixed(1)} ★)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
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
          <p className="text-sm text-gray-400 mt-2">
            Try adjusting your search or filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Clear All Filters
            </button>
          )}
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
