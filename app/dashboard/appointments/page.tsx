'use client';

import { useEffect, useState } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { appointmentsApi } from '@/lib/api';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await appointmentsApi.getAll();
        setAppointments(response.data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Calendar Sidebar Placeholder */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl bg-white border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex space-x-2">
                <button className="p-1 rounded-md hover:bg-gray-100 text-gray-400">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="p-1 rounded-md hover:bg-gray-100 text-gray-400">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Minimal Calendar UI Placeholder */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="font-bold text-gray-400">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm">
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isToday = day === new Date().getDate();
                return (
                  <div key={i} className={`py-2 rounded-lg cursor-pointer transition-colors ${
                    isToday ? 'bg-blue-600 text-white font-bold' : 'hover:bg-gray-50 text-gray-700'
                  }`}>
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-100 p-6">
            <h4 className="font-bold text-blue-900 mb-2">Calendar Sync</h4>
            <p className="text-sm text-blue-700 mb-4">Your Google Calendar is synced. AI will only book slots when you're available.</p>
            <button className="text-sm font-bold text-blue-600 hover:text-blue-800 underline">
              Manage Integration
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-900">Scheduled Events</h3>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button className="px-3 py-1 text-xs font-bold rounded-md bg-white text-gray-900 shadow-sm">Upcoming</button>
              <button className="px-3 py-1 text-xs font-bold rounded-md text-gray-500 hover:text-gray-900">Past</button>
            </div>
          </div>

          <div className="space-y-3">
            {appointments.length > 0 ? (
              appointments.map((apt) => (
                <div key={apt.id} className="group rounded-xl bg-white border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-600">
                        <CalendarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{apt.title}</h4>
                        <p className="text-xs text-gray-500">
                          with {apt.lead?.first_name} {apt.lead?.last_name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {new Date(apt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Video className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {new Date(apt.start_time).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg group-hover:bg-gray-50 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
                <p className="text-sm text-gray-500">No scheduled appointments found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

