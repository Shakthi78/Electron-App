import { useEffect, useState } from "react"
import MeetingCard from "./MeetingCard"
import axios from "axios";
import { webSocketService } from "../services/websocket";
// import { fetchMeetings } from "../services/api";

export interface Meeting {
  id?: number;
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

    const roomName = localStorage.getItem('room') as string;

    const fetchMeetings = async (roomname: string) => {
      const response: any = await axios.get(`https://exceleed.in/api/v1/meetings/${roomname}`);
      const rawMeetings = response.data as Meeting[];
    
      // Get 6 AM of today
      const today6AM = new Date();
      today6AM.setHours(6, 0, 0, 0); // Set to 6 AM today
    
      // Get 6 AM of the next day
      const tomorrow6AM = new Date(today6AM);
      tomorrow6AM.setDate(today6AM.getDate() + 1); // Move to the next day
    
      // Get current time
      const now = new Date();
    
      // Parse, filter, sort, and format meetings
      const sortedMeetings = rawMeetings
        .map((meeting) => {
          // Convert DD-MM-YYYY to YYYY-MM-DD format for Date parsing
          const startTimeDate = new Date(meeting.startTime.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1"));
          const endTimeDate = new Date(meeting.endTime.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1"));
    
          return { ...meeting, startTimeDate, endTimeDate };
        })
        .filter(({ startTimeDate, endTimeDate }) => 
          startTimeDate >= today6AM && startTimeDate < tomorrow6AM && endTimeDate > now // Remove past meetings
        )
        .sort((a, b) => a.startTimeDate.getTime() - b.startTimeDate.getTime()) // Sort by startTime
        .map(({ startTimeDate, endTimeDate, ...meeting }) => ({
          ...meeting,
          startTime: startTimeDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
          endTime: endTimeDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
        }));
    
      setMeetings(sortedMeetings);
      console.log("Meetings", sortedMeetings);
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
    
  return (
    <div className="relative w-1/3 h-96 mt-5 overflow-y-scroll flex flex-col gap-2 custom-scrollbar mask-gradient pt-4">
        {meetings.map((item, i)=>(
          <MeetingCard key={i} {...item}/>
        ))}

        {meetings.length === 0 && (
          <div className="w-full h-40 rounded-2xl flex justify-between p-4 bg-zinc-900 text-white shadow-xl mt-2 select-none" >
            <div className="flex flex-col text-medium gap-5">
              <h1 className="text-xl font-semibold mt-5">No Meeting</h1>
              <div className="mt-2">
                <div className="flex gap-3">
                  
                </div>
                <h1 className="text-medium font-light pl-1">None</h1>
              </div>
              
            </div>
            <div className="flex flex-col items-center text-center gap-7 mt-4">
              <div className="w-10 h-3 flex justify-center items-center">
                
              </div>
            </div>
          </div>
        )}
          
        </div>
  )
}

export default Meetings