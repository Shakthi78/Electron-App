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

    // const loadMeetings = async () => {
    //     try {
    //         const data = await fetchMeetings(roomName);
    //         setMeetings(data as Meeting[]);
    //     } catch (error) {
    //         console.error('Error fetching meetings:', error);
    //     }
    // };

    const fetchMeetings = async (roomname: string)=>{
        const response = await axios.get(`https://exceleed.in/api/v1/meetings/${roomname}`)
        setMeetings(response.data as Meeting[])
    
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