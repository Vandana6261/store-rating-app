import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const NormalDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Rating Modal State
  const [selectedStore, setSelectedStore] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchStores();
  }, [sortBy, sortOrder, searchTerm]);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        sortBy,
        order: sortOrder,
        ...(searchTerm && { search: searchTerm })
      }).toString();
      
      const data = await apiFetch(`/stores?${queryParams}`);
      setStores(data);
    } catch (err) {
      setError(err.message || 'Failed to load stores');
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

  const submitRating = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiFetch('/ratings', {
        method: 'POST',
        body: JSON.stringify({ storeId: selectedStore.id, score: Number(ratingScore) })
      });
      
      setToastMessage(`Successfully rated ${selectedStore.name} with ${ratingScore} stars!`);
      setSelectedStore(null); // Close modal
      fetchStores(); // Refresh store list to show updated average ratings
      
      setTimeout(() => setToastMessage(''), 5000); // Clear toast after 5s
    } catch (err) {
      alert(err.message || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500/90 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-md z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="heading-1 text-3xl mb-1">Browse Stores</h1>
          <p className="text-[var(--color-text-muted)]">Find and rate your favorite local stores</p>
        </div>
        
        <div className="w-full md:w-72">
          <input 
            type="text" 
            placeholder="Search stores or addresses..." 
            className="input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200">
          {error}
        </div>
      )}

      {/* Stores Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : stores.length === 0 ? (
        <div className="card-glass p-12 text-center">
          <p className="text-[var(--color-text-muted)]">No stores found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map(store => (
            <div key={store.id} className="card-glass p-6 flex flex-col h-full group hover:border-[var(--color-primary)]/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h2 className="heading-2 text-xl font-bold line-clamp-1" title={store.name}>{store.name}</h2>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 bg-[var(--color-bg)] px-2 py-1 rounded-md border border-[var(--color-border)]">
                    <span className="font-bold text-white text-sm">{store.overallRating}</span>
                    <span className="text-yellow-400 text-sm">★</span>
                  </div>
                  <span className="text-[10px] text-[var(--color-text-muted)] mt-1">({store.totalRatings} ratings)</span>
                </div>
              </div>
              
              <div className="flex-grow space-y-2 mb-6">
                <p className="text-sm text-[var(--color-text-muted)] flex items-start gap-2">
                  <span>📍</span>
                  <span className="line-clamp-2">{store.address}</span>
                </p>
              </div>

              <button 
                onClick={() => setSelectedStore(store)}
                className="btn-primary w-full py-2 text-sm mt-auto"
              >
                Rate this Store
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="card-glass w-full max-w-md p-8 animate-slide-up bg-[var(--color-surface)]">
            <h2 className="heading-2 text-xl mb-2">Rate {selectedStore.name}</h2>
            <p className="text-sm text-[var(--color-text-muted)] mb-6">
              Your rating will help others know about your experience.
            </p>

            <form onSubmit={submitRating}>
              <div className="mb-8 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingScore(star)}
                    className={`text-4xl transition-all hover:scale-110 ${
                      star <= ratingScore ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-[var(--color-border)]'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setSelectedStore(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NormalDashboard;
