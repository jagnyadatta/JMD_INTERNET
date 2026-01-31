import React, { useState } from 'react';
import { FaPhone, FaWhatsapp, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      toast.success('Message sent successfully! We will contact you soon.');
      setFormData({ name: '', phone: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Contact <span className="text-primary-green">Us</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need assistance? Get in touch with our expert team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="animate-slide-up">
            <div className="bg-glass-white backdrop-blur-lg rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary-green/10 flex items-center justify-center mr-4">
                    <FaPhone className="text-primary-green text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Call Us</h4>
                    <p className="text-gray-600">+91 95563 97222</p>
                    <p className="text-sm text-gray-500">Mon-Sun: 8:00 AM - 10:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center mr-4">
                    <FaWhatsapp className="text-primary-green text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">WhatsApp</h4>
                    <p className="text-gray-600">+91 95563 97222</p>
                    <p className="text-sm text-gray-500">24/7 Support Available</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-xl bg-primary-red/10 flex items-center justify-center mr-4">
                    <FaMapMarkerAlt className="text-primary-red text-xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Visit Center</h4>
                    <p className="text-gray-600">JMD INTERNET</p>
                    <p className="text-gray-600">Near High School, Bajrakote, Odisha - 752032</p>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3">Working Hours</h4>
                <div className="space-y-2">
                  {[
                    { day: 'Monday - Friday', time: '8:00 AM - 8:00 PM' },
                    { day: 'Saturday', time: '8:00 AM - 1:00 PM' },
                    { day: 'Sunday', time: '10:00 AM - 4:00 PM' },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{schedule.day}</span>
                      <span className="font-semibold text-primary-green">{schedule.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="bg-glass-white backdrop-blur-lg rounded-2xl p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all"
                    placeholder="Enter your 10-digit mobile number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-primary-green focus:ring-2 focus:ring-primary-green/20 outline-none transition-all resize-none"
                    placeholder="Describe your query or service requirement"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-green to-primary-blue text-white rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50"
                >
                  <FaPaperPlane className="mr-3" />
                  {loading ? 'Sending...' : 'Send Message'}
                </button>

                <p className="text-sm text-gray-500 text-center">
                  We respect your privacy. Your information will not be shared with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;