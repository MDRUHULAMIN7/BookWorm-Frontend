// app/users/page.tsx
import { Suspense } from 'react';
import Header from '../../_components/Header';
import GenresTableSkeleton from '../../_components/genre/GenresTableSkeleton';
import UsersTable from '../../_components/user/UsersTable';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

async function getUsers(page: number = 1, search?: string, role?: string): Promise<UsersResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '5'
  });
  
  if (search) params.append('search', search);
  if (role) params.append('role', role);
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/allusers?${params}`,
    {
      cache: 'no-store',
    }
  );
 
  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return res.json();
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; role?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const role = searchParams.role || '';
  
  const usersData = await getUsers(currentPage, search, role);
  return (
    <div className="admin-container">
      <Header 
        title='User Management' 
        subtitle='Manage user accounts and permissions' 
      />
      <Suspense fallback={<GenresTableSkeleton />}>
        <UsersTable
          initialData={usersData.data}
          pagination={usersData.pagination}
          currentPage={currentPage}
        />
      </Suspense>
    </div>
  );
}