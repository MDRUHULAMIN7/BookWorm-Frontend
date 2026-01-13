// app/genres/page.tsx
import { Suspense } from 'react';
import Header from '../../_components/Header';
import GenresTableSkeleton from '../../_components/genre/GenresTableSkeleton';
import GenresTable from '../../_components/genre/GenresTable';
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
    <div className="admin-container">

         <Header title='Genre Management' subtitle='Manage your book genres and categories' />
        <Suspense fallback={<GenresTableSkeleton />}>
          <GenresTable
            initialData={genresData.data}
            pagination={genresData.pagination}
            currentPage={currentPage}
          />
        </Suspense>
      
    </div>
  );
}