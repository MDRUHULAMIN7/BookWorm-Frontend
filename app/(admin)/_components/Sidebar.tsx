'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Star, 
  Video, 
  Tag,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; photo?: string } | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Genres", path: "/admin/genres", icon: Tag },
    { name: "Books", path: "/admin/books", icon: BookOpen },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Reviews", path: "/admin/reviews", icon: Star },
    { name: "Tutorials", path: "/admin/tutorial", icon: Video },
  ];

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.user) setUser(JSON.parse(cookies.user));
    if (cookies.role) setRole(cookies.role);
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    document.cookie = "user=; path=/; max-age=0";
    window.location.href = "/login";
  };

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg text-blue-400 shadow-lg hover:bg-gray-50 transition"
      >
        {sidebarOpen ?<X size={24} />: <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0   bg-black/60 bg-opacity-50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 bg-white
       
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64 flex flex-col shadow-2xl
        `}
      >
                 {/* Logo */}
          <Link href="/" className="flex items-center  gap-x-4 group mx-auto  mt-1">
            <div className="w-12 h-12  flex items-center justify-center transform group-hover:scale-110 transition">
              <Image
              src="/logo.png" 
              height={500}
              width={500}
              alt='logo'
              className='rounded-lg'
              />
            </div>
            <span className="text-xl font-bold text-blue-400">
              Admin Panel
            </span>
          </Link>

        {/* User Info Card */}
        {user && (
          <div className="p-4 mx-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  height={48}
                  width={48}
                  src={user.photo || '/default-avatar.png'}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xl truncate">{user.name}</p>
                <p className="text-xs  capitalize">{role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="mt-6 flex-1 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.name}
                href={item.path}
                className={`
                  group flex items-center gap-3 px-4 py-3 mb-1 rounded-xl
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-500 text-white shadow-lg' 
                    : 'text-gray-800 hover:bg-blue-400 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-gray-800 group-hover:text-white'} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 
                     bg-red-600 hover:bg-red-700 text-white rounded-xl 
                     transition-all duration-200 font-medium shadow-lg hover:shadow-xl
                     transform hover:scale-105"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}