import React, { useState } from "react";

const VirtualTouchpad: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;

      // Send mouse movement data to the main process
      window.electronAPI.moveMouse(deltaX, deltaY);

      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        width: "400px",
        height: "300px",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        cursor: "pointer",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <p>Virtual Touchpad</p>
    </div>
  );
};

export default VirtualTouchpad;