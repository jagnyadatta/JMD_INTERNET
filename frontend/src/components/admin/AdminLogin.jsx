// src/components/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';
import { useAdmin } from '../../contexts/AdminContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Login successful!');
      navigate('/admin');
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="bg-glass-white backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold bg-gradient-to-r from-primary-green via-primary-blue to-primary-red bg-clip-text text-transparent mb-2">
            JMD INTERNET
          </div>
          <p className="text-gray-600">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
                placeholder="admin@jmdinternet.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-green to-primary-blue text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center">
            <a 
              href="/" 
              className="text-sm text-gray-600 hover:text-primary-green transition-colors"
            >
              ← Back to Home
            </a>
          </div>
        </form>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">
          <p className="text-sm text-gray-600 text-center">
            <strong>Note:</strong> This panel is for authorized personnel only.
            Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
