import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './provider'; // Assuming you have an AuthContext provider

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render the protected content if authenticated
  return children;
};

export default ProtectedRoute;
