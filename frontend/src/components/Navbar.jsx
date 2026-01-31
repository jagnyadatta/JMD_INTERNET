import React, { useState } from 'react';
import { FaPhone, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
    { id: 'admin', label: 'Admin', path: '/admin' },
  ];

  const handleCall = () => {
    window.location.href = 'tel:+911234567890';
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/911234567890?text=Hello%20JMD%20INTERNET,%20I%20need%20assistance', '_blank');
  };

  return (
    <nav className="fixed w-full z-50 bg-glass-white backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary-green">
              JMD INTERNET
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.path || `#${link.id}`}
                onClick={() => {
                  setActiveLink(link.id);
                  if (link.path) {
                    e.preventDefault();
                    navigate(link.path);
                  }
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeLink === link.id
                    ? 'bg-primary-green text-white'
                    : 'text-gray-700 hover:bg-primary-blue hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={handleCall}
              className="p-2 bg-primary-green text-white rounded-full hover:bg-green-600 transition-colors"
              aria-label="Call us"
            >
              <FaPhone size={20} />
            </button>
            <button
              onClick={handleWhatsApp}
              className="p-2 bg-primary-green text-white rounded-full hover:bg-green-600 transition-colors"
              aria-label="Contact on WhatsApp"
            >
              <FaWhatsapp size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-white hover:bg-primary-blue"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-glass-white backdrop-blur-lg shadow-lg rounded-lg mt-2 py-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => {
                    setActiveLink(link.id);
                    setIsOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    activeLink === link.id
                      ? 'bg-primary-green text-white'
                      : 'text-gray-700 hover:bg-primary-blue hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex space-x-4 px-3 pt-4">
                <button
                  onClick={handleCall}
                  className="flex items-center justify-center w-12 h-12 bg-primary-green text-white rounded-full hover:bg-green-600"
                >
                  <FaPhone size={20} />
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex items-center justify-center w-12 h-12 bg-primary-green text-white rounded-full hover:bg-green-600"
                >
                  <FaWhatsapp size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
