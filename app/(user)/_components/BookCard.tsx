// app/(user)/books/components/BookCard.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: { _id: string; name: string };
  coverImage: string;
};

type Props = {
  book: Book;
};

export default function BookCard({ book }: Props) {
  return (
    <Link href={`/user/books/${book._id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1">
        {/* Book Cover */}
        <div className="relative h-80 bg-gray-100 overflow-hidden">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-4 left-4 right-4">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <BookOpen size={18} />
                View Details
              </button>
            </div>
          </div>
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition">
            {book.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{book.author}</p>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
            {book.genre.name}
          </span>
        </div>
      </div>
    </Link>
  );
}