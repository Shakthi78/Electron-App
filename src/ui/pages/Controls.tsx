import '../App.css'
// import Button from './components/Button';
// import MeetingCard from './components/MeetingCard'
import { BsThreeDots } from "react-icons/bs";
import Dialog from '../components/Dialog';
import { handleCloseClick } from './Home';
import { VscMic } from "react-icons/vsc";
import Button from '../components/Button';
import { IoVideocamOutline } from 'react-icons/io5';
import { LiaHandPaper } from "react-icons/lia";

function Controls() {
  const handleControl = (action: string) => {
    window.electronAPI.controlMeeting(action);
    console.log(`Control triggered: ${action}`);
  };

  const handleCloseMeeting = () => {
    handleControl('leave')
    setTimeout(() => {
      window.electronAPI.closeMeeting()
    }, 5000);
  }

  return (
    <div className="bg-container h-screen flex items-center flex-col">
      <div className='w-full h-10 flex justify-between px-5 py-2'>
        <h2>Room Name</h2>
        <h2>Customizable logo</h2>
        <h2>Company Logo</h2>
      </div>     
       <div className='w-full h-full flex flex-col justify-center items-center gap-4'>
        <div className="w-1/3 h-36 rounded-2xl flex justify-between p-4 bg-zinc-900 text-white shadow-xl" >
          <div className="flex flex-col text-medium gap-5">
            <h1 className="text-xl font-semibold mt-2">Meeting</h1>
            <div>
              <h1 className="text-medium font-light">Support</h1>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-7 mt-4">
            <div className="w-10 h-3 flex justify-center items-center">
              
            </div>
            <Button text="Leave Meeting" size="md" color='red' onClick={handleCloseMeeting}/>
          </div>
        </div>
        <div className='w-1/3 h-20 rounded-xl text-white flex gap-3'>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-1/3 h-20 hover:bg-neutral-700' onClick={() => handleControl('mute')}>
            <VscMic size={'40px'}/>
          </div>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-1/3 h-20 hover:bg-neutral-700' onClick={() => handleControl('video')}>
            <IoVideocamOutline size={'40px'}/>
          </div>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-1/3 h-20 hover:bg-neutral-700' onClick={() => handleControl('hand')}>
            <LiaHandPaper size={'40px'}/>
          </div>
        </div>
      </div>     
      <div className='w-full h-10 flex justify-start px-5 hover:cursor-pointer'>
        <BsThreeDots className='text-4xl'/>
        <Dialog handleClose={handleCloseClick}/>
        
      </div>      
    </div>
  )
}

export default Controls
