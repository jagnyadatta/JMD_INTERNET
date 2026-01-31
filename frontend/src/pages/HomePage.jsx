// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ServiceModal from '../components/ServiceModal';
import OfferPopup from '../components/OfferPopup';
import { servicesData } from '../data/services';

const HomePage = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const hasSeenOffer = sessionStorage.getItem('hasSeenOffer');
      if (!hasSeenOffer) {
        setShowOffer(true);
        sessionStorage.setItem('hasSeenOffer', 'true');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <Services services={servicesData} onServiceClick={setSelectedService} />
      <About />
      <Contact />
      <Footer />
      
      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          onClose={() => setSelectedService(null)} 
        />
      )}
      
      {showOffer && (
        <OfferPopup onClose={() => setShowOffer(false)} />
      )}
    </>
  );
};

export default HomePage;
