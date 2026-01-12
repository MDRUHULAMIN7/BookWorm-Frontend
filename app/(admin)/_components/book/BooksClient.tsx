// app/(admin)/books/components/BooksClient.tsx
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

type Props = {
  initialBooks: Book[];
  genres: Genre[];
};

export default function BooksClient({ initialBooks, genres }: Props) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const fetchBooks = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/book`, {
        params: { search, limit: 100 },
      });
      if (res.data.success) {
        setBooks(res.data.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [BASE_URL]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== '') {
        fetchBooks(searchQuery);
      } else {
        setBooks(initialBooks);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchBooks, initialBooks]);

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
    fetchBooks(searchQuery);
    closeModal();
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/book/${id}`);
      if (res.data.success) {
        toast.success('Book deleted successfully!');
        fetchBooks(searchQuery);
        setDeleteConfirm(null);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <>
      {/* Search & Create Button */}
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

      {/* Books Table */}
      <BooksTable
        books={books} 
        loading={loading} 
        onEdit={openEditModal}
        onDelete={setDeleteConfirm}
      />

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