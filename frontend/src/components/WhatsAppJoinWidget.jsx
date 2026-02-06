import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppJoinWidget = () => {
  const [isHovered, setIsHovered] = useState(false);

  // Replace with your WhatsApp channel link
  const whatsappChannelLink = "https://whatsapp.com/channel/0029VaAeZrYFcovxbTJob13P";

  const handleClick = () => {
    window.open(whatsappChannelLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-3 right-3 z-50">
      {/* WhatsApp Icon Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center gap-1"
        aria-label="Join our WhatsApp Channel"
      >
        {/* WhatsApp Icon */}
        <FaWhatsapp size={14}/>
        <div>
            <span className="text-xs font-medium">Our Channel</span>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg">
            Join our WhatsApp Channel
            {/* Tooltip arrow */}
            <div className="absolute top-full right-5 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
            </div>
          </div>
        )}
      </button>
    </div>
  );
};

export default WhatsAppJoinWidget;