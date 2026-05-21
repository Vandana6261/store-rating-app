import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'NORMAL' // Default to normal user for public registration
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      // Navigate to login so they can log in with their new credentials
      navigate('/login');
    } else {
      setError(result.error || 'Failed to register account');
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container flex items-center justify-center min-h-[80vh]">
      <div className="card-glass w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <h1 className="heading-2 mb-2">Create an Account</h1>
          <p className="text-[var(--color-text-muted)]">Join the Store Rating Platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label-text">Full Name (Max 20 characters)</label>
            <input
              type="text"
              name="name"
              className="input-field"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={20}
            />
          </div>

          <div>
            <label className="label-text">Email Address</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="label-text">Password</label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Must contain an uppercase letter and a special character.</p>
          </div>

          <div>
            <label className="label-text">Home Address</label>
            <textarea
              name="address"
              className="input-field min-h-[80px]"
              placeholder="123 Main Street"
              value={formData.address}
              onChange={handleChange}
              required
              maxLength={400}
            />
          </div>

          {/* Hidden Role input - we force NORMAL for public registration */}
          <input type="hidden" name="role" value="NORMAL" />

          <button 
            type="submit" 
            className="btn-primary w-full flex justify-center mt-6"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-[var(--color-text-muted)] text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-accent)] hover:text-white transition-colors">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
