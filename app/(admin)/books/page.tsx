// app/(admin)/books/page.tsx
import { Suspense } from 'react';
import BooksTableSkeleton from '../_components/book/BooksTableSkeleton';
import BooksClient from '../_components/book/BooksClient';

async function getBooks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/book?limit=100`, {
      cache: 'no-store',
    });
    console.log(res)
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
}

async function getGenres() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/genre/genre-names`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return [];
  }
}

export default async function BooksPage() {
  const [initialBooks, genres] = await Promise.all([getBooks(), getGenres()]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Books</h1>
          <p className="text-gray-600">Add, edit, or remove books from your library</p>
        </div>

        <Suspense fallback={<BooksTableSkeleton />}>
          <BooksClient initialBooks={initialBooks} genres={genres} />
        </Suspense>
      </div>
    </div>
  );
}