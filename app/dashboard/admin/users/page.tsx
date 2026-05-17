'use client';

import { useEffect, useState } from 'react';
import { 
  Users, 
  Search,
  MoreVertical,
  Trash2,
  Shield,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  UserPlus
} from 'lucide-react';
import { v1Api } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';

export default function UserManagementPage() {
  const { isSuperAdmin, isBusinessAdmin, user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, [page, isSuperAdmin()]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let response;
      if (isSuperAdmin()) {
        response = await v1Api.admin.getUsers(page);
        setUsers(response.data.data);
        setMeta(response.data);
      } else {
        response = await v1Api.business.getUsers();
        setUsers(response.data.data);
        setMeta(null); // Business users list might not be paginated in the same way
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (role: string) => {
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      if (isSuperAdmin()) {
        await v1Api.admin.updateUser(selectedUser.id, { role });
      } else {
        await v1Api.business.updateUser(selectedUser.id, { role });
      }
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, roles: [role] } : u));
      setSelectedUser({ ...selectedUser, roles: [role] });
    } catch (error) {
      console.error('Failed to update user role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setIsUpdating(true);
    try {
      if (isSuperAdmin()) {
        await v1Api.admin.deleteUser(selectedUser.id);
      } else {
        await v1Api.business.deleteUser(selectedUser.id);
      }
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await v1Api.business.createUser(newUser);
      setUsers([...users, response.data.data]);
      setIsCreateModalOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
    } catch (error) {
      console.error('Failed to create user:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.business?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isSuperAdmin() ? 'Global User Management' : 'Team Management'}
          </h1>
          <p className="text-sm text-gray-500">
            {isSuperAdmin() ? 'Manage all registered businesses and administrators.' : `Manage users for ${currentUser?.business?.name}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 w-full md:w-64"
            />
          </div>
          {isBusinessAdmin() && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Add User
            </Button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                {isSuperAdmin() && <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Business</th>}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    {isSuperAdmin() && (
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.business?.name || 'N/A'}
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                        user.roles.includes('super-admin') ? 'bg-red-50 text-red-600' : 
                        user.roles.includes('business-admin') ? 'bg-purple-50 text-purple-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {user.roles[0]?.toUpperCase().replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                        user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'
                      }`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => { setSelectedUser(user); setIsDetailsModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedUser(user); setIsDeleteModalOpen(true); }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          disabled={user.roles.includes('super-admin') || user.id === currentUser?.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.last_page > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {meta.from} to {meta.to} of {meta.total} users
            </p>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium px-2">Page {page} of {meta.last_page}</span>
              <button 
                onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                disabled={page === meta.last_page}
                className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Name</p>
                <p className="text-sm font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                <p className="text-sm font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Role</p>
                <select 
                  className="mt-1 block w-full text-sm border-gray-200 rounded-lg"
                  value={selectedUser.roles[0]}
                  onChange={(e) => handleUpdateRole(e.target.value)}
                  disabled={isUpdating || selectedUser.id === currentUser?.id}
                >
                  {isSuperAdmin() && <option value="super-admin">Super Admin</option>}
                  <option value="business-admin">Business Admin</option>
                  <option value="user">Regular User</option>
                </select>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Status</p>
                <p className="text-sm font-medium capitalize">{selectedUser.status}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New User"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input 
            label="Full Name"
            value={newUser.name}
            onChange={(e) => setNewUser({...newUser, name: e.target.value})}
            required
          />
          <Input 
            label="Email Address"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
            required
          />
          <Input 
            label="Initial Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              className="w-full border-gray-200 rounded-xl text-sm"
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="user">Regular User</option>
              <option value="business-admin">Business Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isUpdating}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to delete <strong>{selectedUser?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser} isLoading={isUpdating}>
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
