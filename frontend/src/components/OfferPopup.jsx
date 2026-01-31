import React, { useState } from 'react';
import { FaTimes, FaWhatsapp, FaGift } from 'react-icons/fa';

const OfferPopup = ({ onClose }) => {
  console.log('OfferPopup component rendered');
  const [offer, setOffer] = useState({
    title: 'Special Festival Offer!',
    description: 'Get 10% discount on all certificate services this month. Limited time offer!',
    image: 'https://res.cloudinary.com/dv3ttkcwa/image/upload/v1769881182/Gemini_Generated_Image_wdls8gwdls8gwdls_dfqgrp.png',
    whatsappMessage: 'Hello! I want to avail the festival offer on certificate services.'
  });

  const handleWhatsApp = () => {
    const url = `https://wa.me/919556397222?text=${encodeURIComponent(offer.whatsappMessage)}`;
    window.open(url, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 50
      }}
    >
      <div className="relative border border-black max-w-md w-full bg-gradient-to-br from-white via-gray-50 to-blue-50 backdrop-blur-lg rounded-3xl shadow-2xl animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Offer Badge */}
        {/* <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 shadow-lg">
            <FaGift className="text-white text-2xl" />
          </div>
        </div> */}

        <div className="pt-12 pb-6 px-6">
          {/* Offer Image */}
          <div className="rounded-2xl overflow-hidden mb-6">
            <img
              src={offer.image}
              alt="Special Offer"
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Offer Content */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">{offer.title}</h3>
            <p className="text-gray-600 mb-4">{offer.description}</p>
            
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-red-100 to-yellow-100 rounded-full">
              <span className="text-red-600 font-bold text-lg">10% OFF</span>
              <span className="text-gray-600 ml-2">on all services</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              <FaWhatsapp className="mr-3" size={20} />
              Claim Offer on WhatsApp
            </button>
            
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            * Offer valid till month end. Terms and conditions apply.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferPopup;