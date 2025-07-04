import { useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";
import { IoIosCloudDone } from "react-icons/io";
import { FaDisplay } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import Button from "../components/Button";
import axios from "axios";
import Editor from "../components/Editor";

interface RoomType {
  kind: string,
  etags: string,
  resourceId: string,
  resourceName: string,
  generatedResourceName: string,
  resourceEmail: string,
  capacity: number,
  buildingId: string,
  floorName: string,
  resourceCategory: string
}

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("network");
  const [networkInfo, setNetworkInfo] = useState({type: "Loading...", name: "Loading..."});
  const [selectedCalendar, setSelectedCalendar] = useState("none")
  const [selectedRoom, setSelectedRoom] = useState("");
  const [email, setEmail] = useState("")
  const [rooms, setRooms] = useState<RoomType[]>([])
  // const [customRoomName, setCustomRoomName] = useState<string>("")
  // const [capacity, setCapacity] = useState<string>("")
  // const [activate, setActivate] = useState(false)

  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
          if (!window.electronAPI || !window.electronAPI.getNetworkInfo) {
              throw new Error('electronAPI is not available');
          }
          const info = await window.electronAPI.getNetworkInfo();
          setNetworkInfo(info);
      } catch (err) {
          console.error('Failed to get network info:', err);
          setNetworkInfo({ type: 'Error', name: 'Error' });
      }
    }

    fetchNetworkInfo();
    // fetchRooms("support@exceleed.in")

    const handleUserEmail = async(userData: string) => {
      console.log("Received user email:", userData);
      localStorage.setItem('userEmail', userData);
      setEmail(userData)
      fetchRooms(userData);
      await axios.post("https://exceleed.in/api/v1/watch/create", {
        email: userData
      })
    };

    window.electronAPI.onUserEmail(handleUserEmail);

    const storedEmail = localStorage.getItem('userEmail');
    const storedRoom = localStorage.getItem('room')
    
    if (storedEmail) {
      fetchRooms(storedEmail);
      setSelectedCalendar("google")
      setEmail(storedEmail)
    }

    if(storedRoom){
      setSelectedRoom(storedRoom)
    }

    return () => {
      window.electronAPI.onUserEmail((userData) => { console.log(userData)}); // Remove previous listener
    };
      
  }, []);

  const fetchMeeting = async(email: string)=>{
    await axios.post("https://exceleed.in/api/v1/calendar/push-meetings/",{
      roomName: selectedRoom
    },  {
      headers: {
        "email": email,
        "Content-Type": "application/json",
      }
    })
  }

  const fetchRooms = async (email: string) => {
    const response: any = await axios.get("https://exceleed.in/api/v1/calendar/building-resources", {
      headers: {
        "email": email,
        "Content-Type": "application/json",
      }
    })    
    setRooms(response.data)  
  }
  
  console.log("Rooms", rooms)

  const saveClose = ()=>{
    localStorage.setItem("room", selectedRoom)
    const previousRoomName = localStorage.getItem("previousRoomName")
    console.log("previousRoomName", previousRoomName)
    if(selectedRoom !== "" && previousRoomName !== selectedRoom){
      localStorage.setItem("previousRoomName", selectedRoom)
      const email = localStorage.getItem('userEmail') as string;
      fetchMeeting(email)
      console.log("Fetching the meeting")
    }
    window.electronAPI.navigateTo("/")
  }

  const handleSubmit = (e: any) => {
    e.preventDefault(); 
    if(selectedCalendar === "none") return;
    window.electronAPI.authGoogle("https://exceleed.in")
    // setShowRoomDropdown(true);
  }

  console.log("selectedRoom", selectedRoom)

  return (
    <div className="w-screen h-screen bg-black/90 backdrop-blur-xl border border-white/10 shadow-xl text-white flex">
        <div className="w-1/6 h-full pt-5 mt-5 mb-5">
          <div></div>
          <div className="border-r-1 border-white h-full flex flex-col gap-2 p-2">
            {settingsItem.map((item, i)=>(
              <div 
              onClick={() => setSelectedTab(item.tab)} 
              className={`p-4 text-white ${selectedTab === item.tab ? "bg-neutral-800" : ""} w-full flex justify-center gap-4 hover:bg-neutral-800 rounded`}
              key={i}
            >
                <item.icon fontSize={"25px"}/>
                <h2>{item.text}</h2>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-5/6 h-full text-white">
          <div className="w-full h-[86%] flex justify-center">
            {selectedTab === "network" && 
              <div className="px-4 bg-neutral-800 backdrop-blur-lg rounded-xl shadow-xl transition-all w-64 h-18 mt-10 flex justify-around items-center"> 
                <FaWifi fontSize={"40px"}/> <p className="text-xl">{networkInfo.name}</p>
              </div>
            }
            
            {selectedTab === "license" && 
              <div className="w-2/4 h-[40%] 2xl:h-[25%]  mt-32 flex flex-col gap-4 bg-neutral-800 backdrop-blur-lg shadow-xl transition-all p-5 pt-8 rounded-2xl">
                <h2 className="text-xl">Enter a license key</h2>
                  <input className="border-2 border-white bg-white p-2 rounded-xl text-black outline-none" type="text" />
                  <div className="flex justify-center items-center">
                    <Button size="md" color="blue" text="Activate" />
                  </div>
              </div>
            }
            {selectedTab === "display" && <div className="mt-28 w-1/2 flex gap-4 h-[30%]">
              
              <div className="w-1/2 flex bg-neutral-800 backdrop-blur-lg shadow-xl transition-all gap-4 p-4 justify-around items-center rounded-xl">
                <FaDisplay fontSize={"70px"}/>
                <div>
                  <p className="text-2xl">Main display</p>
                  <p>Name</p>
                </div>
              </div>
              <div className="w-1/2 flex bg-neutral-800 backdrop-blur-lg shadow-xl transition-all gap-4 p-4 justify-around items-center rounded-xl">
                <FaDisplay fontSize={"70px"}/>
                <div>
                  <p className="text-2xl">Console</p>
                  <p>Name</p>
                </div>
              </div>
            </div> }
            {selectedTab === "calendar" && <div className="w-[90%] mt-12 flex justify-center items-center flex-col">
              <form onSubmit={handleSubmit} className="w-1/2 h-[40%] 2xl:h-[25%]">
                <div className="flex justify-center  p-4 flex-col gap-4 bg-neutral-800 backdrop-blur-lg rounded-xl shadow-xl transition-all mt-4">
                  <label className="font-bold">Choose your calendar provider</label>
                  <select  value={selectedCalendar}
                  onChange={(e) => setSelectedCalendar(e.target.value)} name="calendar" id="calendar" className={` ${selectedCalendar === "google" ? "bg-green-300" : "bg-white"} text-black outline-0 w-full h-[40%] rounded px-3 py-1`}>
                      <option value="none">None</option>
                      <option value="google">Google Calendar</option>
                  </select>
                  <div className="flex justify-center items-center">
                    <Button type={"submit"} text="Activate" size="md" />
                  </div>
                  </div>
              </form>

                {/* Room Selection Dropdown - Appears after activation */}
                {email && (
                  <div className="w-1/2 h-[25%] 2xl:h-[15%] mt-10 flex flex-col gap-3 bg-neutral-800 backdrop-blur-lg shadow-xl transition-all p-4 rounded-xl">
                    <label className="font-bold">Select a Room</label>
                    <select onChange={(e) => setSelectedRoom(e.target.value)} value={selectedRoom} className="bg-white text-black outline-0 w-full rounded px-3 py-1">

                    {rooms.map((item)=>(
                      <option value={`${item.generatedResourceName}`}>{item.generatedResourceName}</option>                    
                    ))}
                    </select>                    
                  </div>
                )}
            </div> }

            {selectedTab === "advance" && (
              <div className="w-full flex flex-col items-center mt-20 gap-4">
                {/* <div className="bg-neutral-800 backdrop-blur-lg shadow-xl transition-all rounded-xl w-1/3 p-4 h-40 flex flex-col gap-4 mt-5">
                  <h1 className="font-bold">Room Name</h1>
                  <input value={customRoomName} onChange={(e)=> setCustomRoomName(e.target.value)} className={`border-2 border-white p-1 rounded-xl text-black outline-none ${activate === true ? "bg-green-300": "bg-white"}`} type="text" />
                  <div className="flex justify-center items-center">
                    <Button text="Enter" size="md" color="blue" onClick={()=> {localStorage.setItem("customRoomName", customRoomName); setActivate(true)}}/>
                  </div>
                </div> */}
                
                <Editor title={"RoomName"} />
                <Editor title={"Capacity"} />
              </div>
            )}
          </div>
            
          <div className="h-[8%] flex justify-end px-18">
           <div className="flex justify-center items-center">
            <button className="bg-green-600 px-4 py-2 rounded" onClick={saveClose}>Save & Close</button>
           </div>
          </div>
        </div>
    </div>
  )
}

export default Settings


const settingsItem = [
  {
    "text": "Network",
    "icon": FaWifi,
    "tab": "network"
  },
  {
    "text": "License",
    "icon": IoIosCloudDone,
    "tab": "license"
  },
  {
    "text": "Display",
    "icon": FaDisplay,
    "tab": "display"
  },
  {
    "text": "Calendar",
    "icon": FaCalendarAlt,
    "tab": "calendar"
  },
  {
    "text": "Advanced",
    "icon": FaTools,
    "tab": "advance"
  },
  
]