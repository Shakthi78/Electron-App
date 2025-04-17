import { useRef, useEffect } from 'react';
import Hammer from 'hammerjs';
import { MeetingDialogProps } from './MeetingDialog';
import { X } from "lucide-react";

const VirtualTouchpad = ({ onClose }: MeetingDialogProps) => {
  const touchpadRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef<{ x: number; y: number } | null>(null);

  // Sensitivity settings
  const TOUCHPAD_WIDTH = 320; // Width of the touchpad in pixels
  const TOUCHPAD_HEIGHT = 320; // Height of the touchpad in pixels
  const SCREEN_WIDTH = window.screen.width; // Screen width in pixels
  const SCREEN_HEIGHT = window.screen.height; // Screen height in pixels
  const SENSITIVITY_FACTOR = 1.0; // Adjust this value to match desired sensitivity (e.g., 0.8 for lower sensitivity)

  useEffect(() => {
    const touchpadElement = touchpadRef.current;
    if (!touchpadElement) return;

    const hammer = new Hammer(touchpadElement);

    // Enable pinch and pan gestures
    hammer.get('pinch').set({ enable: true });
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });

    // Handle single-finger pan (mouse movement)
    hammer.on('pan', (event) => {
      const rect = touchpadElement.getBoundingClientRect();
      const x = event.center.x - rect.left; // Relative X position
      const y = event.center.y - rect.top; // Relative Y position

      if (lastPosition.current) {
        const deltaX = x - lastPosition.current.x; // Calculate relative X movement
        const deltaY = y - lastPosition.current.y; // Calculate relative Y movement

        // Scale the delta based on touchpad and screen dimensions
        const scaledDeltaX = (deltaX * (SCREEN_WIDTH / TOUCHPAD_WIDTH)) * SENSITIVITY_FACTOR;
        const scaledDeltaY = (deltaY * (SCREEN_HEIGHT / TOUCHPAD_HEIGHT)) * SENSITIVITY_FACTOR;

        // Send the scaled and smoothed delta to the main process
        window.electronAPI.moveMouse(scaledDeltaX, scaledDeltaY);
      }

      // Update the last position
      lastPosition.current = { x, y };
    });

    // Reset last position when the gesture ends
    hammer.on('panend', () => {
      lastPosition.current = null;
    });

    // Handle tap (left click)
    hammer.on('tap', (event) => {
      if (event.pointers.length === 1) {
        console.log("Single tap (left click)");
        window.electronAPI.mouseClick('left');
      } else if (event.pointers.length === 2) {
        console.log("Two-finger tap (right click)");
        window.electronAPI.mouseClick('right');
      }
    })

    // Cleanup
    return () => {
      hammer.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-7xl overflow-hidden p-4 md:p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-neutral-700 p-2 text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="h-full overflow-y-scroll custom-scrollbar">
          <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-2xl font-bold mb-4">Virtual Touchpad</h1>
            <div
              ref={touchpadRef}
              className="w-80 h-80 bg-gray-700 rounded-lg relative"
            >
              {/* Touchpad Area */}
            </div>

            <div className="mt-4 flex gap-4">
              {/* Left Click Button */}
              <button
                onClick={() => window.electronAPI.mouseClick('left')}
                className="px-6 py-2 bg-blue-500 rounded"
              >
                Left Click
              </button>

              {/* Right Click Button */}
              <button
                onClick={() => window.electronAPI.mouseClick('right')}
                className="px-6 py-2 bg-red-500 rounded"
              >
                Right Click
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default VirtualTouchpad;