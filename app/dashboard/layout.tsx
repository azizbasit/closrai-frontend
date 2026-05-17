'use client';

import Sidebar from '@/components/Sidebar';
import { ProtectedRoute } from '@/components/AuthWrapper';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-16 items-center justify-between border-b bg-white px-8">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <div className="text-right mr-2 hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button className="rounded-full bg-gray-200 p-2 hover:bg-gray-300">
                <span className="sr-only">Notifications</span>
                <div className="h-5 w-5 rounded-full bg-gray-400"></div>
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <Button variant="outline" size="sm" onClick={() => logout()} className="ml-2">
                Logout
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
