// src/components/admin/AdminSidebar.jsx
import React from 'react';
import {
  FaUsers, 
  FaUpload, 
  FaGift, 
  FaSignOutAlt,
  FaChartBar,
  FaCog,
  FaHome,
  FaBullhorn
} from 'react-icons/fa';
import { MdDashboard } from "react-icons/md";
import { GrServices } from "react-icons/gr";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../contexts/AdminContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdmin();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: MdDashboard, path: '/admin' },
    { id: 'services', label: 'Services', icon: GrServices, path: '/admin/services' },
    { id: 'contacts', label: 'Contacts', icon: FaUsers, path: '/admin/contacts' },
    { id: 'notifications', label: 'Notifications', icon: FaBullhorn, path: '/admin/notifications' },
    // { id: 'uploads', label: 'Uploads', icon: FaUpload, path: '/admin/uploads' },
    { id: 'offers', label: 'Offers', icon: FaGift, path: '/admin/offers' },
    // { id: 'analytics', label: 'Analytics', icon: FaChartBar, path: '/admin/analytics' },
    { id: 'settings', label: 'Settings', icon: FaCog, path: '/admin/settings' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-glass-white backdrop-blur-lg shadow-xl">
      <div className="p-6">
        {/* Logo */}
        <div className="text-2xl font-bold bg-gradient-to-r from-primary-green via-primary-blue to-primary-red bg-clip-text text-transparent mb-8">
          JMD INTERNET
          <div className="text-sm font-normal text-gray-600 mt-1">Admin Panel</div>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-primary-green to-primary-blue text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>
        
        {/* Footer Actions */}
        <div className="absolute bottom-6 left-6 right-6 space-y-3">          
          <button
            onClick={logout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <FaSignOutAlt className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
