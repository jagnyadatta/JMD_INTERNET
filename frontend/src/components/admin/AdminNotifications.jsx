// src/components/admin/AdminNotifications.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({
    text: '',
    whatsappMessage: 'Hello! I want to know more about this offer.',
    priority: 1,
    isActive: true
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await adminApi.getAllNotifications();
      setNotifications(data.data);
    } catch (error) {
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingNotification) {
        await adminApi.updateNotification(editingNotification._id, formData);
        toast.success('Notification updated successfully');
      } else {
        await adminApi.createNotification(formData);
        toast.success('Notification created successfully');
      }
      
      setShowForm(false);
      setEditingNotification(null);
      setFormData({
        text: '',
        whatsappMessage: 'Hello! I want to know more about this offer.',
        priority: 1,
        isActive: true
      });
      
      fetchNotifications();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await adminApi.deleteNotification(id);
        toast.success('Notification deleted successfully');
        fetchNotifications();
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await adminApi.updateNotification(id, { isActive: !currentStatus });
      toast.success(`Notification ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notification Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Notification
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Text</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Priority</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <tr key={notification._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="max-w-md">
                    <p className="text-gray-700">{notification.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.startDate).toLocaleDateString()} - {new Date(notification.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    notification.priority === 1 ? 'bg-blue-100 text-blue-800' :
                    notification.priority === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    Priority {notification.priority}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleStatus(notification._id, notification.isActive)}
                    className={`flex items-center ${notification.isActive ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {notification.isActive ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingNotification(notification);
                        setFormData({
                          text: notification.text,
                          whatsappMessage: notification.whatsappMessage,
                          priority: notification.priority,
                          isActive: notification.isActive
                        });
                        setShowForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {editingNotification ? 'Edit Notification' : 'Add New Notification'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notification Text *
                </label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                  placeholder="Enter notification text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp Message
                </label>
                <textarea
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData({...formData, whatsappMessage: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none"
                  placeholder="Message when user clicks"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                >
                  <option value="1">Low (Blue)</option>
                  <option value="2">Medium (Orange)</option>
                  <option value="3">High (Red)</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="h-5 w-5 text-green-500 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Active
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingNotification(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                >
                  {editingNotification ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;
