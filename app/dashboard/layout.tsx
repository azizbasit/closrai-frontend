'use client';

import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-8">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <div className="flex items-center space-x-4">
            <button className="rounded-full bg-gray-200 p-2 hover:bg-gray-300">
              <span className="sr-only">Notifications</span>
              <div className="h-5 w-5 rounded-full bg-gray-400"></div>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-500"></div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
