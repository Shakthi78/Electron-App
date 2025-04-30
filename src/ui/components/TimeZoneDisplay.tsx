import React, { useState, useEffect } from 'react';
import { TimeZone } from '../types/index';
import { getTimeInTimezone, formatTimeForTimezone } from '../utils/timeUtils';
import { Globe } from 'lucide-react';

interface TimeZoneDisplayProps {
  timeZones: TimeZone[];
}

const TimeZoneDisplay: React.FC<TimeZoneDisplayProps> = ({ timeZones }) => {
  const [currentTimes, setCurrentTimes] = useState<{ [key: string]: Date }>({});
  
  useEffect(() => {
    // Initial load
    updateTimes();
    
    // Update every minute
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [timeZones]);
  
  const updateTimes = () => {
    const times: { [key: string]: Date } = {};
    
    timeZones.forEach(tz => {
      times[tz.city] = getTimeInTimezone(tz.timezone);
    });
    
    setCurrentTimes(times);
  };
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full mt-auto">
      {timeZones.map((tz) => (
        <div
          key={tz.city}
          className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-white border border-white/5 transition-all hover:bg-black/50 flex justify-center items-center gap-5"
        >
          <div className="flex items-center space-x-2 text-white/70 text-meduim">
            <Globe size={14} />
            <span>{tz.city}</span>
          </div>
          <div className="font-mono text-medium mt-0.5">
            {currentTimes[tz.city] ? formatTimeForTimezone(currentTimes[tz.city]) : '--:--:--'}
          </div>
          <div className="text-medium text-white/50 ">{tz.offset}</div>
        </div>
      ))}
    </div>
  );
};

export default TimeZoneDisplay;