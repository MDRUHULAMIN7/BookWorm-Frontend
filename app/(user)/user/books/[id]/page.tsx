import { Suspense } from 'react';
import BookDetailClient from '@/app/(user)/_components/BookDetailClient';
import BookDetailSkeleton from '@/app/(user)/_components/BookDetailSkeleton';

interface Genre {
  _id: string;
  name: string;
  description?: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  genre: Genre;
  coverImage: string;
  description: string;
  summary: string;
}

interface BookApiResponse {
  success: boolean;
  data: Book;
}

interface BookDetailPageProps {
  params: { id: string };
  searchParams?: Record<string, string | undefined>;
}

// Fetch book from API
async function getBook(id: string): Promise<Book | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/book/${id}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return null;

    const data: BookApiResponse = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Failed to fetch book:', error);
    return null;
  }
}

export default async function BookDetailPage({
  params,
}: BookDetailPageProps) {
  const book = await getBook(params.id);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
          <p className="text-gray-600">
            The book you&apos;re looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<BookDetailSkeleton />}>
          <BookDetailClient book={book} />
        </Suspense>
      </div>
    </div>
  );
}