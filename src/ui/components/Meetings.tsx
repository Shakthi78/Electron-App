import { useEffect, useRef, useState } from "react"
import MeetingCard from "./MeetingCard"
import axios from "axios";
import { webSocketService } from "../services/websocket";
// import later from '@breejs/later';
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
    const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

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

       // Clear old timeouts
      timeoutRefs.current.forEach(clearTimeout);
      timeoutRefs.current = [];

      // Schedule a re-fetch after each meeting ends
      rawMeetings.forEach((meeting) => {
        const endTimeDate = new Date(meeting.endTime.replace(/(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1"));
        const delay = endTimeDate.getTime() - Date.now();

        if (delay > 0) {
          const timeoutId = setTimeout(() => {
            fetchMeetings(roomname);
          }, delay);

          timeoutRefs.current.push(timeoutId);
        }
      });
    }

    // later.date.localTime();
    // // Run every day at 7:00 AM IST
    // const sched = later.parse.recur()
    // .on(19).hour()       // 7 AM
    // .on(12).minute();
    
    // later.setInterval(async() => {
    //   console.log("Task running at 7:00 AM");
    //   console.log("Running job at 7:00 AM IST");
    //   const response: any = await axios.post("https://exceleed.in/api/v1/re-pushMeetings", {
    //     roomName,
    //     email
    //   })
    //   if(response.data.status === 200){
    //     fetchMeetings(roomName)
    //   }
    // }, sched);

    function scheduleDailyTaskAt(hour: number, task: () => void) {
      const interval = setInterval(() => {
        const now = new Date();
        console.log("running...")
        console.log(now.getHours(), hour, "hrs")
        if (now.getHours() === hour) {
          task();
        }
      }, 50 * 60 * 1000); // Check every 50 min

      return () => clearInterval(interval)
    }

    useEffect(() => {
      fetchMeetings(roomName);

      // Example: run at 7:00 AM IST
      scheduleDailyTaskAt(7, async() => {
        fetchMeetings(roomName)
      });

      webSocketService.connect(roomName);
      const unsubscribe = webSocketService.onMessage((message) => {
        if (message.type === 'EVENT_UPDATE' && message.roomName === roomName) {
          fetchMeetings(roomName);
        }
      });

      return () => {
        unsubscribe();
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current = [];
      };
    }, []);
    
  return (
    // <div className="relative w-1/3 h-96 mt-5 overflow-y-scroll flex flex-col gap-2 custom-scrollbar mask-gradient pt-4">
    <>    
      <div className={`flex flex-col w-lg gap-2 mask-gradient custom-scrollbar overflow-y-scroll h-full xl:max-h-[20rem] 2xl:max-h-[35rem]`}>
        {meetings.map((item, i)=>(
          <MeetingCard key={i} {...item}/>
        ))}
    
        {meetings.length === 0 && (
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 text-white shadow-lg border border-white/10 w-full max-w-lg mb-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <h2 className="text-xl font-semibold">Room Available</h2>
            </div>
            
            <div className="py-6 text-center">
              <h3 className="text-2xl font-bold mb-2">No Upcoming Meetings</h3>
              <p className="text-gray-300">This room is free for the rest of the day</p>
            </div>
        </div>
        )}
      </div>
    </>
  // </div>
  )
}

export default Meetings