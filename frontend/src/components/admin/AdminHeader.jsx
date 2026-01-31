// src/components/admin/AdminHeader.jsx
import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';

const AdminHeader = ({ title, actions }) => {
  const { admin } = useAdmin();

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold">{admin?.name}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-3 bg-glass-white backdrop-blur-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
            <FaBell className="text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-green to-primary-blue flex items-center justify-center text-white font-bold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="font-semibold">{admin?.name}</p>
              <p className="text-sm text-gray-600 capitalize">{admin?.role}</p>
            </div>
          </div>
        </div>
      </div>
      
      {actions && (
        <div className="mt-4">
          {actions}
        </div>
      )}
    </header>
  );
};

export default AdminHeader;
