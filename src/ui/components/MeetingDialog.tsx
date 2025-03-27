import { useState, useRef, useEffect } from "react";
import "../App.css";
import Button from "./Button";
import Zoom from "../assets/Zoom.png";
import Teams from "../assets/Team.png";
import Google from "../assets/Google.png";
import Webex from "../assets/webex.png";
import { SkipBackIcon as Backspace, ArrowUp, CornerDownLeft } from "lucide-react";
import { IoVideocamOutline } from "react-icons/io5";

function MeetingDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>("");
  const [meetingId, setMeetingId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isShifted, setIsShifted] = useState(false);
  const [activeField, setActiveField] = useState<"meetingId" | "password" | null>(null);
  const meetingIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => {
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedPlatform(null);
    setMeetingId("");
    setPassword("");
    setShowKeyboard(false);
    setActiveField(null);
    setIsShifted(false);
  };

  const handleJoinMeeting = () => {
    if (selectedPlatform === "google-meet-start") {
      console.log("Starting instant Google Meet");
      window.electronAPI.startMeeting("https://meet.google.com/new");
      closeDialog();
    } else if (selectedPlatform && meetingId) {
      if (selectedPlatform === "google-meet-join") {
        window.electronAPI.startMeeting(`https://meet.google.com/${meetingId}`);
      } else if (selectedPlatform === "webex") {
        window.electronAPI.startMeeting(
          `https://meet1502.webex.com/meet1502/j.php?MTID=${meetingId.replace(/\s/g, "")}`
        );
      } else if (selectedPlatform === "teams") {
        window.electronAPI.startMeeting(
          `https://teams.live.com/meet/${meetingId.replace(/\s/g, "")}?p=${password}`
        );
      } else if (selectedPlatform === "zoom") {
        let normalizedUrl = `https://app.zoom.us/wc/${meetingId.replace(/\s/g, "")}/join`;
        if (password) {
          const encodedPassword = encodeURIComponent(password);
          normalizedUrl += `?pwd=${encodedPassword}`;
        }
        window.electronAPI.startMeeting(normalizedUrl);
      }
      console.log(`Joining ${selectedPlatform} meeting with ID: ${meetingId} and password: ${password}`);
      closeDialog();
    }
  };

  // Keyboard Layouts
  const lowercaseKeys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m", ",", "."],
  ];

  const uppercaseKeys = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M", ",", "."],
  ];

  // Handle Key Press
  const handleKeyPress = (key: string) => {
    if (!activeField) return;
    const setValue = activeField === "meetingId" ? setMeetingId : setPassword;
    setValue((prev) => prev + key);
    (activeField === "meetingId" ? meetingIdRef : passwordRef).current?.focus();
  };

  const handleBackspace = () => {
    if (!activeField) return;
    const setValue = activeField === "meetingId" ? setMeetingId : setPassword;
    setValue((prev) => prev.slice(0, -1));
    (activeField === "meetingId" ? meetingIdRef : passwordRef).current?.focus();
  };

  const toggleShift = () => {
    setIsShifted((prev) => !prev);
    (activeField === "meetingId" ? meetingIdRef : passwordRef).current?.focus();
  };

  const handleEnter = () => {
    handleJoinMeeting();
  };

  const handleSpace = () => {
    if (!activeField) return;
    const setValue = activeField === "meetingId" ? setMeetingId : setPassword;
    setValue((prev) => prev + " ");
    (activeField === "meetingId" ? meetingIdRef : passwordRef).current?.focus();
  };

  // Close keyboard when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const keyboardElement = document.getElementById("virtual-keyboard");
      const meetingIdElement = meetingIdRef.current;
      const passwordElement = passwordRef.current;

      if (
        keyboardElement &&
        !keyboardElement.contains(event.target as Node) &&
        meetingIdElement &&
        !meetingIdElement.contains(event.target as Node) &&
        passwordElement &&
        !passwordElement.contains(event.target as Node)
      ) {
        setShowKeyboard(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderKeyboard = () => (
    <div id="virtual-keyboard" className="custom-keyboard">
      {(isShifted ? uppercaseKeys : lowercaseKeys).map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button
              key={key}
              className="keyboard-key"
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
      <div className="keyboard-row">
        <button className="keyboard-key" onClick={toggleShift}>
          <ArrowUp className={isShifted ? "text-blue-500" : ""} />
        </button>
        <button className="keyboard-key space-key" onClick={handleSpace}>
          Space
        </button>
        <button className="keyboard-key" onClick={handleBackspace}>
          <Backspace />
        </button>
        <button className="keyboard-key" onClick={handleEnter}>
          <CornerDownLeft />
        </button>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="text-white border-none flex flex-col">
        <Button icon={<IoVideocamOutline size={"30px"}/>} text="New Call" size="lg" color="black" onClick={openDialog} />
      </div>
    );
  }

  return (
    <>
    <div className="dialog-overlay select-none" >
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Join a Meeting</h2>
          <button className="close-button" onClick={closeDialog}>×</button>
        </div>

        <div className="dialog-body">
          <div className="platform-options">
            <div
              className={`platform-option ${
                selectedPlatform === "google-meet" ||
                selectedPlatform === "google-meet-join" ||
                selectedPlatform === "google-meet-start"
                  ? "selected"
                  : ""
              } text-center`}
              onClick={() => setSelectedPlatform("google-meet")}
            >
              <div className="platform-icon">
                <img src={Google} alt="Google" />
              </div>
              <span>Meet</span>
            </div>

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
              className={`platform-option ${selectedPlatform === "webex" ? "selected" : ""}`}
              onClick={() => setSelectedPlatform("webex")}
            >
              <div className="platform-icon">
                <img src={Webex} alt="webex" />
              </div>
              <span>Webex</span>
            </div>
          </div>

          {selectedPlatform === "google-meet" && (
            <div className="flex justify-center gap-4 m-5">
              <Button text="Join" size="md" onClick={() => setSelectedPlatform("google-meet-join")} />
              <Button text="Start" size="md" onClick={() => setSelectedPlatform("google-meet-start")} />
            </div>
          )}

          {(selectedPlatform === "zoom" ||
            selectedPlatform === "teams" ||
            selectedPlatform === "google-meet-join" ||
            selectedPlatform === "webex") && (
            <div className="meeting-details">
              <div className="form-group">
                <label htmlFor="meeting-id">Meeting ID</label>
                <input
                  ref={meetingIdRef}
                  id="meeting-id"
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  onFocus={() => {
                    setShowKeyboard(true);
                    setActiveField("meetingId");
                  }}
                  placeholder="Meeting Id"
                />
              </div>

              {selectedPlatform !== "google-meet-join" && selectedPlatform !== "webex" && (
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    ref={passwordRef}
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => {
                      setShowKeyboard(true);
                      setActiveField("password");
                    }}
                    placeholder="Enter meeting password"
                  />
                </div>
              )}
            </div>
          )}

          <button
            className="join-button"
            onClick={handleJoinMeeting}
            disabled={
              selectedPlatform === null ||
              ((selectedPlatform === "webex" ||
                selectedPlatform === "zoom" ||
                selectedPlatform === "teams" ||
                selectedPlatform === "google-meet-join") &&
                !meetingId)
            }
          >
            {selectedPlatform === "google-meet-start"
              ? "Start Instant Meeting"
              : selectedPlatform
              ? "Join Meeting"
              : "Select a platform"}
          </button>

          
        </div>
      </div>
      <div>
        {showKeyboard && renderKeyboard()}
      </div>

      
    </div>
    </>
  );
}

export default MeetingDialog;