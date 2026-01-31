// src/components/admin/OfferModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendar, FaTag, FaSave } from 'react-icons/fa';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const OfferModal = ({ offer, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: 10,
    discountType: 'percentage',
    validFrom: '',
    validUntil: '',
    whatsappMessage: '',
    showOnPopup: true,
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (offer) {
      setFormData({
        title: offer.title || '',
        description: offer.description || '',
        discount: offer.discount || 10,
        discountType: offer.discountType || 'percentage',
        validFrom: offer.validFrom ? new Date(offer.validFrom).toISOString().split('T')[0] : '',
        validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : '',
        whatsappMessage: offer.whatsappMessage || '',
        showOnPopup: offer.showOnPopup !== undefined ? offer.showOnPopup : true,
        isActive: offer.isActive !== undefined ? offer.isActive : true
      });
      if (offer.image?.url) {
        setImagePreview(offer.image.url);
      }
    }
  }, [offer]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Append image if changed
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (offer?._id) {
        // Update existing offer
        await adminApi.updateOffer(offer._id, formDataToSend);
        toast.success('Offer updated successfully');
      } else {
        // Create new offer
        await adminApi.createOffer(formDataToSend);
        toast.success('Offer created successfully');
      }

      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              {offer ? 'Edit Offer' : 'Create New Offer'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title and Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                placeholder="e.g., Festival Special Offer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none resize-none"
                placeholder="Describe the offer details..."
              />
            </div>

            {/* Discount */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : '99999'}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                    placeholder="e.g., 20"
                  />
                  <span className="ml-2 text-gray-600">
                    {formData.discountType === 'percentage' ? '%' : '₹'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>

            {/* Validity Period */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid From *
                </label>
                <div className="relative">
                  <FaCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valid Until *
                </label>
                <div className="relative">
                  <FaCalendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                    required
                    min={formData.validFrom}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Message Template
              </label>
              <textarea
                name="whatsappMessage"
                value={formData.whatsappMessage}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none resize-none"
                placeholder="Message template for WhatsApp when users click on offer..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Use this template for WhatsApp messages. Include {`{offer_title}`} for dynamic insertion.
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Image
              </label>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaTag size={32} />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary-green text-white rounded-xl hover:bg-green-600 transition-colors">
                    <FaTag className="mr-2" />
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

            {/* Options */}
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showOnPopup"
                  name="showOnPopup"
                  checked={formData.showOnPopup}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-primary-green rounded focus:ring-primary-green"
                />
                <label htmlFor="showOnPopup" className="ml-2 text-sm text-gray-700">
                  Show as popup on website (after 10 seconds)
                </label>
              </div>

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
                  Activate this offer
                </label>
              </div>
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
                {loading ? 'Saving...' : offer ? 'Update Offer' : 'Create Offer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferModal;