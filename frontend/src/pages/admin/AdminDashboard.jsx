import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Sorting & Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Create Store Owner State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ownerData, setOwnerData] = useState({ name: '', email: '', password: '', address: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [sortBy, sortOrder, searchTerm]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsData = await apiFetch('/admin/dashboard');
      setStats(statsData);

      const queryParams = new URLSearchParams({
        sortBy,
        order: sortOrder,
        ...(searchTerm && { search: searchTerm })
      }).toString();
      
      const usersData = await apiFetch(`/admin/users?${queryParams}`);
      setUsers(usersData);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError('');
    try {
      await apiFetch('/auth/admin/register-owner', {
        method: 'POST',
        body: JSON.stringify(ownerData)
      });
      setShowCreateModal(false);
      setOwnerData({ name: '', email: '', password: '', address: '' });
      fetchDashboardData(); // Refresh list to show new user
    } catch (err) {
      setCreateError(err.message || 'Failed to create store owner');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <div className="flex justify-between items-center">
        <h1 className="heading-1 text-3xl">Admin Dashboard</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary py-2 text-sm">
          + Create Store Owner
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass p-6 flex flex-col justify-center items-center">
          <p className="text-[var(--color-text-muted)] font-medium mb-2">Total Users</p>
          <p className="text-4xl font-bold text-[var(--color-primary)]">{stats.totalUsers}</p>
        </div>
        <div className="card-glass p-6 flex flex-col justify-center items-center">
          <p className="text-[var(--color-text-muted)] font-medium mb-2">Total Stores</p>
          <p className="text-4xl font-bold text-[var(--color-accent)]">{stats.totalStores}</p>
        </div>
        <div className="card-glass p-6 flex flex-col justify-center items-center">
          <p className="text-[var(--color-text-muted)] font-medium mb-2">Total Ratings</p>
          <p className="text-4xl font-bold text-white">{stats.totalRatings}</p>
        </div>
      </div>

      {/* Users Table Area */}
      <div className="card-glass overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="heading-2 text-xl">User Management</h2>
          <div className="w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              className="input-field py-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface)]/50 border-b border-[var(--color-border)]">
                <th 
                  className="px-6 py-4 font-semibold text-sm text-[var(--color-text-muted)] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('name')}
                >
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-4 font-semibold text-sm text-[var(--color-text-muted)] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('email')}
                >
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-4 font-semibold text-sm text-[var(--color-text-muted)] cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('role')}
                >
                  Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-muted)]">Store Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface)]/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'ADMIN' ? 'bg-red-500/20 text-red-300' :
                        user.role === 'STORE_OWNER' ? 'bg-[var(--color-primary)]/20 text-[var(--color-accent)]' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                      {user.role === 'STORE_OWNER' && user.storeName ? (
                        <div>
                          <p className="font-medium text-white">{user.storeName}</p>
                          <p>Rating: <span className="text-yellow-400 font-bold">{user.storeRating}</span> ⭐</p>
                        </div>
                      ) : (
                        <span className="opacity-50">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Store Owner Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card-glass w-full max-w-md p-8 animate-slide-up bg-slate-900 border-slate-700">
            <h2 className="heading-2 text-xl mb-6">Create Store Owner</h2>
            
            {createError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateOwner} className="space-y-4">
              <div>
                <label className="label-text">Name (Max 20 chars)</label>
                <input 
                  type="text" 
                  className="input-field py-2"
                  value={ownerData.name}
                  onChange={(e) => setOwnerData({...ownerData, name: e.target.value})}
                  required maxLength={20}
                />
              </div>
              <div>
                <label className="label-text">Email</label>
                <input 
                  type="email" 
                  className="input-field py-2"
                  value={ownerData.email}
                  onChange={(e) => setOwnerData({...ownerData, email: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="label-text">Password</label>
                <input 
                  type="password" 
                  className="input-field py-2"
                  value={ownerData.password}
                  onChange={(e) => setOwnerData({...ownerData, password: e.target.value})}
                  required 
                />
              </div>
              <div>
                <label className="label-text">Address</label>
                <textarea 
                  className="input-field py-2 min-h-[60px]"
                  value={ownerData.address}
                  onChange={(e) => setOwnerData({...ownerData, address: e.target.value})}
                  required maxLength={400}
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary flex-1 py-2 text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="btn-primary flex-1 py-2 text-sm"
                >
                  {isCreating ? 'Creating...' : 'Create Owner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
