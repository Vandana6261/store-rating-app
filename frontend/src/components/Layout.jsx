import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">StoreRate</span>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden md:flex items-center gap-3 mr-4">
                  <div className="text-right">
                    <p className="text-sm font-medium leading-none mb-1">{user.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)] font-mono bg-[var(--color-bg)] px-2 py-0.5 rounded-md inline-block">
                      {user.role}
                    </p>
                  </div>
                </div>
              )}
              
              <button onClick={handleLogout} className="btn-secondary text-sm px-4 py-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-[var(--color-text-muted)]">
          &copy; {new Date().getFullYear()} StoreRate Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Layout;
