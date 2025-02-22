import Button from "./Button"

import { Meeting } from "./Meetings"

const MeetingCard: React.FC<Meeting> = ({title, startTime, endTime, organizer}) => {
  function separate(time: string){
    let result;
    let a = time.split(" ")
    result = a[1]+ " " +a[2]
    return result;
  }


  let start = separate(startTime)
  let end = separate(endTime)
  
  return (
    <div className="w-full h-40 rounded-2xl flex justify-between p-4 bg-zinc-900 text-white shadow-xl" >
        <div className="flex flex-col text-medium">
          <h1 className="text-xl font-semibold mt-2">{title}</h1>
          <h1 className="text-sm font-light">{start} {end}</h1>
          <h1 className="text-medium font-light">{organizer}</h1>
        </div>
        <div className="flex flex-col text-center gap-4 mt-4">
          <h1>Icon</h1>
          <Button text="Start" size="md"/>
        </div>
    </div>
  )
}

export default MeetingCard