import React from 'react';
import {
  FaIdCard,
  FaHome,
  FaMoneyBillWave,
  FaCreditCard,
  FaFileAlt,
  FaLaptop,
  FaSeedling,
  FaTractor,
  FaCar,
  FaChartLine,
  FaShieldAlt,
  FaCertificate
} from 'react-icons/fa';

export const Icon = ({ name, className }) => {
  const icons = {
    'id-card': FaIdCard,
    'home': FaHome,
    'money': FaMoneyBillWave,
    'credit-card': FaCreditCard,
    'file': FaFileAlt,
    'laptop': FaLaptop,
    'seedling': FaSeedling,
    'tractor': FaTractor,
    'car': FaCar,
    'chart': FaChartLine,
    'shield': FaShieldAlt,
    'certificate': FaCertificate
  };

  const IconComponent = icons[name] || FaFileAlt;
  return <IconComponent className={className} />;
};