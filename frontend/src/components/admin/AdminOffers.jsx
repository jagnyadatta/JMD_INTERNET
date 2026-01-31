// src/components/admin/AdminOffers.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaCalendar,
  FaTag,
  FaChartLine,
  FaToggleOn,
  FaToggleOff,
  FaSearch,
  FaFilter
} from 'react-icons/fa';
import AdminHeader from './AdminHeader';
import OfferModal from './OfferModal';
import { adminApi } from '../../utils/adminApi';
import { toast } from 'react-toastify';

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const data = await adminApi.getOffers();
      setOffers(data.data || []);
    } catch (error) {
      toast.error('Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await adminApi.deleteOffer(id);
        toast.success('Offer deleted successfully');
        fetchOffers();
      } catch (error) {
        toast.error('Failed to delete offer');
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await adminApi.updateOffer(id, { isActive: !currentStatus });
      toast.success(`Offer ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchOffers();
    } catch (error) {
      toast.error('Failed to update offer status');
    }
  };

  const filteredOffers = offers.filter(offer =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isOfferActive = (offer) => {
    const now = new Date();
    return offer.isActive && 
           new Date(offer.validFrom) <= now && 
           new Date(offer.validUntil) >= now;
  };

  if (loading) {
    return (
      <div className="p-8">
        <AdminHeader title="Offers Management" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminHeader title="Offers Management" />
      
      {/* Header Actions */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search offers..."
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
            Create Offer
          </button>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredOffers.map(offer => (
          <div key={offer._id} className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
            {/* Offer Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center mb-2">
                  <FaTag className="text-primary-green mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">{offer.title}</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-100 to-yellow-100 text-red-600 rounded-full text-sm font-semibold">
                    {offer.discount}% OFF
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isOfferActive(offer) 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {isOfferActive(offer) ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleToggleActive(offer._id, offer.isActive)}
                className={`p-2 rounded-lg ${offer.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                title={offer.isActive ? 'Deactivate' : 'Activate'}
              >
                {offer.isActive ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              </button>
            </div>
            
            {/* Offer Description */}
            {offer.description && (
              <p className="text-gray-600 mb-4 line-clamp-2">{offer.description}</p>
            )}
            
            {/* Validity Period */}
            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <FaCalendar className="mr-2" />
                Validity Period
              </div>
              <div className="text-sm">
                <div>From: {new Date(offer.validFrom).toLocaleDateString()}</div>
                <div>To: {new Date(offer.validUntil).toLocaleDateString()}</div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <FaChartLine className="mr-2" />
                <span>Clicks: <span className="font-semibold">{offer.clicks || 0}</span></span>
              </div>
              <div>
                Conversions: <span className="font-semibold">{offer.conversions || 0}</span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                Created: {new Date(offer.createdAt).toLocaleDateString()}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    setSelectedOffer(offer);
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button 
                  onClick={() => handleDelete(offer._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <FaTrash />
                </button>
                <button 
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                  title="View Details"
                >
                  <FaEye />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOffers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎁</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No offers found</h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search terms' 
              : 'Create your first offer to attract more customers'}
          </p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <OfferModal
          offer={selectedOffer}
          onClose={() => {
            setShowModal(false);
            setSelectedOffer(null);
          }}
          onSuccess={() => {
            fetchOffers();
            setShowModal(false);
            setSelectedOffer(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminOffers;