import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Public Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Dashboards
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import NormalDashboard from './pages/normal/NormalDashboard';

// Root Redirector based on Role
const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
};

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <RootRedirect /> },
      { 
        path: 'admin', 
        element: <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute> 
      },
      { 
        path: 'owner', 
        element: <ProtectedRoute allowedRoles={['STORE_OWNER']}><OwnerDashboard /></ProtectedRoute> 
      },
      { 
        path: 'stores', 
        element: <ProtectedRoute allowedRoles={['NORMAL']}><NormalDashboard /></ProtectedRoute> 
      }
    ]
  },
  { path: '*', element: <Navigate to="/" replace /> }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
