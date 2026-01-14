"use client"

import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BookOpen, Users, MessageSquare, Clock, TrendingUp, Star } from 'lucide-react';

const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

interface DashboardStats {
  overview: {
    totalBooks: number;
    totalUsers: number;
    totalReviews: number;
    pendingReviews: number;
    recentUsers: number;
  };
  charts: {
    booksPerGenre: Array<{ genre: string; count: number }>;
    monthlyBooks: Array<{ month: string; count: number }>;
    shelfDistribution: Array<{ shelf: string; count: number }>;
    userRoles: Array<{ role: string; count: number }>;
    topRatedBooks: Array<{ title: string; avgRating: number; totalReviews: number }>;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/recommendation`);

      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const result = await response.json();
      setStats(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      icon: BookOpen,
      label: 'Total Books',
      value: stats.overview.totalBooks,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
    },
    {
      icon: Users,
      label: 'Total Users',
      value: stats.overview.totalUsers,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
    },
    {
      icon: MessageSquare,
      label: 'Total Reviews',
      value: stats.overview.totalReviews,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
    },
    {
      icon: Clock,
      label: 'Pending Reviews',
      value: stats.overview.pendingReviews,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
    },
    {
      icon: TrendingUp,
      label: 'New Users (7 Days)',
      value: stats.overview.recentUsers,
      color: 'bg-pink-500',
      bgLight: 'bg-pink-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <div key={idx} className={`${stat.bgLight} rounded-lg p-6 shadow-sm border border-gray-200`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-8 h-8 ${stat.color} text-white p-1.5 rounded-lg`} />
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Books Per Genre - Pie Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Books Per Genre</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.charts.booksPerGenre}
                  dataKey="count"
                  nameKey="genre"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.charts.booksPerGenre.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Books Added - Line Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Books Added (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.charts.monthlyBooks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} name="Books" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Shelf Distribution - Bar Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Library Shelf Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.charts.shelfDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shelf" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Books" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* User Roles - Pie Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Role Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.charts.userRoles}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {stats.charts.userRoles.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Rated Books */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Top Rated Books
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Book Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Average Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total Reviews</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.charts.topRatedBooks.map((book, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-600">#{idx + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{book.title}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-semibold text-gray-800">{book.avgRating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{book.totalReviews} reviews</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}