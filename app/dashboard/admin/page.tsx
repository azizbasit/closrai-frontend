'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  Bot, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  Loader2,
  ArrowRight,
  UserPlus
} from 'lucide-react';
import { v1Api } from '@/lib/api';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await v1Api.admin.getStats();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: data?.stats?.total_users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Agents', value: data?.stats?.total_agents, icon: Bot, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Total Leads', value: data?.stats?.total_leads, icon: UserPlus, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Conversations', value: data?.stats?.total_conversations, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Appointments', value: data?.stats?.total_appointments, icon: Calendar, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Global overview of all businesses and activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value?.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Registrations</h3>
            <Link href="/dashboard/admin/users" className="text-blue-600 text-sm font-bold flex items-center hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {data?.recent_users?.map((user: any) => (
              <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                    user.role === 'super_admin' ? 'bg-red-50 text-red-600' : 
                    user.role === 'admin' ? 'bg-purple-50 text-purple-600' : 
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {user.role.replace('_', ' ').toUpperCase()}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Joined {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Activity Chart (Placeholder) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6">Global Activity</h3>
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-50 rounded-xl">
            <TrendingUp className="h-12 w-12 mb-2 opacity-20" />
            <p className="text-sm">Activity analytics coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
