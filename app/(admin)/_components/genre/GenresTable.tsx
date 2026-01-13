
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus } from 'lucide-react';
import CreateGenreModal from './CreateGenreModal';
import EditGenreModal from './EditGenreModal';
import DeleteGenreModal from './DeleteGenreModal';

interface Genre {
  _id: string;
  name: string;
  description: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface GenresTableProps {
  initialData: Genre[];
  pagination: Pagination;
  currentPage: number;
}

export default function GenresTable({
  initialData,
  pagination,
  currentPage,
}: GenresTableProps) {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>(initialData);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  const handlePageChange = (page: number) => {
    router.push(`/genres?page=${page}&limit=${pagination.limit}`);
  };

  const handleEditClick = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (genre: Genre) => {
    setSelectedGenre(genre);
    setIsDeleteModalOpen(true);
  };

  const handleGenreCreated = (newGenre: Genre) => {
    setGenres([newGenre, ...genres]);
    router.refresh();
  };

  const handleGenreUpdated = (updatedGenre: Genre) => {
    setGenres(
      genres.map((g) => (g._id === updatedGenre._id ? updatedGenre : g))
    );
    router.refresh();
  };

  const handleGenreDeleted = (deletedId: string) => {
    setGenres(genres.filter((g) => g._id !== deletedId));
    router.refresh();
  };

  // Calculate start and end numbers based on actual limit
  const startIndex = (currentPage - 1) * pagination.limit;
  const endIndex = Math.min(currentPage * pagination.limit, pagination.total);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header - Responsive */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">All Genres</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 transition w-full sm:w-auto"
          >
            <Plus size={20} />
            Create Genre
          </button>
        </div>

        {/* Table Container with Custom Scrollbar */}
        <div className="custom-scrollbar overflow-x-auto">
          {/* Desktop Table */}
          <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre Name
                </th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {genres.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 sm:px-6 py-8 text-center text-gray-500">
                    No genres found. Create your first genre!
                  </td>
                </tr>
              ) : (
                genres.map((genre, index) => (
                  <tr key={genre._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {genre.name}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(genre)}
                        className="text-blue-600 hover:text-blue-800 mr-4 inline-flex items-center gap-1"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(genre)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className="sm:hidden divide-y divide-gray-200">
            {genres.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No genres found. Create your first genre!
              </div>
            ) : (
              genres.map((genre, index) => (
                <div key={genre._id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500">#{startIndex + index + 1}</span>
                        <h3 className="text-sm font-medium text-gray-900">
                          {genre.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEditClick(genre)}
                        className="text-blue-600 hover:text-blue-800"
                        aria-label={`Edit ${genre.name}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(genre)}
                        className="text-red-600 hover:text-red-800"
                        aria-label={`Delete ${genre.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination - Responsive */}
        {pagination.pages > 1 && (
          <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
            {/* Mobile pagination info */}
            <div className="sm:hidden mb-4 text-center text-sm text-gray-600">
              Page {currentPage} of {pagination.pages}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 hidden sm:block">
                Showing {startIndex + 1} to {endIndex} of {pagination.total} genres
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 min-w-20"
                >
                  Previous
                </button>
                {/* Show limited page buttons on mobile */}
                <div className="flex gap-1">
                  {[...Array(pagination.pages)].map((_, i) => {
                    // Show only first, last, current, and adjacent pages on mobile
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
                              ? 'bg-green-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          } hidden sm:block`}
                        >
                          {i + 1}
                        </button>
                      );
                    } else if (i === 1 || i === pagination.pages - 2) {
                      // Show ellipsis on mobile for hidden pages
                      return (
                        <span key={i + 1} className="px-2 py-1 text-gray-500 hidden sm:block">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  
                  {/* Mobile page indicator */}
                  <div className="sm:hidden px-3 py-1 border border-gray-300 rounded-md text-sm bg-green-600 text-white">
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

      {/* Modals */}
      <CreateGenreModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleGenreCreated}
      />

      {selectedGenre && (
        <>
          <EditGenreModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedGenre(null);
            }}
            genre={selectedGenre}
            onSuccess={handleGenreUpdated}
          />

          <DeleteGenreModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedGenre(null);
            }}
            genre={selectedGenre}
            onSuccess={handleGenreDeleted}
          />
        </>
      )}
    </>
  );
}