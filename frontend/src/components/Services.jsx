import React from 'react';
import ServiceCard from './ServiceCard';

const Services = ({ services, onServiceClick }) => {
  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our <span className="text-primary-green">Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive government and utility services at your fingertips. 
            Fast, reliable, and transparent processing for all your needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              onClick={onServiceClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
