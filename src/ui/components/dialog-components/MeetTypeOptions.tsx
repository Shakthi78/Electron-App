import { ArrowLeft, Video, Play } from "lucide-react"

interface MeetTypeOptionsProps {
  onSelect: (option: "join" | "instant") => void
  onBack: () => void
}

export default function MeetTypeOptions({ onSelect, onBack }: MeetTypeOptionsProps) {
  return (
    <div className="flex h-full flex-col items-center justify-start">
      <div className="mb-8 flex w-full items-center">
        <button onClick={onBack} className="flex items-center text-white hover:text-neutral-400 cursor-pointer">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Back</span>
        </button>
        <h2 className="flex-1 text-center text-2xl font-bold">Google Meet Options</h2>
      </div>

      <div className="grid w-full max-w-md grid-cols-1 gap-6">
        <button
          onClick={() => onSelect("join")}
          className="flex items-center rounded-lg bg-blue-500 p-6 text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Video className="mr-4 h-8 w-8" />
          <div className="text-left">
            <h3 className="text-lg font-medium">Join with Meeting ID</h3>
            <p className="text-sm text-blue-100">Enter a meeting ID to join an existing meeting</p>
          </div>
        </button>

        <button
          onClick={() => onSelect("instant")}
          className="flex items-center rounded-lg bg-green-500 p-6 text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <Play className="mr-4 h-8 w-8" />
          <div className="text-left">
            <h3 className="text-lg font-medium">Start Instant Meeting</h3>
            <p className="text-sm text-green-100">Create a new meeting and start immediately</p>
          </div>
        </button>
      </div>
    </div>
  )
}

