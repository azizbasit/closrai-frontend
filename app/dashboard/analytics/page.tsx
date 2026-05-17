'use client';

import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Phone, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader2,
  Filter
} from 'lucide-react';
import { v1Api } from '@/lib/api';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const response = await v1Api.analytics.getData(days);
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [days]);

  if (loading && !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-sm text-gray-500">Track your AI agent performance and lead growth.</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                days === d 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users className="h-6 w-6" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900">{data?.overview?.total_leads || 0}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
              <Calendar className="h-6 w-6" />
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">Total Appointments</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900">{data?.overview?.total_appointments || 0}</p>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
            <p className="mt-1 text-2xl font-bold text-gray-900">{data?.overview?.conversion_rate || 0}%</p>
          </div>
        </div>
      </div>

      {/* Charts Section Placeholder */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Call Volume Trend</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {data?.call_volume?.length > 0 ? (
              data.call_volume.map((item: any, i: number) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div 
                    className="w-full bg-blue-500 rounded-t-md group-hover:bg-blue-600 transition-all relative"
                    style={{ height: `${Math.max((item.count / Math.max(...data.call_volume.map((v: any) => v.count))) * 100, 5)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {item.count} calls
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 truncate w-full text-center">
                    {new Date(item.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No data available for this period
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Agent Performance</h3>
          <div className="space-y-6">
            {data?.agent_performance?.length > 0 ? (
              data.agent_performance.map((agent: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">{agent.agent_name}</span>
                    <span className="text-gray-500">{agent.count} interactions</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${(agent.count / Math.max(...data.agent_performance.map((a: any) => a.count))) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-48 w-full flex items-center justify-center text-gray-400 text-sm">
                No performance data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
