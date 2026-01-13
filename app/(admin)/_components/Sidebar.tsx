'use client'; // make this a client component

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Genres", path: "/admin/genres" },
    { name: "Books", path: "/admin/books" },
    { name: "Users", path: "/admin/users" },
    { name: "Reviews", path: "/admin/reviews" },
    { name: "Tutorials", path: "/admin/tutorials" },
  ];

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-16"
      } flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className={`font-bold text-lg ${!sidebarOpen ? "hidden" : ""}`}>
          Admin
        </h1>
        <button
          className="text-gray-500 hover:text-gray-800"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "⏴" : "⏵"}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 flex-1 flex flex-col">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center px-4 py-2 hover:bg-gray-200 transition ${
              pathname === item.path ? "bg-gray-200 font-semibold rounded-lg mx-2" : "rounded-lg mx-2"
            }`}
          >
            <span className={`${!sidebarOpen ? "hidden" : ""}`}>{item.name}</span>
            {!sidebarOpen && <span className="text-sm">{item.name.charAt(0)}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto mb-4 mx-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
      >
        {sidebarOpen ? "Logout" : "⎋"}
      </button>
    </aside>
  );
}
