import React, { useEffect, useState } from 'react';
import { PersistentNotification } from './PersistentNotification';

interface Notification {
  id: string;
  message: string;
}

export const DeviceAlerts: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const updateDeviceStatus = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log("Checking.....")
  
    const hasCamera = devices.some(d => d.kind === 'videoinput');
    const hasMic = devices.some(d => d.kind === 'audioinput');
    const hasSpeaker = devices.some(d => d.kind === 'audiooutput');
  
    const updated: Notification[] = [];
  
    if (!hasCamera) updated.push({ id: 'camera', message: '❌ No camera connected' });
    if (!hasMic) updated.push({ id: 'mic', message: '❌ No microphone connected' });
    if (!hasSpeaker) updated.push({ id: 'speaker', message: '❌ No speaker connected' });
  
    setNotifications(updated);
  };  


  useEffect(() => {
    updateDeviceStatus();

    const interval = setInterval(updateDeviceStatus, 5000); // optional auto-check every 5s
    return () => clearInterval(interval);
  }, []);

  const handleClose = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 w-80">
      {notifications.map(n => (
        <PersistentNotification key={n.id} id={n.id} message={n.message} onClose={handleClose} />
      ))}
    </div>
  );
};
