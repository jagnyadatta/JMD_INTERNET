// src/components/SimpleNotificationMarquee.jsx
import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes, FaBullhorn } from 'react-icons/fa';
import axios from 'axios';

const SimpleNotificationMarquee = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/notifications/active`);
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleWhatsAppClick = (msg) => {
    const message = encodeURIComponent(
      msg || 'Hello! I want to know more about your services.'
    );
    window.open(`https://wa.me/919556397222?text=${message}`, '_blank');
  };

  if (!visible || notifications.length === 0) return null;

  const loopData = [...notifications, ...notifications, ...notifications]; // ⭐ only 2 sets

  return (
    <div className="sticky top-16 z-40 w-full bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg overflow-hidden">
      <div className="relative py-3">
        
        <div
          className="flex w-max"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          style={{
            animation: 'marqueeScroll 80s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running'
          }}
        >
          {loopData.map((notification, index) => (
            <div key={index} className="flex items-center mx-6">
              <FaBullhorn className="mr-2 text-yellow-300" />
              <span className="text-sm font-medium mr-3">
                {notification.text}
              </span>
              <button
                onClick={() => handleWhatsAppClick(notification.whatsappMessage)}
                className="flex items-center bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
              >
                <FaWhatsapp className="mr-1" />
                Click Here
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default SimpleNotificationMarquee;