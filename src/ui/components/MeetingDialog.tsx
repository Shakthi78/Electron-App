import { useState } from "react"
import '../App.css'
import Button from "./Button"
import Zoom from "../assets/Zoom.png";
import Teams from "../assets/Team.png";
import Google from "../assets/Google.png";

function MeetingDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>("")
  const [meetingId, setMeetingId] = useState("")
  const [password, setPassword] = useState("")

  const openDialog = () => setIsOpen(true)
  const closeDialog = () => {
    setIsOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setSelectedPlatform(null)
    setMeetingId("")
    setPassword("")
  }

  const handleJoinMeeting = () => {
    if (selectedPlatform === "google-meet") {
      // Logic to start instant Google Meet
      console.log("Starting instant Google Meet")
      window.electronAPI.startMeeting("https://meet.google.com/new")
      closeDialog()
    } else if (selectedPlatform && meetingId) {
      // Logic to join Zoom or Teams meeting
      if(selectedPlatform === "teams"){
        window.electronAPI.startMeeting(`https://teams.live.com/meet/${meetingId.replace(/\s/g, '')}?p=${password}`)
      }
      else if(selectedPlatform === "zoom"){
       let normalizedUrl = `https://app.zoom.us/wc/${meetingId.replace(/\s/g, '')}/join`;
        if (password) {
          const encodedPassword = encodeURIComponent(password);
          normalizedUrl += `?pwd=${encodedPassword}`;
        }
        window.electronAPI.startMeeting(normalizedUrl)
      }
      console.log(`Joining ${selectedPlatform} meeting with ID: ${meetingId} and password: ${password}`)
      closeDialog()
    }
  }

  if (!isOpen) {
    return (
      <div className="text-white border-none flex flex-col">
        <Button icon={true} text="New Call" size="lg" color="black" onClick={openDialog}/>
      </div>
    )
  }

  return (
    <div className="dialog-overlay" onClick={closeDialog}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Join a Meeting</h2>
          <button className="close-button" onClick={closeDialog}>
            ×
          </button>
        </div>

        <div className="dialog-body">
          <div className="platform-options">
            <div
              className={`platform-option ${selectedPlatform === "zoom" ? "selected" : ""}`}
              onClick={() => setSelectedPlatform("zoom")}
            >
              <div className="platform-icon">
                <img src={Zoom} alt="Zoom" />
              </div>
              <span>Zoom</span>
            </div>

            <div
              className={`platform-option ${selectedPlatform === "teams" ? "selected" : ""}`}
              onClick={() => setSelectedPlatform("teams")}
            >
              <div className="platform-icon">
                <img src={Teams} alt="Teams" />
              </div>
              <span>Teams</span>
            </div>

            <div
              className={`platform-option ${selectedPlatform === "google-meet" ? "selected" : ""} text-center`}
              onClick={() => setSelectedPlatform("google-meet")}
            >
              <div className="platform-icon">
                <img src={Google} alt="Google" />
              </div>
              <span>Meet</span>
            </div>
          </div>

          {(selectedPlatform === "zoom" || selectedPlatform === "teams") && (
            <div className="meeting-details">
              <div className="form-group">
                <label htmlFor="meeting-id">Meeting ID</label>
                <input
                  id="meeting-id"
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  placeholder={selectedPlatform === "zoom" ? "123 456 7890" : "example@teams.com"}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter meeting password"
                />
              </div>
            </div>
          )}

          <button
            className="join-button"
            onClick={handleJoinMeeting}
            disabled={
              selectedPlatform === null || ((selectedPlatform === "zoom" || selectedPlatform === "teams") && !meetingId)
            }
          >
            {selectedPlatform === "google-meet"
              ? "Start Instant Meeting"
              : selectedPlatform
                ? "Join Meeting"
                : "Select a platform"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MeetingDialog

