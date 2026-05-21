import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Setup Store State
  const [storeData, setStoreData] = useState({ name: '', email: '', address: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiFetch('/store-owner/dashboard');
        setDashboardData(data);
      } catch (err) {
        setError(err.message || 'Failed to load store dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError('');
    try {
      await apiFetch('/stores', {
        method: 'POST',
        body: JSON.stringify(storeData)
      });
      // Store created successfully! Refresh dashboard data
      const data = await apiFetch('/store-owner/dashboard');
      setDashboardData(data);
    } catch (err) {
      setCreateError(err.message || 'Failed to setup store');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="text-center">
          <h1 className="heading-1 text-3xl mb-2">Setup Your Store</h1>
          <p className="text-[var(--color-text-muted)]">
            Welcome to the platform! Please enter your store details below to start receiving ratings.
          </p>
        </div>

        <div className="card-glass p-8">
          {createError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
              {createError}
            </div>
          )}

          <form onSubmit={handleCreateStore} className="space-y-5">
            <div>
              <label className="label-text">Store Name</label>
              <input 
                type="text" 
                className="input-field"
                placeholder="My Awesome Store"
                value={storeData.name}
                onChange={(e) => setStoreData({...storeData, name: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="label-text">Store Contact Email</label>
              <input 
                type="email" 
                className="input-field"
                placeholder="store@example.com"
                value={storeData.email}
                onChange={(e) => setStoreData({...storeData, email: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="label-text">Physical Address</label>
              <textarea 
                className="input-field min-h-[100px]"
                placeholder="123 Commerce St..."
                value={storeData.address}
                onChange={(e) => setStoreData({...storeData, address: e.target.value})}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isCreating}
              className="btn-primary w-full py-3 mt-4"
            >
              {isCreating ? 'Setting up...' : 'Create My Store'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="heading-1 text-3xl mb-1">{dashboardData.storeName}</h1>
          <p className="text-[var(--color-text-muted)]">Store Owner Dashboard</p>
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-glass p-8 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-[var(--color-primary)]/20 rounded-full blur-3xl"></div>
          <p className="text-[var(--color-text-muted)] font-medium mb-2 z-10">Average Rating</p>
          <div className="flex items-center gap-2 z-10">
            <p className="text-6xl font-bold text-white">{dashboardData.averageRating}</p>
            <span className="text-4xl text-yellow-400">★</span>
          </div>
        </div>
        <div className="card-glass p-8 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute -left-4 -bottom-4 w-32 h-32 bg-[var(--color-accent)]/20 rounded-full blur-3xl"></div>
          <p className="text-[var(--color-text-muted)] font-medium mb-2 z-10">Total Ratings Received</p>
          <p className="text-6xl font-bold text-[var(--color-accent)] z-10">{dashboardData.totalRatings}</p>
        </div>
      </div>

      {/* Raters Table */}
      <div className="card-glass overflow-hidden">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="heading-2 text-xl">Recent Ratings</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-surface)]/50 border-b border-[var(--color-border)]">
                <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-muted)]">User Name</th>
                <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-muted)]">Email</th>
                <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-muted)]">Rating Given</th>
                <th className="px-6 py-4 font-semibold text-sm text-[var(--color-text-muted)]">Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.raters.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[var(--color-text-muted)]">
                    No ratings received yet.
                  </td>
                </tr>
              ) : (
                dashboardData.raters.map((rater, index) => (
                  <tr key={index} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-surface)]/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{rater.name}</td>
                    <td className="px-6 py-4 text-[var(--color-text-muted)]">{rater.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[var(--color-primary)]">{rater.scoreSubmitted}</span>
                        <span className="text-yellow-400">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                      {new Date(rater.dateSubmitted).toLocaleDateString()}
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

export default OwnerDashboard;
