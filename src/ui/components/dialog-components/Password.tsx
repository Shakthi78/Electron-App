import { X } from "lucide-react"
import { MeetingDialogProps } from "./MeetingDialog"
import { useEffect, useState } from "react"
import Button from "../Button"

const Password = ({onClose}: MeetingDialogProps) => {

    const [value, setValue] = useState<string>("")
    const [isWrong, setIsWrong] = useState<boolean>(false)
    const handleNavigate = ()=>{
        if(value === "4477"){
          setIsWrong(true)
          onClose()
          window.electronAPI.navigateTo("settings")
        }
        else{
            setIsWrong(true)
            setValue("")
            console.log("Wrong password")
        }
    }

    useEffect(() => {
      const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
          document.getElementById('my-button')?.click();
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-7xl overflow-hidden p-4 md:p-6 flex justify-center items-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-neutral-700 p-2 text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="h-full flex flex-col justify-center items-center gap-4">
            <h2>Enter your password</h2>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none text-white"
              placeholder="Enter Password"
            />
            <Button id="my-button" text="Enter" size="md" color="blue" onClick={handleNavigate}/>
            {isWrong && <p className="text-red-600 font-medium">Wrong password</p>}
        </div>
      </div>
    </div>
  )
}

export default Password