
import type React from "react"

import { useState, useRef, useEffect } from "react"

export default function Editor({title}: {title: String}) {
  const [roomName, setRoomName] = useState("")
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRoomName, setNewRoomName] = useState("")

  const popoverRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false)
      }
    }
    setRoomName(localStorage.getItem(`${title}`) as string)
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle click outside to close dialog
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setIsDialogOpen(false)
      }
    }

    if (isDialogOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDialogOpen])

  // Handle ESC key to close dialog
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDialogOpen(false)
        setIsPopoverOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => {
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [])

  const handleOpenDialog = () => {
    setIsPopoverOpen(false)
    setNewRoomName(roomName)
    setIsDialogOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRoomName.trim()) {
      setRoomName(newRoomName)
    }
    localStorage.setItem(`${title}`, newRoomName)
    setIsDialogOpen(false)
  }

  return (
    <div className="relative w-full">
      {/* Main black div */}
      <div className="flex items-center justify-between p-4 bg-neutral-800 backdrop-blur-lg shadow-xl transition-all text-white rounded-md w-full max-w-5xl ml-5">
        <div className="font-medium flex justify-between ">
            <h3>{title} :</h3>
        </div>

        <div className="flex gap-2"> 
        <h3>{roomName}</h3>
        {/* Three dots button */}
        <button
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          className="p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          aria-label="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          
        </button>
            {isPopoverOpen && (
                <div ref={popoverRef} className="absolute right-12 bottom-3 w-20 mt-2 bg-white rounded-md shadow-lg">
                <button
                    onClick={handleOpenDialog}
                    className="w-full text-center px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                >
                    Edit
                </button>
                </div>
            )}
        </div>
      </div>

      {/* Custom Popover */}
      

      {/* Custom Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={dialogRef} className="bg-neutral-800 backdrop-blur-lg shadow-xl transition-all rounded-lg max-w-md w-full mx-4">
            <div className="p-6 ">
              <h3 className="text-lg font-medium text-white mb-4">Edit Room Name</h3>

              <form onSubmit={handleSave}>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <div className="mt-5 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
