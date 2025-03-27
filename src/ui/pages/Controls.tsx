import '../App.css'
import { LiaHandPaper } from "react-icons/lia";
import { stopMediaAccess } from '../components/MeetingCard';
import { useEffect, useState } from 'react';
import OneRoom from "../../../OneRoom1.png"
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeOff, Plus, Minus  } from 'lucide-react';
import { Slider } from "radix-ui";



function Controls() {
  const [roomName, setRoomName] = useState("")
  const [mute, setMute] = useState<boolean>(false)
  const [video, setVideo] = useState<boolean>(false)
  const [hand, setHand] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const [volume, setVolume] = useState(0);
  const [speaker, setSpeaker] = useState(false);

  const increaseVolume = () => {
    window.electronAPI.increaseVolume();
    setVolume((prev) => {
      const newVolume = Math.min(prev + 10, 100);
      setSpeaker(newVolume === 0);
      return newVolume;
    });
  };

  const decreaseVolume = () => {
    window.electronAPI.decreaseVolume();
    setVolume((prev) => {
      const newVolume = Math.max(prev - 10, 0);
      setSpeaker(newVolume === 0);
      return newVolume;
    });
  };




  const handleControl = (action: string) => {
    window.electronAPI.controlMeeting(action);
    console.log(`Control triggered: ${action}`);
  };

  const handleCloseMeeting = async () => {
    await stopMediaAccess()
    setLoading(true)
    handleControl('leave')
    setTimeout(() => {
      window.electronAPI.closeMeeting()
      setLoading(false)
    }, 5000);
  }

  useEffect(()=>{
    const customRoomName = localStorage.getItem("customRoomName")

    if(customRoomName){
      setRoomName(customRoomName)
    }

  // Sync initial volume with system on mount
  window.electronAPI.getVolume().then((systemVolume: any) => {
    setVolume(systemVolume);
    setSpeaker(systemVolume === 0);
  }).catch((error:any) => console.error("Failed to get initial volume:", error));
  }, [])

  console.log("volume", volume)

  return (
    <div className="bg-container h-screen flex items-center flex-col select-none">
      <div className='w-full h-20 flex justify-between items-center px-5 py-2 mt-3'>
        <h2 className="text-xl font-semibold select-none"><p className="text-sm">Room</p> {roomName}</h2>
        <h2></h2>
        <img src={OneRoom} alt="OneRoom" className="h-20 w-30"/>
      </div>      
       <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
        <div className="w-1/3 h-36 rounded-2xl flex justify-between p-4 bg-zinc-900 text-white shadow-xl" >
          <div className="flex flex-col text-medium gap-5">
            <h1 className="text-xl font-semibold mt-2">On Going Meeting</h1>
            <div>
              <h1 className="text-medium font-light">Meeting Controls</h1>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-7 mt-4">
            <div className="w-10 h-3 flex justify-center items-center">
              
            </div>
            <button disabled={loading} className={`px-6 py-2 rounded-2xl border-1 border-black-500 bg-red-600 hover:bg-red-500 border-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handleCloseMeeting}>{loading === true ? "Loading": "Leave Meeting"}</button>
            {/* <Button text="Leave Meeting" size="md" color='red' onClick={handleCloseMeeting}/> */}
          </div>
        </div>
        <div className='w-1/3 h-20 rounded-xl text-white flex gap-3'>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-1/3 h-20 hover:bg-neutral-700' onClick={() =>{ handleControl('mute'); setMute(!mute)}}>
            { mute === false ? <Mic size={'40px'}/> : <MicOff size={"40px"} /> }
          </div>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-1/3 h-20 hover:bg-neutral-700' onClick={() => {handleControl('video'); setVideo(!video)}}>
            { video === false ? <Video size={'40px'}/>: <VideoOff size={'40px'}/>}
          </div>
          <div className={`${hand === false ? "bg-zinc-900 hover:bg-neutral-700": "bg-blue-500"} rounded-xl flex justify-center items-center w-1/3 h-20 `} onClick={() => {handleControl('hand'); setHand(!hand)}}>
            <LiaHandPaper size={'40px'}/>
          </div>
        </div>
        <div className=' h-10 rounded-xl w-1/3 text-white flex gap-2'>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-[15%] h-10'>
            {speaker === false ? <Volume2 size={"30px"}/>: <VolumeOff size={"30px"}/>}
          </div>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-[15%] h-10 hover:bg-neutral-700' onClick={increaseVolume}>
            <Plus size={"30px"}/>
          </div>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-[55%] h-10 hover:bg-neutral-700'>
          <SliderDemo
          volume={volume}
          setVolume={(val) => {
            window.electronAPI.setVolume(val);
            setVolume(val);
            setSpeaker(val === 0);
          }}
        />
          </div>
          <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-[15%] h-10 hover:bg-neutral-700' onClick={decreaseVolume}>
            <Minus size={"30px"}/>
          </div>
          
        </div>
      </div>     
      <div className='w-full h-10 flex justify-start px-5 hover:cursor-pointer'>
        {/* <BsThreeDots className='text-4xl'/>
        <Dialog handleClose={handleCloseClick}/> */}
        
      </div>      
    </div>
  )
}

export default Controls

interface VolumeType {
  volume: number;
  setVolume: (value: number) => void;
}

const SliderDemo = ({ volume, setVolume }: VolumeType) => {
  const handleChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
  };

  return (
    <Slider.Root
      className="relative flex h-5 w-[200px] touch-none select-none items-center"
      value={[volume]}
      onValueChange={handleChange}
      max={100}
      step={1}
    >
      <Slider.Track className="relative h-[3px] grow rounded-full bg-blackA7">
        <Slider.Range className="absolute h-full rounded-full bg-white" />
      </Slider.Track>
      <Slider.Thumb className="block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-blackA5 focus:outline-none" />
    </Slider.Root>
  );
};

