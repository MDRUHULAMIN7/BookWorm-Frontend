import { Suspense } from 'react';
import BooksGridSkeleton from '../../_components/BooksGridSkeleton';
import BooksGrid from '../../_components/BooksGrid';

async function getBooks() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/book?limit=10`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data : { data: [], pagination: {} };
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return { data: [], pagination: {} };
  }
}

async function getGenres() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/genre/genre-names`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return [];
  }
}

export default async function BrowseBooksPage() {
  const [booksData, genres] = await Promise.all([getBooks(), getGenres()]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Books
          </h1>
          <p className="text-gray-600">
            Discover your next favorite book from our collection
          </p>
        </div>

        <Suspense fallback={<BooksGridSkeleton />}>
          <BooksGrid
            initialBooks={booksData.data}
            initialPagination={booksData.pagination}
            genres={genres}
          />
        </Suspense>
      </div>
    </div>
  );
}