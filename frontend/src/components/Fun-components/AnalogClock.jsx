import { useState, useEffect } from "react";

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-4 right-4 flex flex-col items-center">
      <div className="relative w-30 h-30 bg-white border-4 border-gray-300 rounded-full shadow-lg flex items-center justify-center">
       
        <div
          className="absolute w-1 bg-black h-9 origin-bottom"
          style={{ transform: `rotate(${time.getSeconds() * 6}deg)` }}
        ></div>
        <div
          className="absolute w-1.5 bg-gray-800 h-7 origin-bottom"
          style={{ transform: `rotate(${time.getMinutes() * 6}deg)` }}
        ></div>
        <div
          className="absolute w-1.5 bg-red-600 h-5 origin-bottom"
          style={{ transform: `rotate(${time.getHours() * 30}deg)` }}
        ></div>
      </div>
      <p className="text-gray-600 font-semibold mt-2">
        {time.toLocaleTimeString()}
      </p>
    </div>
  );
};

export default AnalogClock;
