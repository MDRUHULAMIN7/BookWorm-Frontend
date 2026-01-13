import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50] as const;

export default function ReviewPagination({ meta, onPageChange, onLimitChange }: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (meta.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= meta.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (meta.page <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (meta.page >= meta.totalPages - 2) {
        // Show last 5 pages
        for (let i = meta.totalPages - 4; i <= meta.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show pages around current page
        for (let i = meta.page - 2; i <= meta.page + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className="border-t border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Items per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={meta.limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">of {meta.total} reviews</span>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(meta.page - 1)}
            disabled={meta.page === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {renderPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 rounded-lg ${
                  meta.page === pageNum
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(meta.page + 1)}
            disabled={meta.page === meta.totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Page info */}
        <div className="text-sm text-gray-600">
          Page {meta.page} of {meta.totalPages}
        </div>
      </div>
    </div>
  );
}