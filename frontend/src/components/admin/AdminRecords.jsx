import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrashAlt, 
  FaTimes,
  FaSave,
  FaCalendarAlt,
  FaFileAlt,
  FaUser,
  FaPhone,
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationCircle,
  FaClosedCaptioning,
  FaCross,
  FaWindowClose
} from 'react-icons/fa';
import { format } from 'date-fns';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const AdminRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showHistoryForm, setShowHistoryForm] = useState(false);
  const [editingHistory, setEditingHistory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    number: ''
  });
  const [historyData, setHistoryData] = useState({
    service: '',
    refNo: '',
    date: new Date().toISOString().split('T')[0],
    followUp: '',
    remark: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch records
  const fetchRecordsFirst = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const response = await adminApi.getRecords({ page, limit: 10, search });
      
      if (response.success) {
        setRecords(response.records);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };
  // Fetch records
  const fetchRecords = async (page = 1, search = '') => {
    if(!search) return;
    if(search.length <= 2){
        toast.warn("Enter more than 2 character to search!");
        return;
    }
    try {
      setLoading(true);
      const response = await adminApi.getRecords({ page, limit: 10, search });
      
      if (response.success) {
        setRecords(response.records);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordsFirst();
  }, []);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecords(1, searchTerm);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Create/Update record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedRecord) {
        // Update
        await adminApi.updateRecord(selectedRecord._id, formData);
        setSuccess('Record updated successfully');
      } else {
        // Create
        await adminApi.createRecord(formData);
        setSuccess('Record created successfully');
      }

      fetchRecordsFirst();
      
      setShowForm(false);
      setSelectedRecord(null);
      setFormData({ name: '', number: '' });
      fetchRecords(pagination.page, searchTerm);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving record:', error);
      setError(error.response?.data?.message || 'Failed to save record');
    }
  };

  // Delete record
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    
    try {
      await adminApi.deleteRecord(id);
      setSuccess('Record deleted successfully');
      fetchRecordsFirst();
      
      // Clear selected record if it was deleted
      if (selectedRecord?._id === id) {
        setSelectedRecord(null);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting record:', error);
      setError('Failed to delete record');
    }
  };

  // Add work history
  const handleAddHistory = async (e) => {
    e.preventDefault();
    try {
      if (editingHistory) {
        // Update history
        await adminApi.updateWorkHistory(
          selectedRecord._id, 
          editingHistory._id, 
          historyData
        );
        setSuccess('Work history updated successfully');
      } else {
        // Add new history
        await adminApi.addWorkHistory(selectedRecord._id, historyData);
        setSuccess('Work history added successfully');
      }
      
      setShowHistoryForm(false);
      setEditingHistory(null);
      setHistoryData({
        service: '',
        refNo: '',
        date: new Date().toISOString().split('T')[0],
        followUp: '',
        remark: ''
      });
      
      // Refresh selected record
      const response = await adminApi.getRecordById(selectedRecord._id);
      setSelectedRecord(response.record);

      fetchRecordsFirst();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error saving history:', error);
      setError(error.response?.data?.message || 'Failed to save work history');
    }
  };

  // Delete work history
  const handleDeleteHistory = async (recordId, historyId) => {
    if (!window.confirm('Are you sure you want to delete this history item?')) return;
    
    try {
      await adminApi.deleteWorkHistory(recordId, historyId);
      setSuccess('Work history deleted successfully');
      
      // Refresh selected record
      const response = await adminApi.getRecordById(recordId);
      setSelectedRecord(response.record);

      fetchRecordsFirst();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting history:', error);
      setError('Failed to delete history item');
    }
  };

  // Edit history
  const handleEditHistory = (history) => {
    setEditingHistory(history);
    setHistoryData({
      service: history.service,
      refNo: history.refNo,
      date: new Date(history.date).toISOString().split('T')[0],
      followUp: history.followUp ? new Date(history.followUp).toISOString().split('T')[0] : '',
      remark: history.remark || ''
    });
    setShowHistoryForm(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Records</h1>
        <button
          onClick={() => {
            setSelectedRecord(null);
            setFormData({ name: '', number: '' });
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add New Customer
        </button>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <FaExclamationCircle className="mr-2" />
          {success}
          <button onClick={() => setSuccess('')} className="ml-auto">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <FaExclamationCircle className="mr-2" />
          {error}
          <button onClick={() => setError('')} className="ml-auto">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Records List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h2 className="font-semibold text-gray-700">
              Customers ({pagination.total})
            </h2>
          </div>
          
          <div className="divide-y max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : records.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No records found</div>
            ) : (
              records.map((record) => (
                <div
                  key={record._id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedRecord?._id === record._id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedRecord(record)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{record.name}</h3>
                      <p className="text-sm text-gray-500">{record.number}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {record.details.length} work item{record.details.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
                          setFormData({ name: record.name, number: record.number });
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(record._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
              <button
                onClick={() => fetchRecords(pagination.page - 1, searchTerm)}
                disabled={pagination.page === 1}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <FaChevronLeft />
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => fetchRecords(pagination.page + 1, searchTerm)}
                disabled={pagination.page === pagination.pages}
                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* Work History */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          {selectedRecord ? (
            <>
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-gray-700">
                    Work History - {selectedRecord.name}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedRecord.number}</p>
                </div>
                <button
                  onClick={() => {
                    setEditingHistory(null);
                    setHistoryData({
                      service: '',
                      refNo: '',
                      date: new Date().toISOString().split('T')[0],
                      followUp: '',
                      remark: ''
                    });
                    setShowHistoryForm(true);
                  }}
                  className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="mr-1" />
                  Add Work
                </button>
                <button
                  onClick={() => {
                    setSelectedRecord(null);
                    setHistoryData({
                      service: '',
                      refNo: '',
                      date: new Date().toISOString().split('T')[0],
                      followUp: '',
                      remark: ''
                    });
                  }}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  <FaWindowClose className="mr-1" />
                  Close
                </button>
              </div>

              <div className="p-4 max-h-[500px] overflow-y-auto">
                {selectedRecord.details.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <FaHistory className="mx-auto mb-3 text-4xl text-gray-400" />
                    <p>No work history found</p>
                    <p className="text-sm mt-2">Click "Add Work" to add new history</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedRecord.details.map((history, index) => (
                      <div key={history._id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                              #{index + 1}
                            </span>
                            <h3 className="font-medium text-gray-800">{history.service}</h3>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditHistory(history)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteHistory(selectedRecord._id, history._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-gray-600">
                            <FaFileAlt className="mr-2" />
                            Ref: {history.refNo}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="mr-2" />
                            Date: {format(new Date(history.date), 'dd/MM/yyyy')}
                          </div>
                          {history.followUp && (
                            <div className="col-span-2 text-gray-600">
                              <span className="font-medium">Follow Up:</span> {format(new Date(history.followUp), 'dd/MM/yyyy')}
                            </div>
                          )}
                          {history.remark && (
                            <div className="col-span-2 text-gray-600">
                              <span className="font-medium">Remark:</span> {history.remark}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FaHistory className="mx-auto mb-3 text-5xl text-gray-400" />
              <p>Select a customer to view their work history</p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {selectedRecord ? 'Edit Customer' : 'Add New Customer'}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FaSave className="mr-2" />
                  {selectedRecord ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work History Form Modal */}
      {showHistoryForm && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingHistory ? 'Edit Work History' : 'Add Work History'}
              </h3>
              <button 
                onClick={() => {
                  setShowHistoryForm(false);
                  setEditingHistory(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleAddHistory}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service
                  </label>
                  <input
                    type="text"
                    value={historyData.service}
                    onChange={(e) => setHistoryData({ ...historyData, service: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder='Enter Service Name'
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={historyData.refNo}
                    onChange={(e) => setHistoryData({ ...historyData, refNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    placeholder='Enter Reference Number'
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={historyData.date}
                    onChange={(e) => setHistoryData({ ...historyData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow Up Date
                  </label>
                  <input
                    type="date"
                    value={historyData.followUp}
                    onChange={(e) => setHistoryData({ ...historyData, followUp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remark
                  </label>
                  <textarea
                    value={historyData.remark}
                    onChange={(e) => setHistoryData({ ...historyData, remark: e.target.value })}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder='Enter Remarks here...'
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowHistoryForm(false);
                    setEditingHistory(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FaSave className="mr-2" />
                  {editingHistory ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecords;
