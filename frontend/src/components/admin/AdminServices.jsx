// src/components/admin/AdminServices.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaEye, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import AdminHeader from './AdminHeader';
import ServiceModal from './ServiceModal';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await adminApi.getServices();
      setServices(data);
    } catch (error) {
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await adminApi.deleteService(id);
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        toast.error('Failed to delete service');
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await adminApi.updateServiceStatus(id, !currentStatus);
      toast.success('Service status updated');
      fetchServices();
    } catch (error) {
      toast.error('Failed to update service status');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <AdminHeader title="Services" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminHeader title="Services Management" />
      
      {/* Header Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center">
            <FaFilter className="mr-2" />
            Filter
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-primary-green text-white rounded-xl hover:bg-green-600 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div key={service._id} className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{service.title}</h3>
                <p className="text-sm text-gray-600">{service.processingTime}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handleStatusToggle(service._id, service.isActive)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {service.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div>
                Views: <span className="font-semibold">{service.meta?.views || 0}</span>
              </div>
              <div>
                Submissions: <span className="font-semibold">{service.meta?.submissions || 0}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Created: {new Date(service.createdAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSelectedService(service)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete(service._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <FaTrash />
                </button>
                <button 
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="View"
                >
                  <FaEye />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Add your first service to get started'}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <ServiceModal
          service={selectedService}
          onClose={() => {
            setShowModal(false);
            setSelectedService(null);
          }}
          onSuccess={() => {
            fetchServices();
            setShowModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminServices;
