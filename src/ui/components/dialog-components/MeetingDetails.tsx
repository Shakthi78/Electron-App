
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import CustomKeyboard from "./CustomKeyboard"

interface MeetingDetailsProps {
  meetingType: "meet" | "zoom" | "webex" | "teams"
  onBack: () => void
  close: () => void
}

export default function MeetingDetails({ meetingType, onBack, close }: MeetingDetailsProps) {
  const [meetingId, setMeetingId] = useState("")
  const [password, setPassword] = useState("")
  const [activeInput, setActiveInput] = useState<"meetingId" | "password">("meetingId")

  const handleKeyPress = (key: string) => {
    if (activeInput === "meetingId") {
      setMeetingId((prev) => prev + key)
    } else {
      setPassword((prev) => prev + key)
    }
  }

  const handleBackspace = () => {
    if (activeInput === "meetingId") {
      setMeetingId((prev) => prev.slice(0, -1))
    } else {
      setPassword((prev) => prev.slice(0, -1))
    }
  }

  const handleClick = () => {
    if (meetingType === "meet") {
      window.electronAPI.startMeeting(`https://meet.google.com/${meetingId}`);
    } else if (meetingType === "webex") {
      window.electronAPI.startMeeting(
        `https://meet1502.webex.com/meet1502/j.php?MTID=${meetingId.replace(/\s/g, "")}`
      );
    } else if (meetingType === "teams") {
      window.electronAPI.startMeeting(
        `https://teams.live.com/meet/${meetingId.replace(/\s/g, "")}?p=${password}`
      );
    } else if (meetingType === "zoom") {
      let normalizedUrl = `https://app.zoom.us/wc/${meetingId.replace(/\s/g, "")}/join`;
      if (password) {
        const encodedPassword = encodeURIComponent(password);
        normalizedUrl += `?pwd=${encodedPassword}`;
      }
      window.electronAPI.startMeeting(normalizedUrl);
    }
    console.log(`Joining ${meetingType} meeting with ID: ${meetingId} and password: ${password}`);
    close()
  }

  const getPlatformName = () => {
    switch (meetingType) {
      case "meet":
        return "Google Meet"
      case "zoom":
        return "Zoom"
      case "webex":
        return "WebEx"
      case "teams":
        return "Microsoft Teams"
      default:
        return ""
    }
  }

  return (
    <div className="flex h-full flex-col items-center justify-start">
      <div className="mb-6 flex w-full items-center">
        <button onClick={onBack} className="flex items-center text-white hover:text-neutral-300 cursor-pointer">
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span>Back</span>
        </button>
        <h2 className="flex-1 text-center text-2xl font-bold">{getPlatformName()} Details</h2>
      </div>

      <div className="w-full max-w-lg space-y-4 rounded-lg bg-neutral-800 p-6 shadow-md">
        <div className="space-y-4 ">
          <div>
            <label htmlFor="meetingId" className="block text-sm font-medium text-white">
              Meeting ID
            </label>
            <input
              type="text"
              id="meetingId"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              onFocus={() => setActiveInput("meetingId")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter meeting ID"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setActiveInput("password")}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter password"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 w-full max-w-3xl">
        <CustomKeyboard onKeyPress={handleKeyPress} onBackspace={handleBackspace} handleClick={handleClick}  />
      </div>
    </div>
  )
}

