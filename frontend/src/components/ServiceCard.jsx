import React from 'react';
import { Icon } from './IconMapper';

const ServiceCard = ({ service, index, onClick }) => {
  return (
    <div
      onClick={() => onClick(service)}
      className="group cursor-pointer animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100">
        {/* Icon */}
        {/* <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-green/20 to-primary-blue/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon name={service.icon} className="text-3xl text-primary-green" />
        </div> */}

        {/* Service Image */}
        <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 text-center group-hover:text-primary-green transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm text-center line-clamp-2">
          {service.description}
        </p>

        {/* Hover Indicator */}
        <div className="mt-4 flex justify-center">
          <div className="w-0 group-hover:w-12 h-1 bg-gradient-to-r from-primary-green to-primary-blue rounded-full transition-all duration-300" />
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;