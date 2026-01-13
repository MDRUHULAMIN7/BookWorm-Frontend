// app/(admin)/books/_components/book/BooksClient.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Search } from 'lucide-react';
import BooksTable from './BooksTable';
import BookModal from './BookModal';
import DeleteConfirmModal from './DeleteConfirmModal';

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

type PaginationData = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

type Props = {
  initialBooks: Book[];
  genres: Genre[];
  initialPagination?: PaginationData;
};

export default function BooksClient({ initialBooks, genres, initialPagination }: Props) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData>({
    total: initialPagination?.total || 0,
    page: initialPagination?.page || 1,
    limit: initialPagination?.limit || 10,
    pages: initialPagination?.pages || 1,
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  const fetchBooks = useCallback(async (search = '', page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/book`, {
        params: { 
          search, 
          page,
          limit: pagination.limit,
        },
      });
      if (res.data.success) {
        setBooks(res.data.data);
        setPagination(res.data.pagination);
        setCurrentPage(page);
      }
    } catch (err: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, pagination.limit]);

  // Debounced search with pagination reset
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchBooks(searchQuery, 1); // Reset to page 1 when searching
      } else {
        fetchBooks('', 1); // Reset to page 1 when clearing search
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchBooks]);

  // Fetch initial data or when page changes via other means
  useEffect(() => {
    if (searchQuery === '') {
      fetchBooks('', currentPage);
    }
  }, [currentPage, fetchBooks, searchQuery]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setModalMode('edit');
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSuccess = () => {
    fetchBooks(searchQuery, currentPage);
    closeModal();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/book/${id}`);
      if (res.data.success) {
        toast.success('Book deleted successfully!');
        // If this was the last item on the page, go back a page
        if (books.length === 1 && currentPage > 1) {
          fetchBooks(searchQuery, currentPage - 1);
        } else {
          fetchBooks(searchQuery, currentPage);
        }
        setDeleteConfirm(null);
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > pagination.pages) return;
    fetchBooks(searchQuery, page);
  };

  const startIndex = (currentPage - 1) * pagination.limit + 1;
  const endIndex = Math.min(currentPage * pagination.limit, pagination.total);

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            Add Book
          </button>
        </div>
      </div>

      {/* Books Table  */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <BooksTable
          books={books}
          loading={loading}
          onEdit={openEditModal}
          onDelete={setDeleteConfirm}
        />
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
            {/* Mobile */}
            <div className="sm:hidden mb-4 text-center text-sm text-gray-600">
              Page {currentPage} of {pagination.pages}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 hidden sm:block">
                Showing {startIndex} to {endIndex} of {pagination.total} books
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 min-w-20"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {[...Array(pagination.pages)].map((_, i) => {
                    if (
                      pagination.pages <= 5 ||
                      i === 0 ||
                      i === pagination.pages - 1 ||
                      Math.abs(i + 1 - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            currentPage === i + 1
                              ? 'bg-blue-600 text-white' 
                              : 'border border-gray-300 hover:bg-gray-50'
                          } hidden sm:block`}
                        >
                          {i + 1}
                        </button>
                      );
                    } else if (i === 1 || i === pagination.pages - 2) {
                      return (
                        <span key={i + 1} className="px-2 py-1 text-gray-500 hidden sm:block">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  <div className="sm:hidden px-3 py-1 border border-gray-300 rounded-md text-sm bg-blue-600 text-white">
                    {currentPage}
                  </div>
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 min-w-20"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Book Modal */}
      {isModalOpen && (
        <BookModal
          mode={modalMode}
          book={editingBook}
          genres={genres}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <DeleteConfirmModal
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </>
  );
}