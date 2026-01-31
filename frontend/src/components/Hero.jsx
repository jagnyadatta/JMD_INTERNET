import React from 'react';
import { FaArrowRight } from 'react-icons/fa';

const Hero = () => {
  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-auto sm:h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0  z-10" />
        <img 
          src="https://images.unsplash.com/photo-1707305637648-540be26d5144?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="CSC Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative mt-20 sm:mt-10 z-20 text-center px-4 max-w-4xl mx-auto animate-fade-in">
        <div className="bg-glass-white backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            Your Trusted <span className="text-primary-green">Common Service Centre</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Simplifying government services with speed, reliability, and transparency. 
            Get all your certificates, licenses, and scheme applications processed efficiently.
          </p>
          <button
            onClick={scrollToServices}
            className="group inline-flex items-center px-6 py-2 sm:px-8 sm:py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-green to-primary-blue rounded-full hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Explore Our Services
            <FaArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 mb-5 sm:mt-10">
          {[
            { value: '5,000+', label: 'Services Delivered' },
            { value: '24/7', label: 'Support' },
            { value: '2 Hours', label: 'Avg Processing' },
            { value: '99.9%', label: 'Satisfaction' },
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-glass-white backdrop-blur-lg rounded-xl p-4 shadow-lg hover:scale-105 transition-transform"
            >
              <div className="text-2xl font-bold text-primary-green">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hidden sm:flex absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button
          onClick={scrollToServices}
          className="p-2 rounded-full bg-glass-white backdrop-blur-lg shadow-lg hover:bg-primary-green hover:text-white transition-colors"
          aria-label="Scroll to services"
        >
          <FaArrowRight className="rotate-90" size={20} />
        </button>
      </div>
    </section>
  );
};

export default Hero;
