// src/components/NotificationMarquee.jsx
import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const NotificationMarquee = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [marqueeKey, setMarqueeKey] = useState(0); // For resetting animation

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications/active`);
      if (response.data.data.length > 0) {
        setNotifications(response.data.data);
        setCurrentNotification(response.data.data[0]); // Show first/highest priority
        setMarqueeKey(prev => prev + 1); // Reset animation
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (currentNotification?.whatsappMessage) {
      const message = encodeURIComponent(currentNotification.whatsappMessage);
      window.open(`https://wa.me/919556397222?text=${message}`, '_blank');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 1: return 'from-blue-500 to-blue-600';
      case 2: return 'from-orange-500 to-orange-600';
      case 3: return 'from-red-500 to-red-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  if (!visible || loading || !currentNotification) return null;

  return (
    <div className={`sticky top-16 z-50 w-full bg-gradient-to-r ${getPriorityColor(currentNotification.priority)} text-white shadow-lg`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Marquee Text */}
          <div className="flex-1 overflow-hidden">
            <div 
              key={marqueeKey}
              className="flex whitespace-nowrap animate-marquee"
              style={{
                animation: 'marquee 20s linear infinite'
              }}
            >
              <span className="text-sm font-medium px-4">
                {currentNotification.text}
              </span>
              <span className="text-sm font-medium px-4">
                {currentNotification.text}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 ml-4">
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center bg-white text-green-600 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold"
            >
              <FaWhatsapp className="mr-2" />
              Know More
            </button>
            
            <button
              onClick={() => setVisible(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close notification"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationMarquee;
