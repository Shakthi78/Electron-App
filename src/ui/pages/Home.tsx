import { useEffect, useState } from "react"
import Meetings from "../components/Meetings"
import Button from "../components/Button"
import Dialog from "../components/Dialog"
import Sidebar from "../components/Sidebar"
import MeetingDialog from "../components/MeetingDialog"

const Home = () => {
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
        
    return () => {
        clearInterval (interval)
    }
    }, [])
      
    const weekday = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="bg-container h-screen flex items-center flex-col">
      <div className='w-full h-10 flex justify-between px-5 py-2'>
        <h2>Room Name</h2>
        <h2>Customizable logo</h2>
        <h2>Company Logo</h2>
      </div>     
      <div className='w-full h-full p-5 flex justify-center items-center gap-24'>
        <Meetings/>
        <div className='w-1/3 h-96 mt-5 flex flex-col items-center'>
          <div className='text-7xl text-center mt-10 '>
            <h1>{time}</h1>
            <h1 className='text-3xl'>{weekday}</h1>
          </div> 

          <div className='flex gap-2 mt-20 text-white'>
            <MeetingDialog/>
            <Button color="black" text="Video Call" size='lg'/>
            <Button color="black" text="Video Call" size='lg'/>
          </div>  
        </div>      
      </div>     
      <div className='w-full h-10 flex justify-start px-5 hover:cursor-pointer'>
        <Sidebar/>
        <Dialog handleClose={handleCloseClick}/>
      </div>     
    </div>
  )
}

export default Home

export const handleCloseClick = async ()=>{
    window.electronAPI.closeApp()
    console.log("Hello above is the error")
  }
