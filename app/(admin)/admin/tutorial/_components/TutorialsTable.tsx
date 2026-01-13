"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import CreateTutorialModal from "./CreateTutorialModal";
import EditTutorialModal from "./EditTutorialModal";
import DeleteTutorialModal from "./DeleteTutorialModal";

interface Tutorial {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  createdAt: string;
}

export default function TutorialsTable() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(
    null
  );

  const limit = 10;

  const fetchTutorials = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tutorial?page=${page}&limit=${limit}`
      );
      if (res.data.success) {
        setTutorials(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(err.response?.data?.message || "Failed to fetch tutorials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Tutorials</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Tutorial
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                #
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Title
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                Created At
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              [...Array(limit)].map((_, i) => (
                <tr key={i}>
                  <td
                    colSpan={5}
                    className="px-4 py-4 animate-pulse bg-gray-200 h-10"
                  ></td>
                </tr>
              ))
            ) : tutorials.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                  No tutorials found.
                </td>
              </tr>
            ) : (
              tutorials.map((tutorial, i) => (
                <tr key={tutorial._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-sm">
                    {(currentPage - 1) * limit + i + 1}
                  </td>
                  <td className="px-4 py-2 text-sm">{tutorial.title}</td>

                  <td className="px-4 py-2 text-sm">
                    {new Date(tutorial.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right text-sm flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedTutorial(tutorial);
                        setShowEditModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Pencil size={16} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTutorial(tutorial);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTutorialModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchTutorials(currentPage);
          }}
        />
      )}
      {showEditModal && selectedTutorial && (
        <EditTutorialModal
          tutorial={selectedTutorial}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTutorial(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedTutorial(null);
            fetchTutorials(currentPage);
          }}
        />
      )}
      {showDeleteModal && selectedTutorial && (
        <DeleteTutorialModal
          tutorial={selectedTutorial}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedTutorial(null);
          }}
          onSuccess={() => {
            setShowDeleteModal(false);
            setSelectedTutorial(null);
            fetchTutorials(currentPage);
          }}
        />
      )}
    </div>
  );
}
