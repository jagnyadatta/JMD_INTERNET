import { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import axios from 'axios';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if already visited in this session
    const hasVisited = sessionStorage.getItem('hasVisitedJMD');
    
    if (!hasVisited) {
      // First visit in this session, increment count
      incrementVisitor();
      sessionStorage.setItem('hasVisitedJMD', 'true');
    }
    
    // Always fetch current count
    fetchVisitorCount();
  }, []);

  const incrementVisitor = async () => {
    try {
      await axios.post('http://localhost:5000/api/visitor/increment');
    } catch (error) {
      console.error('Failed to increment visitor:', error);
    }
  };

  const fetchVisitorCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/visitor/count');
      setVisitorCount(response.data.count);
    } catch (error) {
      console.error('Failed to fetch visitor count:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to split number into individual digits
  const renderDigits = () => {
    if (loading) {
      // Show loading placeholders
      return Array.from({ length: 6 }).map((_, index) => (
        <span 
          key={index} 
          className="w-4 h-4 bg-white/50 flex items-center justify-center rounded-full text-primary-green text-xs font-bold animate-pulse"
        >
          -
        </span>
      ));
    }

    // Convert number to string and pad with leading zeros if needed
    const countString = visitorCount.toString().padStart(6, '0');
    
    // Take only last 6 digits if number is too long
    const displayString = countString.slice(-6);
    
    // Split into individual digits and render
    return displayString.split('').map((digit, index) => (
      <span 
        key={index} 
        className="w-4 h-4 bg-white flex items-center justify-center rounded-full text-primary-green text-xs font-bold"
      >
        {digit}
      </span>
    ));
  };

  return (
    <div className="fixed bottom-2 left-2 z-40">
      <div className="flex items-center gap-2 bg-primary-green px-3 py-1 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 group animate-fade-in border border-white/20 backdrop-blur-sm">
        <FaUsers className="text-white text-sm" />
        
        <div className="flex items-center justify-center gap-1">
          {renderDigits()}
        </div>
        
        {/* Tooltip on hover */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {loading ? 'Loading...' : `${visitorCount.toLocaleString()} visitors`}
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;