
import { useState, useRef, useEffect } from "react"
import { SkipBackIcon as Backspace, ArrowUp, CornerDownLeft } from "lucide-react"

export default function VirtualKeyboard() {
  const [inputValue, setInputValue] = useState("")
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [isShifted, setIsShifted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Define keyboard layouts
  const lowercaseKeys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", ",", "."],
  ]

  const uppercaseKeys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", "."],
  ]

  // Handle key press
  const handleKeyPress = (key: string) => {
    setInputValue((prev) => prev + key)
    inputRef.current?.focus()
  }

  // Handle backspace
  const handleBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1))
    inputRef.current?.focus()
  }

  // Handle shift key
  const toggleShift = () => {
    setIsShifted((prev) => !prev)
    inputRef.current?.focus()
  }

  // Handle enter key
  const handleEnter = () => {
    setInputValue((prev) => prev + "\n")
    inputRef.current?.focus()
  }

  // Handle space key
  const handleSpace = () => {
    setInputValue((prev) => prev + " ")
    inputRef.current?.focus()
  }

  // Close keyboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const keyboardElement = document.getElementById("virtual-keyboard")
      const inputElement = inputRef.current

      if (
        keyboardElement &&
        !keyboardElement.contains(event.target as Node) &&
        inputElement &&
        !inputElement.contains(event.target as Node)
      ) {
        setShowKeyboard(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Virtual Keyboard</h1>

      <div className="w-full relative mb-8">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowKeyboard(true)}
          placeholder="Click here to type..."
          className="w-full p-3 text-lg"
        />
      </div>

      {showKeyboard && (
        <div
          id="virtual-keyboard"
          className="w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-2 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          {/* Render keyboard rows */}
          {(isShifted ? uppercaseKeys : lowercaseKeys).map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center mb-2">
              {row.map((key) => (
                <button
                  key={key}
                  
                  className="m-1 w-10 h-10 flex items-center justify-center text-lg"
                  onClick={() => handleKeyPress(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          ))}

          {/* Bottom row with special keys */}
          <div className="flex justify-center mb-2">
            <button  className="m-1 px-3 h-10 flex items-center justify-center" onClick={toggleShift}>
              <ArrowUp className={isShifted ? "text-primary" : ""} />
            </button>

            <button
              className="m-1 flex-grow h-10 flex items-center justify-center"
              onClick={handleSpace}
            >
              Space
            </button>

            <button
              className="m-1 px-3 h-10 flex items-center justify-center"
              onClick={handleBackspace}
            >
              <Backspace />
            </button>

            <button className="m-1 px-3 h-10 flex items-center justify-center" onClick={handleEnter}>
              <CornerDownLeft />
            </button>
          </div>

          {/* Close keyboard button */}
          <div className="flex justify-center">
            <button className="w-full mt-1" onClick={() => setShowKeyboard(false)}>
              Close Keyboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

