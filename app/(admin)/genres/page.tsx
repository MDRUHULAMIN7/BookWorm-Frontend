// app/genres/page.tsx
import { Suspense } from 'react';
import GenresTableSkeleton from '../_components/genre/GenresTableSkeleton';
import GenresTable from '../_components/genre/GenresTable';
interface Genre {
  _id: string;
  name: string;
  description: string;
}

interface GenresResponse {
  success: boolean;
  data: Genre[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

async function getGenres(page: number = 1): Promise<GenresResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/genre?page=${page}&limit=10`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch genres');
  }

  return res.json();
}

export default async function GenresPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const genresData = await getGenres(currentPage);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Genre Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your book genres and categories
          </p>
        </div>

        <Suspense fallback={<GenresTableSkeleton />}>
          <GenresTable
            initialData={genresData.data}
            pagination={genresData.pagination}
            currentPage={currentPage}
          />
        </Suspense>
      </div>
    </div>
  );
}