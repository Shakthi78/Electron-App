import { useEffect, useRef, useState } from 'react'
import { MdClose } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
// import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dialogRef = useRef<HTMLDivElement>(null)
    // const navigate = useNavigate()

    const close = () => {
        setIsOpen(!isOpen)
    }

    const handleNavigate = ()=>{
        window.electronAPI.navigateTo("settings")
    }    

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
            close()
          }
        }
    
        if (isOpen) {
          document.addEventListener("mousedown", handleClickOutside)
        }
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside)
        }
      }, [isOpen])

  return (
    <div ref={dialogRef}>
        <BsThreeDots className='text-4xl' onClick={close}/>
        {isOpen && <div className='flex flex-col h-screen bg-black absolute top-0 left-0 text-white gap-3 w-48'>
          <div className='flex justify-end m-4' >
            <MdClose fontSize={'25px'} onClick={close}/>
          </div>
          <div className='flex flex-col text-center gap-3'>
            <button className='px-4 py-2 text-xl hover:bg-neutral-700 cursor-pointer'>
                Home
            </button>
            <button className='px-4 py-2 text-xl hover:bg-neutral-700 cursor-pointer' onClick={handleNavigate}>
                Settings
            </button>
          </div>
        </div>}
    </div>
    
  )
}

export default Sidebar