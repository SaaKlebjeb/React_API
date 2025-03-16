import  { useState, useEffect } from "react";
import { format } from "date-fns";

const RealTimeDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  // Use `date-fns` to format the date and time
  const formattedDate = format(currentDate, "eeee, MMMM do yyyy, hh:mm ");

  return (
    <div>
      <h1>Real-Time Date</h1>
      <p>{formattedDate}</p>
    </div>
  );
};

export default RealTimeDate;
