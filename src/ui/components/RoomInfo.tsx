import React from 'react';
import { Users } from 'lucide-react';

interface RoomInfoProps {
  roomName: string;
  capacity?: string;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomName, capacity }) => {
  console.log("capacityRoom",capacity)
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold text-white">Room</h1>
        <div className={`h-2.5 w-2.5 rounded-full bg-green-500`}></div>
      </div>
      <h2 className="text-3xl font-light text-white/90">{roomName}</h2>
      
      <div className="flex items-center mt-2 text-white/70 text-sm">
        <Users size={16} className="mr-1" />
        <span>Capacity: {capacity}</span>
      </div>
    </div>
  );
};

export default RoomInfo;