import React, { useState, useEffect } from 'react';
import { formatTime, formatDate } from '../utils/timeUtils';

const TimeDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="text-right">
      <div className="text-white text-6xl md:text-7xl lg:text-8xl font-light tracking-tight leading-none">
        {formatTime(currentTime)}
      </div>
      <div className="text-white/90 text-xl md:text-2xl mt-2">
        {formatDate(currentTime)}
      </div>
    </div>
  );
};

export default TimeDisplay;