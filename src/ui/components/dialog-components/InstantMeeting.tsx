import { ArrowLeft, Video } from "lucide-react"

interface InstantMeetingProps {
  onBack: () => void
  close: () => void
}

export default function InstantMeeting({ onBack, close }: InstantMeetingProps) {
  const handleStartMeeting = () => {
    // In a real app, this would initiate an API call to create a meeting
    // alert("Starting instant meeting...")
    // You could redirect to the meeting URL or open a new window here
    console.log("Starting instant Google Meet");
    window.electronAPI.startMeeting("https://meet.google.com/new");
    close()
  }

  return (
    <div className="flex h-full flex-col items-center justify-start">
      <div className="mb-8 flex w-full items-center">
        <button onClick={onBack} className="flex items-center text-white hover:text-neutral-400 cursor-pointer">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Back</span>
        </button>
        <h2 className="flex-1 text-center text-2xl font-bold">Instant Meeting</h2>
      </div>

      <div className="w-full max-w-md space-y-8 rounded-lg bg-neutral-700 p-8 text-center shadow-md">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <Video className="h-12 w-12 text-blue-500" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-medium">Ready to start your meeting?</h3>
          <p className="text-gray-500">Your instant meeting will be created and you can invite others to join.</p>
        </div>

        <button
          onClick={handleStartMeeting}
          className="inline-flex items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-lg font-medium text-white shadow-md transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Start Meeting Now
        </button>
      </div>
    </div>
  )
}

