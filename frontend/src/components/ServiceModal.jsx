import React, { useState } from 'react';
import { FaTimes, FaWhatsapp, FaUpload, FaFileAlt } from 'react-icons/fa';
import { Icon } from './IconMapper';
import axios from 'axios';
import { toast } from 'react-toastify';

const ServiceModal = ({ service, onClose }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleWhatsApp = () => {
    const message = `Hello JMD INTERNET, I want to apply ${service.title} service.`;
    const url = `https://wa.me/919556397222?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('serviceId', service.id);

      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Documents uploaded successfully!');
      setFiles([]);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-glass-white backdrop-blur-lg rounded-3xl shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-green/20 to-primary-blue/20 flex items-center justify-center mr-4">
              <Icon name={service.icon} className="text-2xl text-primary-green" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{service.title}</h2>
              <p className="text-primary-green font-semibold">Fast & Reliable Service</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Image and Description */}
            <div>
              <div className="rounded-2xl overflow-hidden mb-6">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              <div className="prose max-w-none">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Service Description</h3>
                <p className="text-gray-600 mb-4">{service.fullDescription}</p>
                <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-bold text-primary-blue mb-2 flex items-center">
                    <FaFileAlt className="mr-2" /> Processing Time
                  </h4>
                  <p className="text-gray-600">{service.processingTime}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Documents and Actions */}
            <div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Required Documents</h3>
                <ul className="space-y-3 mb-6">
                  {service.documents.map((doc, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary-green mr-3" />
                      <span className="text-gray-700">{doc}</span>
                    </li>
                  ))}
                </ul>

                {/* File Upload */}
                {/* <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Required Documents
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-green-600 transition-colors">
                      <FaUpload className="inline mr-2" />
                      Select Files
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                    </label>
                    {files.length > 0 && (
                      <span className="text-sm text-gray-600">
                        {files.length} file(s) selected
                      </span>
                    )}
                  </div>
                </div> */}

                {/* Action Buttons */}
                <div className="space-y-4">
                  {/* <button
                    onClick={handleFileUpload}
                    disabled={uploading}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-green to-primary-blue text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50"
                  >
                    <FaUpload className="mr-3" />
                    {uploading ? 'Uploading...' : 'Upload & Submit Documents'}
                  </button> */}

                  <button
                    onClick={handleWhatsApp}
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all"
                  >
                    <FaWhatsapp className="mr-3" size={20} />
                    Contact on WhatsApp
                  </button>
                </div>

                {/* Note */}
                <div className="mt-6 p-4 bg-yellow-50/50 rounded-xl border border-yellow-100">
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> All documents are securely uploaded to our cloud storage. 
                    Your data is protected with end-to-end encryption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
