import { Globe } from "lucide-react";
import { useEffect, useState } from "react";

export const CityClock = ({ city, timeZone, offset }: any) => {
  const [dateTime, setDateTime] = useState({ time: "", date: "" });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const dateFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone,
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "2-digit",
      });

      setDateTime({
        time: timeFormatter.format(now),
        date: dateFormatter.format(now),
      });
    };

    updateDateTime(); // initial
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  console.log("CityClock", city, dateTime.time, dateTime.date);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 w-full mt-auto">
      
        <div
          key={city}
          className="bg-black/40 backdrop-blur-sm rounded-lg p-4 text-white border border-white/5 transition-all hover:bg-black/50 flex justify-center items-center gap-5"
        >
          <div className="flex items-center space-x-2 text-white/70 text-xl">
            <Globe size={14} />
            <span>{city}</span>
          </div>
          <div className="font-mono text-xl mt-1">
            {dateTime.time}
          </div>
          <div className="text-xl text-white/50 ">{offset}</div>
        </div>
    </div>
  );
};