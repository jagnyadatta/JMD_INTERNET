// src/components/admin/AdminUploads.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaFile, 
  FaDownload, 
  FaCheck, 
  FaTimes, 
  FaEye,
  FaSearch,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import AdminHeader from './AdminHeader';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const AdminUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const data = await adminApi.getUploads();
      setUploads(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch uploads');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminApi.updateUploadStatus(id, { status });
      toast.success(`Upload marked as ${status}`);
      fetchUploads();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = 
      upload.serviceId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      upload.userId.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || upload.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'processing': return <FaClock className="text-blue-500" />;
      case 'completed': return <FaCheckCircle className="text-green-500" />;
      case 'rejected': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="p-8">
        <AdminHeader title="Document Uploads" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminHeader title="Document Uploads" />
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search uploads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center">
            <FaFilter className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Uploads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUploads.map(upload => (
          <div key={upload._id} className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {upload.serviceId?.title || 'Unknown Service'}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <span className="mr-4">User ID: {upload.userId.substring(0, 8)}...</span>
                  <span>{upload.files.length} files</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(upload.status)}
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(upload.status)}`}>
                  {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                </span>
              </div>
            </div>
            
            {/* Files List */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Uploaded Files:</h4>
              <div className="space-y-2">
                {upload.files.slice(0, 2).map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaFile className="mr-3 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Download"
                    >
                      <FaDownload />
                    </a>
                  </div>
                ))}
                {upload.files.length > 2 && (
                  <p className="text-sm text-gray-500 text-center">
                    + {upload.files.length - 2} more files
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Uploaded: {new Date(upload.createdAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedUpload(upload);
                    setShowDetails(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="View Details"
                >
                  <FaEye />
                </button>
                
                {upload.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(upload._id, 'processing')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Start Processing"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(upload._id, 'rejected')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Reject"
                    >
                      <FaTimes />
                    </button>
                  </>
                )}
                
                {upload.status === 'processing' && (
                  <button
                    onClick={() => handleStatusUpdate(upload._id, 'completed')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Mark as Completed"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredUploads.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No uploads found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'No document uploads yet'}
          </p>
        </div>
      )}

      {/* Upload Details Modal */}
      {showDetails && selectedUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Upload Details</h3>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedUpload(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Upload Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Service</h4>
                      <p className="text-lg font-bold text-primary-green">
                        {selectedUpload.serviceId?.title || 'Unknown Service'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Status</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedUpload.status)}`}>
                        {selectedUpload.status.charAt(0).toUpperCase() + selectedUpload.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">User ID</h4>
                      <p className="text-gray-700">{selectedUpload.userId}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Submitted</h4>
                      <p className="text-gray-700">
                        {new Date(selectedUpload.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Files */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4">Uploaded Files ({selectedUpload.files.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedUpload.files.map((file, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <FaFile className="mr-3 text-gray-400" size={20} />
                            <div>
                              <p className="font-medium text-gray-700 truncate">{file.fileName}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View/Download"
                          >
                            <FaEye />
                          </a>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Type: {file.fileType} • Uploaded: {new Date(file.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedUpload.status !== 'completed' && selectedUpload.status !== 'rejected' && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-4">Update Status</h4>
                    <div className="flex space-x-3">
                      {selectedUpload.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              handleStatusUpdate(selectedUpload._id, 'processing');
                              setShowDetails(false);
                            }}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                          >
                            Start Processing
                          </button>
                          <button
                            onClick={() => {
                              handleStatusUpdate(selectedUpload._id, 'rejected');
                              setShowDetails(false);
                            }}
                            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {selectedUpload.status === 'processing' && (
                        <button
                          onClick={() => {
                            handleStatusUpdate(selectedUpload._id, 'completed');
                            setShowDetails(false);
                          }}
                          className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Admin Notes */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Admin Notes</h4>
                  <textarea
                    placeholder="Add notes about this upload..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUploads;