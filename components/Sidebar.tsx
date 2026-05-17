'use strict';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Bot, 
  MessageSquare, 
  Calendar, 
  Settings,
  TrendingUp
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'AI Agents', href: '/dashboard/agents', icon: Bot },
  { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6">
        <span className="text-2xl font-bold text-blue-500">ClosrAI</span>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-gray-800 text-blue-400' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon 
                className={`mr-3 h-5 w-5 flex-shrink-0 ${
                  isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
