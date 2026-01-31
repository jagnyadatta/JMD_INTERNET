// src/pages/AdminPage.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from '../components/admin/AdminLogin';
import AdminPanel from '../components/AdminPanel';
import { useAdmin } from '../contexts/AdminContext';

const AdminPage = () => {
  const { admin, loading } = useAdmin();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!admin ? <AdminLogin /> : <Navigate to="/admin" />} 
      />
      <Route 
        path="/*" 
        element={admin ? <AdminPanel /> : <Navigate to="/admin/login" />} 
      />
    </Routes>
  );
};

export default AdminPage;
