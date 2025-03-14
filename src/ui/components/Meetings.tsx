import { useEffect, useState } from "react"
import MeetingCard from "./MeetingCard"
import axios from "axios";
import { webSocketService } from "../services/websocket";
// import { fetchMeetings } from "../services/api";

export interface Meeting {
  id: number;
  roomMail: string;
  userEmail: string;
  meetingId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
  organizer: string;
}

const Meetings = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([])

    const roomName = 'Exceleed-2-Elon musk (13)';

    const fetchMeetings = async (roomname: string)=>{
      const response: any = await axios.get(`https://exceleed.in/api/v1/meetings/${roomname}`)
      const rawMeetings = response.data as Meeting[];

      // Parse and sort meetings by startTime, format both startTime and endTime
    const sortedMeetings = rawMeetings
    .map((meeting) => {
      // Parse startTime and endTime into Date objects
      const startTimeDate = new Date(
        meeting.startTime.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1") // "2025-03-14 04:00:00 PM"
      );
      const endTimeDate = new Date(
        meeting.endTime.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1") // "2025-03-14 05:00:00 PM"
      );

      // Format to hours and minutes only (e.g., "04:00 PM")
      const formattedStartTime = startTimeDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const formattedEndTime = endTimeDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      return {
        ...meeting,
        startTimeDate, // Temporary for sorting
        startTime: formattedStartTime, // Overwrite with formatted time
        endTime: formattedEndTime,     // Overwrite with formatted time
      };
    })
    .sort((a, b) => a.startTimeDate.getTime() - b.startTimeDate.getTime()) // Sort by startTime
    .map(({ startTimeDate, ...rest }) => rest); // Remove temporary startTimeDate

      setMeetings(sortedMeetings);
      console.log("Meetings", response.data)
    }

    useEffect(() => {
      fetchMeetings(roomName);

      webSocketService.connect(roomName);
      const unsubscribe = webSocketService.onMessage((message) => {
        if (message.type === 'EVENT_UPDATE' && message.roomName === roomName) {
          fetchMeetings(roomName);
        }
      });

      return () => unsubscribe();
    }, []);
    
      

    //   useEffect(()=>{
    //     fetchMeetings(roomName)
    //   }, [])
  return (
    <div className="relative w-1/3 h-96 mt-5 overflow-y-scroll flex flex-col gap-2 custom-scrollbar mask-gradient pt-4">
        {meetings.map((item, i)=>(
          <MeetingCard key={i} {...item}/>
        ))}
          
        </div>
  )
}

export default Meetings