import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
// import { X } from "lucide-react"
import Button from "./Button"
import Whatfix from "../../../Whatfix.png"


interface Close {
  handleClose?: () => void
}

export default function Dialog({handleClose}: Close) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLImageElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const handleOpenDialog = () => {
    setIsOpen(true)
  }

  const handleCloseDialog = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        handleCloseDialog()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, handleCloseDialog])

  return (
    <div className="flex items-center justify-center">
        <img ref={buttonRef} src={Whatfix} alt="Whatfix" className="h-20 w-56" onClick={handleOpenDialog}/> 
      {/* <Button size="md" text={"Leave"} reference={buttonRef} onClick={handleOpenDialog}/> */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            style={{
              position: "absolute",
              top: buttonRef.current
                ? buttonRef.current.getBoundingClientRect().bottom + window.scrollY + 10
                : "auto",
              left: buttonRef.current
                ? buttonRef.current.getBoundingClientRect().left
                : "auto",
              transformOrigin: "top left",
              zIndex: 1000, // Ensure it appears above other elements
            }}
            className="w-60 bg-black text-white rounded-lg shadow-lg p-4 "
          >
            <div className="flex justify-between items-center mb-4">
              {/* <h3 className="text-lg font-semibold">Are you sure you want to close the application?</h3> */}
              {/* <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                <X className="h-4 w-4" />
              </Button> */}
            </div>
            <p className="text-sm text-center text-gray-400 mb-4">
            Are you sure you want to close the application?
            </p>
            <div className="flex justify-center gap-2">
              <Button size="md" text={"Cancel"} onClick={handleCloseDialog}/>
              <Button color="red" size="md" text={"Leave"} onClick={handleClose}/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

