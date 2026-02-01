// src/components/SimpleNotificationMarquee.jsx
import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaBullhorn } from 'react-icons/fa';
import axios from 'axios';

const SimpleNotificationMarquee = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchNotifications, 10 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/notifications/active');
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleWhatsAppClick = (whatsappMessage) => {
    const message = encodeURIComponent(whatsappMessage || 'Hello! I want to know more about your services.');
    window.open(`https://wa.me/919556397222?text=${message}`, '_blank');
  };

  if (!visible || notifications.length === 0) return null;

  return (
    <div className="sticky top-16 z-40 w-full bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
      <div className="relative overflow-hidden py-3">
        {/* Marquee Container */}
        <div 
          className="flex"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          style={{ 
            animation: isPaused ? 'marquee 35s linear infinite' : 'marquee 10s linear infinite',
            whiteSpace: 'nowrap'
          }}
        >
          {/* Create enough duplicates for seamless loop - minimum 3 sets */}
          {[...notifications, ...notifications, ...notifications, ...notifications, ...notifications].map((notification, index) => (
            <div key={index} className="inline-flex items-center mx-6">
              <FaBullhorn className="mr-2 text-yellow-300 flex-shrink-0" />
              <span className="text-sm font-medium mr-3">
                {notification.text}
              </span>
              <button
                onClick={() => handleWhatsAppClick(notification.whatsappMessage)}
                className="inline-flex items-center bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-semibold transition-colors backdrop-blur-sm flex-shrink-0"
              >
                <FaWhatsapp className="mr-1" />
                Click Here
              </button>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
          aria-label="Close notification"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default SimpleNotificationMarquee;