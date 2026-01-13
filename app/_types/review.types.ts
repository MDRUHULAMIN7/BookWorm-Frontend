export interface User {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  coverImage?: string;
}

export interface Review {
  _id: string;
  userId: User;
  bookId: Book;
  rating: number;
  comment: string;
  status: 'pending' | 'approved';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse {
  success: boolean;
  data: Review[];
  meta: PaginationMeta;
}

export interface DeleteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reviewTitle: string;
  userName: string;
}

export interface ReviewStatusBadgeProps {
  review: {
    _id: string;
    status: 'pending' | 'approved';
  };
  updatingId: string | null;
  onStatusUpdate: (reviewId: string, newStatus: 'pending' | 'approved') => void;
}

export interface ReviewsTableProps {
  reviews: Review[];
  updatingId: string | null;
  onStatusUpdate: (reviewId: string, newStatus: 'pending' | 'approved') => void;
  onDeleteClick: (reviewId: string, reviewTitle: string, userName: string) => void;
}
