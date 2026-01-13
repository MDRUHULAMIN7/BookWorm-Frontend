'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Review, PaginationMeta } from '../_types/review.types';

export const useReviews = (apiUrl: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrl);
      if (res.data.success) {
        setReviews(res.data.data);
        setMeta(res.data.meta);
      }
    } catch {
      toast.error('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, setReviews, loading, meta, setMeta, refetch: fetchReviews };
};
