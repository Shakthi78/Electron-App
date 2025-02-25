import './App.css'
// import Button from './components/Button';
// import MeetingCard from './components/MeetingCard'
import { BsThreeDots } from "react-icons/bs";
import Dialog from './components/Dialog';
import { handleCloseClick } from './App';

function SecondaryApp() {
  const handleControl = (action: string) => {
    window.electronAPI.controlMeeting(action);
    console.log(`Control triggered: ${action}`);
  };

  const handleCloseApp = () => {
    window.electronAPI.closeApp();
  };

  const handleCloseMeeting = () => {
    handleControl('leave')
    window.electronAPI.closeMeeting()
  }

  return (
    <div className="bg-container h-screen flex items-center flex-col">
      <div className='w-full h-10 flex justify-between px-5 py-2'>
        <h2>Room Name</h2>
        <h2>Customizable logo</h2>
        <h2>Company Logo</h2>
      </div>     
       <div className='w-full h-full p-5 flex justify-center items-center gap-2'>
          <h2 className="text-2xl">Meeting Controls</h2>
          <div className="flex flex-wrap gap-4">
            <button
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={() => handleControl('mute')}
            >
                Mute/Unmute
            </button>
            <button
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={() => handleControl('video')}
            >
                Video On/Off
            </button>
            <button
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={() => handleControl('share')}
            >
                Share Screen
            </button>
            <button
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
                onClick={() => handleControl('hand')}
            >
                Raise Hand
            </button>
            <button
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                onClick={handleCloseMeeting}
            >
                Leave
            </button>
            <button
                className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700"
                onClick={handleCloseApp}
            >
                Close App
            </button>
          </div>
      </div>     
      <div className='w-full h-10 flex justify-end px-5 hover:cursor-pointer'>
        <BsThreeDots className='text-4xl'/>
        <Dialog handleClose={handleCloseClick}/>
        
      </div>     
    </div>
  )
}

export default SecondaryApp
