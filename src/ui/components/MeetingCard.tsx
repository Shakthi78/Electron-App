import Button from "./Button"

import { Meeting } from "./Meetings"

const MeetingCard: React.FC<Meeting> = ({title, startTime, endTime, organizer, meetingLink}) => {
  function separate(time: string){
    let result;
    let a = time.split(" ")
    result = a[1]+ " " +a[2]
    return result;
  }

  let start = separate(startTime)
  let end = separate(endTime)

  const handleClick = async() => {
    await requestMediaAccess()
    window.electronAPI.startMeeting(meetingLink);
    console.log("Meeting has started")
  }
  
  return (
    <div className="w-full h-40 rounded-2xl flex justify-between p-4 bg-zinc-900 text-white shadow-xl" >
        <div className="flex flex-col text-medium">
          <h1 className="text-xl font-semibold mt-2">{title}</h1>
          <h1 className="text-sm font-light">{start} {end}</h1>
          <h1 className="text-medium font-light">{organizer}</h1>
        </div>
        <div className="flex flex-col text-center gap-4 mt-4">
          <h1>Icon</h1>
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