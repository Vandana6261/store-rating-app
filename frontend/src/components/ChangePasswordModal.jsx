import React, { useState } from 'react';
import { apiFetch } from '../utils/api';

const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await apiFetch('/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify(formData)
      });
      setSuccess('Password updated successfully!');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card-glass w-full max-w-sm p-8 animate-slide-up bg-[var(--color-surface)] border-[var(--color-border)]">
        <h2 className="heading-2 text-xl mb-6">Change Password</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-200 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Current Password</label>
            <input 
              type="password" 
              className="input-field py-2"
              value={formData.currentPassword}
              onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              required 
            />
          </div>
          <div>
            <label className="label-text">New Password</label>
            <input 
              type="password" 
              className="input-field py-2"
              value={formData.newPassword}
              onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              required 
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Must contain an uppercase letter and a special character (8-20 chars).</p>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="btn-secondary flex-1 py-2 text-sm"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || success}
              className="btn-primary flex-1 py-2 text-sm"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
