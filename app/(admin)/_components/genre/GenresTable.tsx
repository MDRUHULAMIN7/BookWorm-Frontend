'use client';

import { useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import CreateGenreModal from './CreateGenreModal';
import EditGenreModal from './EditGenreModal';
import DeleteGenreModal from './DeleteGenreModal';

interface Genre {
  _id: string;
  name: string;
  description: string;
}

interface GenresTableProps {
  initialData: Genre[];
}

export default function GenresTable({ initialData }: GenresTableProps) {
  const [genres, setGenres] = useState<Genre[]>(initialData);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

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
  };

  const handleGenreUpdated = (updatedGenre: Genre) => {
    setGenres(
      genres.map((g) => (g._id === updatedGenre._id ? updatedGenre : g))
    );
  };

  const handleGenreDeleted = (deletedId: string) => {
    setGenres(genres.filter((g) => g._id !== deletedId));
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
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

        {/* Table */}
        <div className="custom-scrollbar overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
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
                      {index + 1}
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
        </div>
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
