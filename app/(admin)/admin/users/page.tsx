import { Suspense } from "react";
import Header from "../../_components/Header";
import GenresTableSkeleton from "../../_components/genre/GenresTableSkeleton";
import UsersTable from "../../_components/user/UsersTable";

interface User {
  _id: string;

  name: string;

  email: string;

  role: "admin" | "user";

  createdAt: string;
}

interface Pagination {
  total: number;

  page: number;

  limit: number;

  pages: number;
}

interface UsersResponse {
  success: boolean;

  data: User[];

  pagination: Pagination;
}

async function getUsers(
  page: number = 1,

  search?: string,

  role?: string
): Promise<UsersResponse> {
  const params = new URLSearchParams({ page: page.toString(), limit: "5" });

  if (search) params.append("search", search);

  if (role) params.append("role", role);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/allusers?${params}`,

    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch users");

  return res.json();
}

interface UsersPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

async function UsersList({
  currentPage,
  search,
  role,
}: {
  currentPage: number;
  search: string;
  role: string;
}) {
  const usersData = await getUsers(currentPage, search, role);

  return (
    <UsersTable
      initialData={usersData.data}
      pagination={usersData.pagination}
      currentPage={currentPage}
    />
  );
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams;

  const currentPage = Number(params.page) || 1;
  const search = (params.search as string) || "";
  const role = (params.role as string) || "";

  return (
    <div className="admin-container">
      <Header
        title="User Management"
        subtitle="Manage user accounts and permissions"
      />
     
      <Suspense
        key={currentPage + search + role}
        fallback={<GenresTableSkeleton />}
      >
        <UsersList currentPage={currentPage} search={search} role={role} />
      </Suspense>
    </div>
  );
}
