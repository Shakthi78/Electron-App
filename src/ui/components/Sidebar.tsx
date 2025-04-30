import { useEffect, useRef, useState } from 'react'
import { MdClose } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import Password from './dialog-components/Password';
import QuickAction from './QuickAction';
// import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const dialogRef = useRef<HTMLDivElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

    // const navigate = useNavigate()

    const close = () => {
        setIsOpen(!isOpen)
    }

    const handlePassword = ()=>{
      setIsDialogOpen(true)
      close()
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
    <>
    <QuickAction label={"Settings"} icon={<IoSettingsOutline size={24}/>} onClick={close} />
    <div ref={dialogRef}>
        {/* <BsThreeDots className='text-4xl' onClick={close}/> */}
        {isOpen && <div className='flex flex-col h-screen bg-black absolute top-0 left-0 text-white gap-3 w-48 z-100'>
          <div className='flex justify-end m-4' >
            <MdClose fontSize={'25px'} onClick={close}/>
          </div>
          <div className='flex flex-col text-center gap-3'>
            <button className='px-4 py-2 text-xl hover:bg-neutral-700 cursor-pointer select-none'>
                Home
            </button>
            <button className='px-4 py-2 text-xl hover:bg-neutral-700 cursor-pointer select-none' onClick={handlePassword}>
                Settings
            </button>
          </div>
        </div>}
    </div>
    
    {isDialogOpen && <Password onClose={()=>{setIsDialogOpen(false)}}/> }
    </>
  )
}

export default Sidebar