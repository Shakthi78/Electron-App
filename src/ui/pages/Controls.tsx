import '../App.css'
import { LiaHandPaper } from "react-icons/lia";
import { stopMediaAccess } from '../components/MeetingCard';
import { useEffect, useRef, useState } from 'react';
// import OneRoom from "../../../OneRoom1.png"
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeOff, Plus, Minus, Tablet } from 'lucide-react';
import { Slider } from "radix-ui";
// import { LuTouchpad } from 'react-icons/lu';
import Touchpad from "../components/dialog-components/Touchpad"
import { FaRegKeyboard } from 'react-icons/fa';
import AnimatedBackground from '../components/AnimatedBackground';
import RoomInfo from '../components/RoomInfo';


function Controls() {
  const [roomName, setRoomName] = useState("")
  const [capacity, setCapacity] = useState("")
  const [mute, setMute] = useState<boolean>(false)
  const [video, setVideo] = useState<boolean>(false)
  const [hand, setHand] = useState<boolean>(false)
  const [loading, setLoading] = useState(false)

  const [volume, setVolume] = useState(0);
  const [speaker, setSpeaker] = useState(false);

  const [isTouch, setIsTouch] = useState(false)

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
    resetStopwatch()
    setTimeout(() => {
      window.electronAPI.closeMeeting()
      setLoading(false)
    }, 3000);
  }

  useEffect(()=>{
    const customRoomName = localStorage.getItem("RoomName")
    const Capacity = localStorage.getItem("Capacity")

    if(customRoomName){
      setRoomName(customRoomName)
    }
    if(Capacity){
      setCapacity(Capacity)
    }

    startStopwatch()

  // Sync initial volume with system on mount
  window.electronAPI.getVolume().then((systemVolume: any) => {
    setVolume(systemVolume);
    setSpeaker(systemVolume === 0);
  }).catch((error:any) => console.error("Failed to get initial volume:", error));
  }, [])

  console.log("volume", volume)

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start the stopwatch
  const startStopwatch = () => {
    if (!isRunning) {
      setIsRunning(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      } 
      // Prevent multiple intervals
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1000); // Increase by 1 second
      }, 1000);
    }
  };

  // Reset the stopwatch
  const resetStopwatch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTime(0);
    setIsRunning(false);
  };

  // Format time
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="bg-container h-screen flex items-center flex-col select-none">
      <AnimatedBackground/>

      <div className='w-full h-20 flex justify-between items-center px-5 py-2 mt-3'>
        <RoomInfo 
            roomName={roomName} 
            capacity={capacity}
          />
        <div className="text-white text-2xl ">
        <span className="text-blue-300">one</span>
        <span className="text-blue-100">room</span>
      </div>
      </div>      
       <div className='w-full h-full flex flex-col items-center justify-center gap-4 '>
        <div className="w-2/4 h-36 rounded-2xl flex justify-between p-4 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border border-white/10 transition-all" >
          <div className="flex flex-col text-medium gap-8">
            <h1 className="text-xl font-semibold mt-2">On Going Meeting</h1>
            <div>
              <h1 className="text-medium font-light">Meeting Controls</h1>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-5 mt-4 ">
            <div className="inline-flex items-center rounded-full border px-5 py-0.5 text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-green-100 text-green-600">
              {formatTime(time)}
            </div>
            <button disabled={loading} className={`px-6 py-2 rounded-2xl border-1 border-black-500 bg-red-600 hover:bg-red-500 border-none ${loading ? "opacity-50 cursor-not-allowed" : ""}`} onClick={handleCloseMeeting}>{loading === true ? "Loading": "Leave Meeting"}</button>
            {/* <Button text="Leave Meeting" size="md" color='red' onClick={handleCloseMeeting}/> */}
          </div>
        </div>
        <div className='w-2/4 h-20 rounded-xl text-white flex gap-3'>
          <div className='bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all flex justify-center items-center w-1/3 h-20' onClick={() =>{ handleControl('mute'); setMute(!mute)}}>
            { mute === false ? <Mic size={'40px'}/> : <MicOff size={"40px"} /> }
          </div>
          <div className='bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all flex justify-center items-center w-1/3 h-20' onClick={() => {handleControl('video'); setVideo(!video)}}>
            { video === false ? <Video size={'40px'}/>: <VideoOff size={'40px'}/>}
          </div>
          <div className={`${hand === false ? "bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border border-white/10 transition-all": "bg-blue-500"} rounded-xl flex justify-center items-center w-1/3 h-20 `} onClick={() => {handleControl('hand'); setHand(!hand)}}>
            <LiaHandPaper size={'40px'}/>
          </div>
          <div className='bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all flex justify-center items-center w-1/3 h-20' onClick={() => {setSpeaker(!speaker); window.electronAPI.toggleMute()}}>
          {speaker === false ? <Volume2 size={"40px"}/>: <VolumeOff size={"40px"}/>}
          </div>
          <div className='bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all flex justify-center items-center w-1/3 h-20' onClick={()=> window.electronAPI.openKeyboard()}>
            <FaRegKeyboard size={"30px"}/>
          </div>
        </div>
        <div className=' h-15 rounded-xl w-2/4 text-white flex gap-2'>
          {/* <div className='bg-zinc-900 rounded-xl flex justify-center items-center w-[15%] h-15'>
            {speaker === false ? <Volume2 size={"30px"}/>: <VolumeOff size={"30px"}/>}
          </div> */}
          <div className='bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all flex justify-center items-center w-[15%] h-15 ' onClick={decreaseVolume}>
            <Minus size={"30px"}/>
          </div>
          <div className='bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all flex p-6 items-center w-[50%] h-15'>
            <SliderDemo
            volume={volume}
            setVolume={(val) => {
              window.electronAPI.setVolume(val);
              setVolume(val);
              setSpeaker(val === 0);
            }}
            />
          </div>
          
          <div className='bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all flex justify-center items-center w-[15%] h-15 ' onClick={increaseVolume}>
            <Plus size={"30px"}/>
          </div>
          <div className='bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-lg text-white border border-white/10 transition-all flex justify-center items-center w-[20%] h-15 ' onClick={() => setIsTouch(true)}>
            {/* <Button icon={<LuTouchpad size={"30px"}/>} text="Touchpad" size="lg" color="black" onClick={() => setIsTouch(true)} /> */}
            <Tablet size={24} />
          </div>
            {isTouch && <Touchpad onClose={() => setIsTouch(false)} />}  
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
      className="relative flex h-5 w-full touch-none select-none items-center"
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

