
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Filter } from 'lucide-react';
import ReviewsTable from '../../_components/review/ReviewsTable';
import ReviewPagination from '../../_components/review/ReviewPagination';
import DeleteReviewModal from '../../_components/review/DeleteReviewModal';
import { ApiResponse, PaginationMeta, Review } from '@/app/_types/review.types';
import Header from '../../_components/Header';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status', color: 'gray' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'approved', label: 'Approved', color: 'green' },
] as const;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
] as const;

export default function ReviewPage() {
  // State Management
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    reviewId: string | null;
    reviewTitle: string;
    userName: string;
  }>({
    isOpen: false,
    reviewId: null,
    reviewTitle: '',
    userName: '',
  });

  // Filters & Pagination
  const [filters, setFilters] = useState({
    status: 'all' as 'all' | 'pending' | 'approved',
    sort: 'newest' as 'newest' | 'oldest',
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

  const apiUrl = useMemo(() => {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    });

    if (filters.status !== 'all') {
      params.append('status', filters.status);
    }

    // Add sorting
    const sortOrder = filters.sort === 'newest' ? '-createdAt' : 'createdAt';
    params.append('sort', sortOrder);

    return `${BASE_URL}/api/v1/review?${params.toString()}`;
  }, [BASE_URL, pagination.page, pagination.limit, filters.status, filters.sort]);

  // Fetch reviews with error handling
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(apiUrl);

      if (response.data.success) {
        setReviews(response.data.data);
        setMeta(response.data.meta);
      } else {
        throw new Error('Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleStatusUpdate = async (reviewId: string, newStatus: 'pending' | 'approved') => {
    setUpdatingId(reviewId);
    try {
      const response = await axios.patch(`${BASE_URL}/api/v1/review/status`, {
        reviewId,
        status: newStatus,
      });

      if (response.data.success) {
        toast.success(`Review ${newStatus === 'approved' ? 'approved' : 'set to pending'}`);
        setReviews(prev =>
          prev.map(review =>
            review._id === reviewId
              ? { ...review, status: newStatus }
              : review
          )
        );
      }
    } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (reviewId: string, reviewTitle: string, userName: string) => {
    setDeleteModal({
      isOpen: true,
      reviewId,
      reviewTitle,
      userName,
    });
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      reviewId: null,
      reviewTitle: '',
      userName: '',
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.reviewId) return;

    try {
      const response = await axios.delete(`${BASE_URL}/api/v1/review/${deleteModal.reviewId}`);

      if (response.data.success) {
        toast.success('Review deleted successfully');
        setReviews(prev => prev.filter(review => review._id !== deleteModal.reviewId));
        // Update meta
        setMeta(prev => ({
          ...prev,
          total: prev.total - 1,
          totalPages: Math.ceil((prev.total - 1) / prev.limit),
        }));
        closeDeleteModal();
      }
    } catch (error: any) {// eslint-disable-line @typescript-eslint/no-explicit-any
      console.error('Error deleting review:', error);
      toast.error(error.response?.data?.message || 'Failed to delete review');
    }
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Filter handlers
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && reviews.length === 0) {
    return (
      <div className="admin-container">
        <div className=" mx-auto">
          <div className="animate-pulse">
            <div className="h-8  rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="mx-auto">

        <Header title='Reviews Management' subtitle=' Manage and moderate user reviews '/>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reviews Table */}
        <ReviewsTable
          reviews={reviews}
          updatingId={updatingId}
          onStatusUpdate={handleStatusUpdate}
          onDeleteClick={openDeleteModal}
        />

        {/* Pagination */}
        {reviews.length > 0 && (
          <ReviewPagination
            meta={meta}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>

      {/* Delete  Modal */}
      <DeleteReviewModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        reviewTitle={deleteModal.reviewTitle}
        userName={deleteModal.userName}
      />
    </div>
  );
}