import { useEffect, useState } from "react";
import Button from "./Button"
import Zoom from '../assets/Zoom.png'
import Teams from '../assets/Team.png'
import Google from '../assets/Google.png'
import Webex from '../assets/Webex.png'
import { Meeting } from "./Meetings"
import { Calendar, User } from "lucide-react";

let media: MediaStream | undefined | null;

const MeetingCard: React.FC<Meeting> = ({title, startTime, endTime, organizer, meetingLink}) => {
  const [logo, setLogo] = useState<string>("")
  const [canStart, setCanStart] = useState<boolean>(false);

  const handleClick = async() => {
    // media = await requestMediaAccess()
    let normalizedUrl = meetingLink;
    if (meetingLink.includes("app.zoom.us")) {
      normalizedUrl = meetingLink;
    } else if (meetingLink.includes("zoom.us")) {
      // Extract meeting ID and password (if present) from the original URL
      const urlObj = new URL(meetingLink);
      const meetingId = urlObj.pathname.split("/j/")[1]?.split("?")[0] || "";
      const pwd = urlObj.searchParams.get("pwd") || "";

      // Construct the web client URL
      normalizedUrl = `https://app.zoom.us/wc/${meetingId}/join`;
      if (pwd) {
        normalizedUrl += `?pwd=${encodeURIComponent(pwd)}`;
      }
    }else if (
      meetingLink.includes("teams.microsoft.com") ||
      meetingLink.includes("teams.live.com") ||
      meetingLink.includes("microsoft")
    ) {
      normalizedUrl = meetingLink; // Teams doesn’t need normalization
    }
    window.electronAPI.startMeeting(normalizedUrl);
    console.log("Meeting has started")
  }

  useEffect(() => {
   if (meetingLink && meetingLink !== "No meeting link") {
    if (meetingLink.includes("zoom")) setLogo("zoom");
    else if (meetingLink.includes("teams")) setLogo("teams");
    else if (meetingLink.includes("google")) setLogo("google");
    else if (meetingLink.includes("webex")) setLogo("webex");
    else setLogo("");
  } else {
    setLogo("");
  }

  const checkStartTime = () => {
    const now = new Date();

    const parseTime = (timeStr: string): Date => {
      const [clock, modifier] = timeStr.split(" ");
      const [hourStr, minuteStr] = clock.split(":");
      let hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      if (modifier === "PM" && hour !== 12) hour += 12;
      if (modifier === "AM" && hour === 12) hour = 0;
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
    };

      const start = parseTime(startTime);
      const end = parseTime(endTime);
      const showButton = now >= new Date(start.getTime() - 5 * 60 * 1000) && now <= end;

      setCanStart(showButton);
    };

    checkStartTime();
    const interval = setInterval(checkStartTime, 30 * 1000); // check every 30 seconds

    return () => clearInterval(interval);
  }, [startTime, meetingLink]);


  return (
    <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 text-white shadow-lg border border-white/10 w-full max-w-lg">
        {/* <div className="flex items-center space-x-3 mb-4">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <h2 className="text-xl font-semibold">Room Available</h2>
        </div> */}
        <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">{title}</h3>
          </div>

          <div className="flex items-center space-x-2 text-gray-200">
            <Calendar size={18} />
            <span>{startTime} - {endTime}</span>
          </div>

          <div className="flex items-center space-x-2 text-gray-200">
            <User size={18} />
            <span>Organized by {organizer}</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center gap-5 mt-2 mr-2">
          <div className="w-10 h-3 flex justify-center items-center select-none mb-3">
            {logo === 'zoom' && <img src={Zoom} alt="Zoom" /> }
            {logo === 'teams' && <img src={Teams} alt="Teams" /> }
            {logo === 'google' && <img src={Google} alt="Google" /> }
            {logo === 'webex' && <img src={Webex} alt="Webex" /> }
          </div>
          {meetingLink !== "No meeting link" && canStart && (
            <Button text="Start" size="md" color="light-black" onClick={handleClick} />
          )}
        </div>
        </div>

      </div>
    // {<div className="bg-black/30 backdrop-blur-md rounded-xl p-6 text-white shadow-lg border border-white/10 w-full max-w-lg flex justify-between" >
    //     <div className="flex flex-col text-medium gap-5">
    //       <h1 className="text-xl font-semibold mt-2 select-none">{title}</h1>
    //       <div>
    //         <div className="flex gap-3">
    //           <h1 className="text-sm font-light select-none">{startTime}</h1>
    //           <h1 className="text-sm font-light select-none">{endTime}</h1>
    //         </div>
    //         <h1 className="text-medium font-light select-none">{organizer}</h1>
    //       </div>

    //     </div>
    //     <div className="flex flex-col items-center text-center gap-7 mt-4">
    //       <div className="w-10 h-3 flex justify-center items-center select-none">
    //         {logo === 'zoom' && <img src={Zoom} alt="Zoom" /> }
    //         {logo === 'teams' && <img src={Teams} alt="Teams" /> }
    //         {logo === 'google' && <img src={Google} alt="Google" /> }
    //         {logo === 'webex' && <img src={Webex} alt="Webex" /> }
    //       </div>
    //       <Button text="Start" size="md" onClick={handleClick}/>
    //     </div>
    // </div>}
    // {
    //   <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 text-white shadow-lg border border-white/10 w-full max-w-lg">
    //     <div className="flex items-center space-x-3 mb-4">
    //       <div className="h-3 w-3 rounded-full bg-green-500"></div>
    //       <h2 className="text-xl font-semibold">Room Available</h2>
    //     </div>
    //     <div className="flex">
    //     <div className="space-y-4">
    //       <div className="flex justify-between items-center">
    //         <h3 className="text-xl font-medium">{title}</h3>
    //         <span className="px-3 py-1 bg-blue-500/50 rounded-full text-sm">
    //           in {formatMinutesAsTime(minutesUntil)}
    //         </span>
    //       </div>

    //       <div className="flex items-center space-x-2 text-gray-200">
    //         <Calendar size={18} />
    //         <span>{startTime} - {endTime}</span>
    //       </div>

    //       <div className="flex items-center space-x-2 text-gray-200">
    //         <User size={18} />
    //         <span>Organized by {organizer}</span>
    //       </div>
    //     </div>
    //     <div className="flex flex-col items-center text-center gap-7 mt-4">
    //       <div className="w-10 h-3 flex justify-center items-center select-none">
    //         {logo === 'zoom' && <img src={Zoom} alt="Zoom" /> }
    //         {logo === 'teams' && <img src={Teams} alt="Teams" /> }
    //         {logo === 'google' && <img src={Google} alt="Google" /> }
    //         {logo === 'webex' && <img src={Webex} alt="Webex" /> }
    //       </div>
    //       <Button text="Start" size="md" onClick={handleClick}/>
    //     </div>
    //     </div>

    //   </div>
    // }
  )
}

export default MeetingCard

// async function requestMediaAccess() {
//   try {
//     console.log("Requesting media devices in renderer...");
//     const stream = await navigator.mediaDevices.getUserMedia({
//         audio: true,
//         video: true,
//     });
//     console.log('Media access granted:', stream);
//     return stream;
//   } catch (error: any) {
//     console.error('Media access denied:', error.name, error.message);
//   }
// }

export function stopMediaAccess() {
  if (media) {
    media.getTracks().forEach((track) => track.stop());
    console.log('Media stream stopped.');
    media = null;
  }
}