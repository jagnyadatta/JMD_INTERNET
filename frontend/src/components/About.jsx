import React from 'react';
import { FaShieldAlt, FaClock, FaCheckCircle, FaUsers } from 'react-icons/fa';

const About = () => {
  const features = [
    {
      icon: FaShieldAlt,
      title: 'Secure & Trusted',
      description: 'Government-approved service center with secure document handling',
      color: 'from-primary-green to-green-400'
    },
    {
      icon: FaClock,
      title: 'Fast Processing',
      description: 'Quick turnaround time for all government certificates and services',
      color: 'from-primary-blue to-blue-400'
    },
    {
      icon: FaCheckCircle,
      title: '100% Authentic',
      description: 'All services provided through official government portals',
      color: 'from-primary-green to-green-400'
    },
    {
      icon: FaUsers,
      title: 'Expert Support',
      description: 'Trained professionals to assist you at every step',
      color: 'from-primary-blue to-blue-400'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-slide-up">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              About <span className="text-primary-green">JMD INTERNET</span>
            </h2>
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                JMD INTERNET is a certified Common Service Centre (CSC) dedicated to bridging 
                the digital divide by providing government and utility services to citizens 
                in the most accessible and efficient manner.
              </p>
              <p className="text-lg text-gray-600">
                With years of experience and a team of trained professionals, we ensure 
                that every service is delivered with the highest standards of reliability 
                and transparency.
              </p>
              <p className="text-lg text-gray-600">
                Our mission is to simplify government processes and make essential services 
                available to everyone, regardless of their technical expertise.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {[
                { value: '10+', label: 'Years Experience' },
                { value: '15K+', label: 'Happy Customers' },
                { value: '100+', label: 'Services Offered' },
                { value: '24/7', label: 'Support Available' },
              ].map((stat, index) => (
                <div key={index} className="bg-glass-white backdrop-blur-lg rounded-xl p-4 shadow-lg">
                  <div className="text-2xl font-bold text-primary-green">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-glass-white backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;