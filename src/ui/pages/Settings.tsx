import { useEffect, useState } from "react";
import { FaWifi } from "react-icons/fa";
import { IoIosCloudDone } from "react-icons/io";
import { FaDisplay } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { FaTools } from "react-icons/fa";
import Button from "../components/Button";

const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("");
  const [networkInfo, setNetworkInfo] = useState({type: "Loading...", name: "Loading..."});

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
      
  }, []);

  const saveClose = ()=>{
    window.electronAPI.saveClose("/")
  }

  return (
    <div className="w-screen h-screen bg-black flex">
        <div className="w-1/6 h-full pt-5 mt-5 mb-5">
          <div></div>
          <div className="border-r-1 border-white h-full flex flex-col gap-2 p-2">
            {settingsItem.map((item, i)=>(
              <div 
              onClick={() => setSelectedTab(item.tab)} 
              className={`p-4 text-white ${selectedTab === item.tab ? "bg-neutral-700" : ""} w-full flex justify-center gap-4 hover:bg-neutral-700 rounded`}
              key={i}
            >
                <item.icon fontSize={"25px"}/>
                <h2>{item.text}</h2>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-5/6 h-full text-white">
          <div className="w-full h-[86%] border-2 border-amber-400 flex justify-center">
            {selectedTab === "network" && 
              <div className="px-4 bg-neutral-800 rounded w-64 h-18 mt-10 flex justify-around items-center"> 
                <FaWifi fontSize={"40px"}/> <p className="text-xl">{networkInfo.name}</p>
              </div>
            }
            
            {selectedTab === "license" && 
              <div className="border-2 border-amber-500 w-96 mt-5 flex flex-col gap-4">
                  <input className="border-2 border-white bg-white p-3 rounded-full text-black outline-none" type="text" />
                  <Button size="md" text="Activate"/>
              </div>
            }
            {selectedTab === "display" && <h1>🔒 Display Settings</h1>}
            {selectedTab === "calendar" && <h1>🔒 Calendar Settings</h1>}
            {selectedTab === "advance" && <h1>🔒 Advanced Settings</h1>}
          </div>
            
          <div className="h-[8%] flex justify-end  border-2 border-red-400 px-18">
            <button className="bg-green-600 px-4 py-2 rounded" onClick={saveClose}>Save & Close</button>
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