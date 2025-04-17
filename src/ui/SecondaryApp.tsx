import { useEffect, useState } from "react"
import Meetings from "./components/Meetings"
import Button from "./components/Button"
import Dialog from "./components/Dialog"
import Sidebar from "./components/Sidebar"
// import MeetingDialog from "../components/MeetingDialog"
import OneRoom from "../../OneRoom1.png"
// import { FaRegKeyboard } from "react-icons/fa";
import { IoVideocamOutline } from "react-icons/io5"
import { LuTouchpad } from "react-icons/lu";
import MeetingDialog from "./components/dialog-components/MeetingDialog"
import Touchpad from "./components/dialog-components/Touchpad"
// import axios from "axios"

const SecondaryApp = () => {
  const [roomName, setRoomName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [time, setTime] = useState(new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }))

  useEffect(() => {
  const interval = setInterval(()=>{
      setTime(new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      }))
  }, 60 * 1000)

 

  const customRoomName = localStorage.getItem("customRoomName")

  if(customRoomName){
    setRoomName(customRoomName)
  }
      
  return () => {
      clearInterval (interval)
  }
  }, [])
    
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="bg-container h-screen flex items-center flex-col">
      <div className='w-full h-20 flex justify-between items-center px-5 py-2 mt-3'>
        <h2 className="text-xl font-semibold select-none flex flex-col"><p className="text-sm">Room</p> {roomName}</h2>
        <Dialog handleClose={handleCloseClick}/>
        <img src={OneRoom} alt="OneRoom" className="h-20 w-30 select-none"/>
      </div>     
      <div className='w-full h-full p-5 flex justify-center items-center gap-24'>
        <Meetings/>
        <div className='w-1/3 h-96 mt-5 flex flex-col items-center'>
          <div className='text-6xl text-center mt-9'>
            <h1 className="select-none">{time}</h1>
            <h1 className='text-2xl font-semibold mt-3 select-none'>{formatDate(new Date())}</h1>
          </div> 

          <div className='flex gap-2 mt-18 text-white'>
            {/* <MeetingDialog/> */}
            <Button icon={<IoVideocamOutline size={"30px"}/>} text="New Call" size="lg" color="black" onClick={() => setIsDialogOpen(true)} />
            {isDialogOpen && <MeetingDialog onClose={() => setIsDialogOpen(false)} />}
            {/* <Button color="black" text="Video Call" size='lg'/> */}
            {/* <Button icon={<FaRegKeyboard size={"30px"}/>}  text="Keyboard" size="lg" color="black" onClick={()=> window.electronAPI.openKeyboard()} /> */}
            <Sidebar/>

            <Button icon={<LuTouchpad size={"30px"}/>} text="Touchpad" size="lg" color="black" onClick={() => setIsTouch(true)} />
            {isTouch && <Touchpad onClose={() => setIsTouch(false)} />}
          </div>  
        </div>      
      </div>     
      <div className='w-full h-10 flex justify-end px-5 hover:cursor-pointer'>
        {/* <Dialog handleClose={handleCloseClick}/> */}
        {/* <Button text="Keyboard" size="md"  /> */}
      </div>  
    </div>
  )
}

export default SecondaryApp

export const handleCloseClick = async ()=>{
  window.electronAPI.closeApp()
  console.log("Hello above is the error")
}
