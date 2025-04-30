import '../App.css'
import { useEffect, useState } from "react"
import Meetings from "../components/Meetings"
import AnimatedBackground from "../components/AnimatedBackground"
import BrandingBar from "../components/BrandingBar"
import RoomInfo from "../components/RoomInfo"
import TimeDisplay from "../components/TimeDisplay"
import TimeZoneDisplay from "../components/TimeZoneDisplay"
import Sidebar  from "../components/Sidebar"
import MeetingDialog from "../components/dialog-components/MeetingDialog"
import Touchpad from "../components/dialog-components/Touchpad"
import { Tablet, Video } from "lucide-react"
import QuickAction from "../components/QuickAction"
import { timeZones } from "../data/timezones"

const Home = ({worldClock}: {worldClock: boolean}) => {
  const [roomName, setRoomName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [capacity, setCapacity] = useState<string>("")

  useEffect(() => {
    const customRoomName = localStorage.getItem("RoomName") as string
    const Capacity = localStorage.getItem("Capacity") as string

    if (customRoomName) {
      setRoomName(customRoomName)
    }
    if (Capacity) {
      setCapacity(Capacity)
    }

  }, [])

  // const handleClick = ()=>{
  //   window.electronAPI.startMeeting("https://excalidraw.com/")
  // }

  const buttons = [
    {
      label: 'New Call',
      icon: <Video size={24} />,
      onClick: () => setIsDialogOpen(true),
    },
    {
      label: 'Touchpad',
      icon: <Tablet size={24} />,
      onClick: () => setIsTouch(true),
    }
  ];

  return (
    <>
      <AnimatedBackground />
      
      {isDialogOpen && <MeetingDialog onClose={() => setIsDialogOpen(false)} />}
      {isTouch && <Touchpad onClose={() => setIsTouch(false)} />}
            
      <div className="min-h-screen flex flex-col relative p-8">
        <BrandingBar />
        
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RoomInfo 
            roomName={roomName} 
            capacity={capacity}
          />
          
          <TimeDisplay/>
        </div>
        
        <div className="flex-grow flex gap-24 justify-center items-center">
          <div className='flex gap-20'>

          
          <Meetings/>

          <div className="flex space-x-4 justify-center items-center">
            {buttons.map((button, i) => (
              <QuickAction key={i} label={button.label} icon={button.icon} onClick={button.onClick} />
            ))}
            <Sidebar/>
            {/* <QuickAction label={"White"} icon={<Video size={24} />} onClick={handleClick} /> */}
          </div>
          </div>

        </div>

        {worldClock && (
            <TimeZoneDisplay timeZones={timeZones} />
        )}

      </div>
    </>
  )
}

export default Home

export const handleCloseClick = async () => {
  window.electronAPI.closeApp()
  console.log("Hello above is the error")
}
