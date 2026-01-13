import { Suspense } from "react";
import Header from "../../_components/Header";
import GenresTableSkeleton from "../../_components/genre/GenresTableSkeleton";
import GenresTable from "../../_components/genre/GenresTable";

interface Genre {
  _id: string;
  name: string;
  description: string;
}

interface GenresResponse {
  success: boolean;
  data: Genre[];
}

async function getGenres(): Promise<GenresResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/genre?limit=1000`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch genres");
  return res.json();
}

export default async function GenresPage() {
  const genresData = await getGenres();

  return (
    <div className="admin-container">
      <Header
        title="Genre Management"
        subtitle="Manage your book genres and categories"
      />

      <Suspense fallback={<GenresTableSkeleton />}>
        <GenresTable initialData={genresData.data} />
      </Suspense>
    </div>
  );
}
