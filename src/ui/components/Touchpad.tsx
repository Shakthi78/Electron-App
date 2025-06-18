import React, { useRef, useState } from "react";
import { X, MousePointer } from "lucide-react";
// import clsx from "clsx";

interface MeetingDialogProps {
  onClose: () => void;
}

export default function Touchpad({ onClose }: MeetingDialogProps) {
  const lastPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [cursor, setCursor] = useState({ x: lastPos.current.x, y: lastPos.current.y });

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const dx = touch.clientX - lastPos.current.x;
    const dy = touch.clientY - lastPos.current.y;

    // Update positions manually like a virtual pointer
    lastPos.current.x += dx;
    lastPos.current.y += dy;

    setCursor({
      x: lastPos.current.x,
      y: lastPos.current.y,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-7xl overflow-hidden p-4 md:p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-neutral-700 p-2 text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="h-full w-full bg-gray-200 relative overflow-hidden">
          {/* Trackpad Surface */}
          <div
            onTouchMove={handleTouchMove}
            className="absolute inset-0"
            style={{ touchAction: "none" }}
          />

          {/* Simulated Cursor */}
          <MousePointer
            className="absolute text-blue-600 transition-transform duration-50"
            style={{
              transform: `translate(${cursor.x}px, ${cursor.y}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
