// src/components/admin/ServiceModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaUpload, FaSave } from 'react-icons/fa';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const ServiceModal = ({ service, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    icon: 'file',
    description: '',
    fullDescription: '',
    processingTime: '',
    documents: [],
    isActive: true,
    order: 0
  });
  const [newDocument, setNewDocument] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        icon: service.icon || 'file',
        description: service.description || '',
        fullDescription: service.fullDescription || '',
        processingTime: service.processingTime || '',
        documents: service.documents || [],
        isActive: service.isActive !== undefined ? service.isActive : true,
        order: service.order || 0
      });
      if (service.image?.url) {
        setImagePreview(service.image.url);
      }
    }
  }, [service]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddDocument = () => {
    if (newDocument.trim()) {
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument.trim()]
      }));
      setNewDocument('');
    }
  };

  const handleRemoveDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image if changed
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (service?._id) {
        // Update existing service
        await adminApi.updateService(service._id, formDataToSend);
        toast.success('Service updated successfully');
      } else {
        // Create new service
        await adminApi.createService(formDataToSend);
        toast.success('Service created successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const icons = [
    { value: 'certificate', label: 'Certificate' },
    { value: 'id-card', label: 'ID Card' },
    { value: 'home', label: 'Home' },
    { value: 'money', label: 'Money' },
    { value: 'credit-card', label: 'Credit Card' },
    { value: 'file', label: 'File' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'seedling', label: 'Seedling' },
    { value: 'tractor', label: 'Tractor' },
    { value: 'car', label: 'Car' },
    { value: 'chart', label: 'Chart' },
    { value: 'shield', label: 'Shield' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {service ? 'Edit Service' : 'Create New Service'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                  placeholder="e.g., Caste Certificate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon *
                </label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                >
                  {icons.map(icon => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Processing Time *
                </label>
                <input
                  type="text"
                  name="processingTime"
                  value={formData.processingTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                  placeholder="e.g., 3-7 Working Days"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="2"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none resize-none"
                placeholder="Brief description for service card"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description *
              </label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none resize-none"
                placeholder="Detailed description for modal view"
              />
            </div>

            {/* Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Documents
              </label>
              <div className="flex mb-3">
                <input
                  type="text"
                  value={newDocument}
                  onChange={(e) => setNewDocument(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-l-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                  placeholder="Add a required document"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDocument()}
                />
                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="px-4 py-2 bg-primary-green text-white rounded-r-xl hover:bg-green-600"
                >
                  Add
                </button>
              </div>
              
              <div className="space-y-2">
                {formData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-primary-green mr-3"></span>
                      {doc}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocument(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary-green text-white rounded-xl hover:bg-green-600 transition-colors">
                    <FaUpload className="mr-2" />
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Recommended: 800x400px, JPG/PNG format
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-5 w-5 text-primary-green rounded focus:ring-primary-green"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Service is active and visible to users
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-primary-green text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
              >
                <FaSave className="mr-2" />
                {loading ? 'Saving...' : service ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;