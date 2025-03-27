import { useState } from "react"
import { ArrowUp, Delete, CornerDownLeft } from "lucide-react"

interface CustomKeyboardProps {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  handleClick: () => void
}

export default function CustomKeyboard({ onKeyPress, onBackspace, handleClick }: CustomKeyboardProps) {
  const [isShifted, setIsShifted] = useState(false)

  // Define keyboard layouts
  const lowerCaseLayout = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", ",", "."],
  ]

  const upperCaseLayout = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", "."],
  ]

  const currentLayout = isShifted ? upperCaseLayout : lowerCaseLayout

  const toggleShift = () => {
    setIsShifted(!isShifted)
  }

  

  return (
    <div className="mt-6 w-full max-w-4xl rounded-lg bg-neutral-800 p-2 shadow-lg">
      <div className="space-y-2 p-2">
        {currentLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-1">
            {rowIndex === 3 && (
              <button
                onClick={toggleShift}
                className={`flex h-10 w-12 items-center justify-center rounded bg-neutral-700 hover:bg-neutral-600 text-sm font-medium ${isShifted ? "bg-primary text-white" : ""}`}
              >
                <ArrowUp className="h-5 w-5" />
              </button>
            )}

            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="flex h-10 w-8 items-center justify-center rounded bg-neutral-700 text-sm font-medium shadow hover:bg-neutral-600 sm:w-18"
              >
                {key}
              </button>
            ))}

            {rowIndex === 3 && (
              <button
                onClick={onBackspace}
                className="flex h-10 w-12 items-center justify-center rounded bg-neutral-700 text-sm font-medium hover:bg-neutral-600"
              >
                <Delete className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}

        <div className="flex justify-center space-x-1">
          <button
            onClick={() => onKeyPress("@")}
            className="flex h-10 w-10 items-center justify-center rounded bg-neutral-700 text-sm font-medium shadow hover:bg-neutral-600"
          >
            @
          </button>
          <button
            onClick={() => onKeyPress(" ")}
            className="flex h-10 w-40 items-center justify-center rounded bg-neutral-700 text-sm font-medium shadow hover:bg-neutral-600 sm:w-60"
          >
            Space
          </button>
          <button
            onClick={() => onKeyPress(".")}
            className="flex h-10 w-10 items-center justify-center rounded bg-neutral-700 text-sm font-medium shadow hover:bg-neutral-600"
          >
            $
          </button>
          <button onClick={handleClick} className="flex h-10 w-12 items-center justify-center rounded bg-blue-500 text-sm font-medium text-white">
            <CornerDownLeft className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

