import './App.css'
import Button from './components/Button';
// import MeetingCard from './components/MeetingCard'
import { BsThreeDots } from "react-icons/bs";

function SecondaryApp() {
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const weekday = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <div className="bg-container h-screen flex items-center flex-col">
      <div className='w-full h-10 flex justify-between px-5 py-2'>
        <h2>Room Name</h2>
        <h2>Customizable logo</h2>
        <h2>Company Logo</h2>
      </div>     
      <div className='w-full h-full p-5 flex justify-center items-center gap-2'>
        <div className='w-1/3 h-96 mt-5 overflow-y-scroll custom-scrollbar flex flex-col gap-2'> 
          {/* <MeetingCard/>
          <MeetingCard/> 
          <MeetingCard/>
          <MeetingCard/>
          <MeetingCard/> */}
        </div>
        <div className='w-1/3 h-96 mt-5 flex flex-col items-center'>
          <div className='text-7xl text-center mt-10 '>
            <h1>{time}</h1>
            <h1 className='text-3xl'>{weekday}</h1>
          </div> 

          <div className='flex gap-2 mt-28'>
            <Button text="Video Call" size='lg'/>
            <Button text="Video Call" size='lg'/>
            <Button text="Video Call" size='lg'/>
          </div>  
        </div>      
      </div>     
      <div className='w-full h-10 flex justify-end px-5 hover:cursor-pointer'>
        <BsThreeDots className='text-4xl'/>
      </div>     
    </div>
  )
}

export default SecondaryApp
