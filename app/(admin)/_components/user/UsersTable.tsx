'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ShieldOff, ChevronLeft, ChevronRight } from 'lucide-react';
import UpdateRoleModal from './UpdateRoleModal';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface UsersTableProps {
  initialData: User[];
  pagination: Pagination;
  currentPage: number;
}

export default function UsersTable({
  initialData,
  pagination,
  currentPage,
}: UsersTableProps) {
  const router = useRouter();

  const users = initialData;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdateRoleModalOpen, setIsUpdateRoleModalOpen] = useState(false);

  const handlePageChange = (page: number) => {
    router.push(`/admin/users?page=${page}`);
  };

const handleRoleUpdated = () => {
  setSelectedUser(null);
  setIsUpdateRoleModalOpen(false);
  router.refresh();
};






  const startIndex = (currentPage - 1) * pagination.limit;
  const endIndex = Math.min(currentPage * pagination.limit, pagination.total);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Users</h2>
          <p className="text-sm text-gray-500">
            {pagination.total} total users
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {startIndex + index + 1}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {user.role === 'admin' ? <Shield size={12} /> : <ShieldOff size={12} />}
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsUpdateRoleModalOpen(true);
                      }}
                      className={`px-3 py-1 text-xs rounded-md ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile */}
          <div className="sm:hidden divide-y">
            {users.map(user => (
              <div key={user._id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setIsUpdateRoleModalOpen(true);
                  }}
                  className="text-xs px-3 py-1 rounded bg-blue-100 text-blue-700"
                >
                  Change Role
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}–{endIndex} of {pagination.total}
            </span>

            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                disabled={currentPage === pagination.pages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 border rounded disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedUser && (
       <UpdateRoleModal
  isOpen={isUpdateRoleModalOpen}
  user={selectedUser}
  onClose={() => {
    setSelectedUser(null);
    setIsUpdateRoleModalOpen(false);
  }}
  onSuccess={handleRoleUpdated}
/>

      )}
    </>
  );
}
