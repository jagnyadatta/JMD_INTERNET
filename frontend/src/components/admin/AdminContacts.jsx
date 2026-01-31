// src/components/admin/AdminContacts.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaCheck, 
  FaTimes, 
  FaEye,
  FaReply,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import AdminHeader from './AdminHeader';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const data = await adminApi.getContacts();
      setContacts(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await adminApi.updateContactStatus(id, { status });
      toast.success(`Contact marked as ${status}`);
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSendReply = async (contactId) => {
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    try {
      await adminApi.updateContactStatus(contactId, { 
        status: 'resolved',
        response: replyText
      });
      toast.success('Reply sent successfully');
      setReplyText('');
      setShowDetails(false);
      fetchContacts();
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'spam': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <AdminHeader title="Contact Inquiries" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminHeader title="Contact Inquiries" />
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
            <option value="spam">Spam</option>
          </select>
          
          <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center">
            <FaFilter className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-glass-white backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map(contact => (
                <tr key={contact._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{contact.name}</div>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <FaPhone className="mr-2" size={12} />
                        {contact.phone}
                      </div>
                      {contact.serviceInterest && (
                        <div className="text-xs text-primary-green mt-1">
                          Interested in: {contact.serviceInterest}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-gray-700 text-sm line-clamp-2">{contact.message}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(contact.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(contact.status)}`}>
                      {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowDetails(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      
                      {contact.status === 'new' && (
                        <button
                          onClick={() => handleStatusUpdate(contact._id, 'contacted')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                          title="Mark as Contacted"
                        >
                          <FaCheck />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleStatusUpdate(contact._id, 'spam')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Mark as Spam"
                      >
                        <FaTimes />
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowDetails(true);
                        }}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                        title="Reply"
                      >
                        <FaReply />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No contacts found</h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'No contact inquiries yet'}
          </p>
        </div>
      )}

      {/* Contact Details Modal */}
      {showDetails && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Contact Details</h3>
                <button
                  onClick={() => {
                    setShowDetails(false);
                    setSelectedContact(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-green to-primary-blue flex items-center justify-center text-white text-2xl font-bold">
                      {selectedContact.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{selectedContact.name}</h4>
                      <p className="text-gray-600 flex items-center">
                        <FaPhone className="mr-2" />
                        {selectedContact.phone}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(selectedContact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700">{selectedContact.message}</p>
                  </div>
                </div>

                {/* Service Interest */}
                {selectedContact.serviceInterest && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Service Interest</h4>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-primary-blue">{selectedContact.serviceInterest}</p>
                    </div>
                  </div>
                )}

                {/* Reply Section */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Send Reply</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none resize-none"
                  />
                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSendReply(selectedContact._id)}
                      className="px-6 py-2 bg-primary-green text-white rounded-xl hover:bg-green-600"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>

                {/* Admin Notes */}
                {selectedContact.adminNotes && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Admin Notes</h4>
                    <div className="bg-yellow-50 rounded-xl p-4">
                      <p className="text-gray-700">{selectedContact.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Previous Response */}
                {selectedContact.response && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Previous Response</h4>
                    <div className="bg-green-50 rounded-xl p-4">
                      <p className="text-gray-700">{selectedContact.response}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Responded by: {selectedContact.respondedBy?.name || 'Admin'} • 
                        {selectedContact.respondedAt && ` ${new Date(selectedContact.respondedAt).toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
