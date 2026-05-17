'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { dashboardApi } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardApi.getStats();
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
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
    { name: 'Total Leads', value: data?.total_leads || 0, change: '+0%', changeType: 'increase', icon: Users },
    { name: 'AI Conversations', value: data?.total_conversations || 0, change: '+0%', changeType: 'increase', icon: MessageSquare },
    { name: 'Appointments', value: data?.total_appointments || 0, change: '+0%', changeType: 'increase', icon: Calendar },
    { name: 'Conversion Rate', value: '0%', change: '+0%', changeType: 'increase', icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
                {stat.changeType === 'increase' ? (
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="ml-1 h-4 w-4" />
                )}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leads</h3>
          <div className="space-y-4">
            {data?.recent_leads?.length > 0 ? (
              data.recent_leads.map((lead: any) => (
                <div key={lead.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                      {lead.first_name?.[0] || 'L'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.first_name} {lead.last_name}</p>
                      <p className="text-xs text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${
                    lead.status === 'qualified' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-700 border-gray-100'
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No recent leads</p>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            {data?.upcoming_appointments?.length > 0 ? (
              data.upcoming_appointments.map((appointment: any) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                      <span className="text-[10px] font-bold uppercase">
                        {new Date(appointment.start_time).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-sm font-bold">
                        {new Date(appointment.start_time).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{appointment.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(appointment.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    View
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

