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
  TrendingUp,
  User,
  ShieldCheck,
  UserCog
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Leads', href: '/dashboard/leads', icon: Users },
  { name: 'AI Agents', href: '/dashboard/agents', icon: Bot },
  { name: 'Conversations', href: '/dashboard/conversations', icon: MessageSquare },
  { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/dashboard/admin', icon: ShieldCheck },
  { name: 'User Management', href: '/dashboard/admin/users', icon: UserCog },
];

const profileNavigation = [
  { name: 'Profile', href: '/dashboard/profile', icon: User },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isSuperAdmin, isBusinessAdmin, hasPermission } = useAuthStore();
  
  const showAdminMenu = isSuperAdmin() || isBusinessAdmin();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-6">
        <span className="text-2xl font-bold text-blue-500">ClosrAI</span>
      </div>
      <nav className="flex-1 space-y-8 px-3 py-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Main Menu</p>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Admin Navigation */}
        {showAdminMenu && (
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Administration</p>
            {adminNavigation.map((item) => {
              // Only show user management if they have permission
              if (item.href.includes('users') && !hasPermission('manage_users')) {
                return null;
              }
              
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon 
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}

        {/* Profile & Settings */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Account</p>
          {profileNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon 
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
