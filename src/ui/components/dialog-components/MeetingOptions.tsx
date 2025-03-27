
// import { VideoIcon } from "lucide-react"
import { useState } from "react";
import Zoom from "../../assets/Zoom.png"
import Google from "../../assets/Google.png"
import Teams from "../../assets/Team.png"
import Webex from "../../assets/Webex.png"

interface MeetingOptionsProps {
  onSelect: (type: "meet" | "zoom" | "webex" | "teams") => void
  onSelectMeetOption: (option: "join" | "instant") => void
}

export default function MeetingOptions({ onSelect }: MeetingOptionsProps) {
    const [selectedPlatform, setSelectedPlatform] = useState<string | null>("");
    
  const options = [
    { id: "meet", name: "Google Meet", color: "bg-blue-500", icon: Google },
    { id: "zoom", name: "Zoom", color: "bg-blue-600", icon: Zoom },
    { id: "webex", name: "WebEx", color: "bg-green-600", icon: Webex },
    { id: "teams", name: "Microsoft Teams", color: "bg-purple-600", icon: Teams },
  ]

  const handleMeetSelect = () => {
    // For Google Meet, we'll show additional options instead of going directly to details
    onSelect("meet")
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h2 className="mb-8 text-center text-2xl font-bold">Select Meeting Platform</h2>
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {options.map((option) => (
          <div className="dialog-body">
            <div
              className={`platform-option ${selectedPlatform === option.id ? "selected" : ""}`}
              onClick={() => {option.id === "meet" ? handleMeetSelect() : onSelect(option.id as any); setSelectedPlatform(option.id)}}
            >
              <div className="platform-icon">
                <img src={option.icon} alt="Zoom" />
              </div>
              <span>{option.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

