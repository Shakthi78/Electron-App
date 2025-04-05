import { useState } from "react"
import { X } from "lucide-react"
import MeetingOptions from "./MeetingOptions"
import MeetingDetails from "./MeetingDetails"
import MeetTypeOptions from "./MeetTypeOptions"
import InstantMeeting from "./InstantMeeting"

type MeetingType = "meet" | "zoom" | "webex" | "teams" | null
type MeetOption = "join" | "instant" | null

export interface MeetingDialogProps {
  onClose: () => void
}

export default function MeetingDialog({ onClose }: MeetingDialogProps) {
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingType>(null)
  const [meetOption, setMeetOption] = useState<MeetOption>(null)

  const handleBack = () => {
    // If we're in a Meet option, go back to Meet options
    if (selectedMeeting === "meet" && meetOption !== null) {
      setMeetOption(null)
    } else {
      // Otherwise go back to meeting selection
      setSelectedMeeting(null)
    }
  }

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
        {!selectedMeeting ? (
            <MeetingOptions onSelect={setSelectedMeeting} onSelectMeetOption={setMeetOption} />
          ) : selectedMeeting === "meet" && meetOption === null ? (
            <MeetTypeOptions onSelect={setMeetOption} onBack={handleBack} />
          ) : selectedMeeting === "meet" && meetOption === "instant" ? (
            <InstantMeeting onBack={handleBack} close={onClose}/>
          ) : (
            <MeetingDetails meetingType={selectedMeeting} onBack={handleBack} close={onClose} />
          )}
        </div>
      </div>
    </div>
  )
}

