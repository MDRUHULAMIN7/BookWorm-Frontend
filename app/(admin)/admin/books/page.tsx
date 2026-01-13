// app/(admin)/books/page.tsx
import { Suspense } from 'react';
import Header from '../../_components/Header';
import BooksTableSkeleton from '../../_components/book/BooksTableSkeleton';
import BooksClient from '../../_components/book/BooksClient';
async function getBooks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/book?limit=10`, {
      cache: 'no-store',
    });
    if (!res.ok) return { books: [], pagination: null };
    const data = await res.json();
    return {
      books: data.success ? data.data : [],
      pagination: data.success ? data.pagination : null
    };
  } catch (error) {
    console.error('Failed to fetch books:', error);
    return { books: [], pagination: null };
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
  const [{ books, pagination }, genres] = await Promise.all([getBooks(), getGenres()]);

  return (
    <div className="admin-container">
      <Header title='Books Management' subtitle='Manage books (add, edit and delete)' />
      <Suspense fallback={<BooksTableSkeleton />}>
        <BooksClient 
          initialBooks={books} 
          genres={genres} 
          initialPagination={pagination}
        />
      </Suspense>
    </div>
  );
}