import React, { useEffect, useState } from "react";
import AfterClock from "../Components/AfterClock";
import BeforeClock from "../Components/BeforeClock";


export default function Clockpage() {
  const [currentTime, setCurrentTime] = useState(new Date());


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  if (currentTime.getHours() >= 88) {
    return (
      <AfterClock/>
    );
  }

  return (
    <BeforeClock/>
  );
}