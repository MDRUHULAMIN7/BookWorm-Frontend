'use client';

import { useState, useEffect, useCallback } from 'react';
import { parseCookies } from 'nookies';
import axios from 'axios';
import { BookOpen, Clock, CheckCircle, Library } from 'lucide-react';

type Stats = {
  total: number;
  want: number;
  reading: number;
  read: number;
};

type LibraryItem = {
  shelf: 'want' | 'reading' | 'read';
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export default function LibraryStats() {
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    want: 0,
    reading: 0,
    read: 0,
  });
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  // Get user ID from cookies
  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.user) {
      const user = JSON.parse(cookies.user);
      setUserId(user._id || user.id);
    }
  }, []);

  // Fetch library stats, wrapped in useCallback for stable reference
  const fetchStats = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/library/${userId}`);
      if (res.data.success) {
        const library: LibraryItem[] = res.data.data;

        setStats({
          total: library.length,
          want: library.filter((i) => i.shelf === 'want').length,
          reading: library.filter((i) => i.shelf === 'reading').length,
          read: library.filter((i) => i.shelf === 'read').length,
        });
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId, BASE_URL]);

  // Trigger fetch when userId is set
  useEffect(() => {
    if (userId) {
      fetchStats();
    }
  }, [userId, fetchStats]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  // Stat cards
  const statCards = [
    {
      label: 'Total Books',
      value: stats.total,
      icon: Library,
      color: 'text-gray-900',
      bgColor: 'bg-gray-100',
    },
    {
      label: 'Want to Read',
      value: stats.want,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Currently Reading',
      value: stats.reading,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Finished',
      value: stats.read,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">{stat.label}</p>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={stat.color} size={20} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
