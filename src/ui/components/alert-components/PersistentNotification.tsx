import React from 'react';

interface NotificationProps {
  id: string;
  message: string;
  onClose: (id: string) => void;
}

export const PersistentNotification: React.FC<NotificationProps> = ({ id, message, onClose }) => {
  return (
    <div className="bg-red-100 text-red-800 border border-red-300 px-4 py-3 rounded relative shadow-md">
      <span>{message}</span>
      <button
        onClick={() => onClose(id)}
        className="absolute top-1 right-2 text-red-500 hover:text-red-700 text-lg"
      >
        ×
      </button>
    </div>
  );
};
