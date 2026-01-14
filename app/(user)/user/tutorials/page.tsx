
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '@/app/(admin)/_components/Header';

interface Tutorial {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  createdAt: string;
}


export default function TutorialPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // number of tutorials per page

  const fetchTutorials = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/tutorial?page=${page}&limit=${limit}`
      );

      if (res.data.success) {
        setTutorials(res.data.data);
        setTotalPages(res.data.pagination.pages || 1);
      }
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      toast.error(error.response?.data?.message || 'Failed to fetch tutorials');
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
    <div className="admin-container">

      <Header title='Tutorials' subtitle='Tutorials for you'/>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>
          ))}
        </div>
      ) : tutorials.length === 0 ? (
        <div className="text-center text-gray-500 py-20">
          No tutorials found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <div key={tutorial._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative pb-[56.25%]">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={tutorial.videoUrl}
                    title={tutorial.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">{tutorial.title}</h2>
                  {tutorial.description && (
                    <p className="text-sm text-gray-600 mt-2">{tutorial.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Uploaded on {new Date(tutorial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
