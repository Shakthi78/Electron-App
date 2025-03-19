import { useEffect, useState } from "react";
import Button from "./Button"
import Zoom from '../assets/Zoom.png'
import Teams from '../assets/Team.png'
import Google from '../assets/Google.png'
import Webex from '../assets/Google.png'
import { Meeting } from "./Meetings"

let media: MediaStream | null;

const MeetingCard: React.FC<Meeting> = ({title, startTime, endTime, organizer, meetingLink}) => {
  const [logo, setLogo] = useState<string>("")

  const handleClick = async() => {
    media = await requestMediaAccess()
    window.electronAPI.startMeeting(meetingLink);
    console.log("Meeting has started")
  }

  useEffect(() => {
    if(meetingLink?.includes('zoom')){
      setLogo("zoom")
    }
    else if(meetingLink?.includes('teams')){
      setLogo("teams")
    }
    else if(meetingLink?.includes('google')){
      setLogo("google")
    }
    else if(meetingLink?.includes('webex')){
      setLogo("webex")
    }
  }, [])
  
  
  return (
    <div className="w-full h-40 rounded-2xl flex justify-between p-4 bg-zinc-900 text-white shadow-xl mt-2" >
        <div className="flex flex-col text-medium gap-5">
          <h1 className="text-xl font-semibold mt-2">{title}</h1>
          <div>
            <div className="flex gap-3">
              <h1 className="text-sm font-light">{startTime}</h1>
              <h1 className="text-sm font-light">{endTime}</h1>
            </div>
            <h1 className="text-medium font-light">{organizer}</h1>
          </div>
          
        </div>
        <div className="flex flex-col items-center text-center gap-7 mt-4">
          <div className="w-10 h-3 flex justify-center items-center">
            {logo === 'zoom' && <img src={Zoom} alt="Zoom" /> }
            {logo === 'teams' && <img src={Teams} alt="Teams" /> }
            {logo === 'google' && <img src={Google} alt="Google" /> }
            {logo === 'webex' && <img src={Webex} alt="webex" /> }
          </div>
          <Button text="Start" size="md" onClick={handleClick}/>
        </div>
    </div>
  )
}

export default MeetingCard

async function requestMediaAccess() {
  try {
      console.log("Requesting media devices in renderer...");
      const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
      });
      console.log('Media access granted:', stream);
      return stream;
  } catch (error: any) {
      console.error('Media access denied:', error.name, error.message);
      alert(`Failed to access media devices: ${error.name} - ${error.message}`);
      throw error;
  }
}

export function stopMediaAccess() {
  if (media) {
    media.getTracks().forEach((track : any) => track.stop());
    console.log('Media stream stopped.');
    media = null;
  }
}