"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BooksGrid from "./_components/BooksGrid";

export default function BrowseBooksPage() {
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  useEffect(() => {
    async function fetchGenres() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/genre/genre-names`
        );
        if (res.data.success) {
          setGenres(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setLoadingGenres(false);
      }
    }
    fetchGenres();
  }, []);

  if (loadingGenres) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Browse Books
            </h1>
            <p className="text-gray-600">Loading...</p>
          </div>
       
      </div>
    );
  }

  return (
      <div className="admin-container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Browse Books
          </h1>
          <p className="text-gray-600">
            Discover your next favorite book from our collection
          </p>
        </div>

        <BooksGrid
          initialBooks={[]}
          initialPagination={{ pages: 1 }}
          genres={genres}
        />
      </div>
  
  );
}
