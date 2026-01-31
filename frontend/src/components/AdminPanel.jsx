// src/components/AdminPanel.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from './admin/AdminSidebar';
import AdminDashboard from './admin/AdminDashboard';
import AdminServices from './admin/AdminServices';
import AdminContacts from './admin/AdminContacts';
import AdminUploads from './admin/AdminUploads';
import AdminOffers from './admin/AdminOffers';

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/services" element={<AdminServices />} />
          <Route path="/contacts" element={<AdminContacts />} />
          <Route path="/uploads" element={<AdminUploads />} />
          <Route path="/offers" element={<AdminOffers />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;