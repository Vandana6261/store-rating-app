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

  useEffect(() => {
    fetchDashboardData();
  }, [sortBy, sortOrder, searchTerm]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch Stats
      const statsData = await apiFetch('/admin/dashboard');
      setStats(statsData);

      // Fetch Users with query params
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

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="heading-1 text-3xl">Admin Dashboard</h1>
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
    </div>
  );
};

export default AdminDashboard;
