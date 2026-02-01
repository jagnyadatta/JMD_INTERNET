import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: FaFacebook, href: '#', color: 'hover:text-blue-600' },
    { icon: FaTwitter, href: 'https://x.com/jmdnet2020', color: 'hover:text-blue-400' },
    { icon: FaInstagram, href: '#', color: 'hover:text-pink-600' },
    { icon: FaYoutube, href: 'https://www.youtube.com/@jmdnet', color: 'hover:text-red-600' },
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-12 pb-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary-green via-primary-blue to-white bg-clip-text text-transparent mb-4">
              JMD INTERNET
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted Common Service Centre for all government and utility services. 
              Fast, reliable, and transparent service delivery.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 ${social.color} transition-colors`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-primary-green transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Our Services</h3>
            <ul className="space-y-2">
              {[
                'Caste Certificate',
                'Income Certificate',
                'PAN Card',
                'License Services',
                'Scheme Applications',
                'All Online Works'
              ].map((service, index) => (
                <li key={index}>
                  <span className="text-gray-400 hover:text-primary-green transition-colors cursor-pointer">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-primary-green mt-1 mr-3" />
                <span className="text-gray-400">Bajrakote, Krushanprasad, Puri, Odisha - 752032</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-primary-green mr-3" />
                <span className="text-gray-400">+91 95563 97222</span>
              </li>
              <li className="flex items-center">
                <FaWhatsapp className="text-primary-green mr-3" />
                <span className="text-gray-400">+91 95563 97222</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-primary-green mr-3" />
                <span className="text-gray-400">jmdnet2020@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-wrap gap-3 item-center justify-center sm:justify-between pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            © 2026 JMD INTERNET - Common Service Centre. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Registered under Government of India CSC Scheme
          </p>
          <p className='text-gray-400'>Developed by - <a href='https://jagnyadattadalai.netlify.app/' target='_blank' className='font-semibold text-lg text-white'>Jagnyadatta</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;