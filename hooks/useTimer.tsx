import { useState, useEffect, useRef, useCallback } from "react";

const useTimer = (defaultTime: number[]) => {
  const [min, sec] = defaultTime;
  const initialTime = { min: min, sec: sec };
  const [time, setTime] = useState(initialTime);
  const [isRun, setIsRun] = useState(false);
  const intervalID = useRef(0);

  const tick = useCallback(() => {
    setTime((prvTime) => {
      const newTime = Object.assign({}, prvTime);
      if (prvTime.sec > 0) newTime.sec -= 1;
      if (prvTime.sec == 0) {
        if (prvTime.min == 0) {
          clearInterval(intervalID.current); // 00:00
          setIsRun(false);
          console.log("end", intervalID.current);
        } else {
          newTime.min -= 1;
          newTime.sec = 59;
        }
      }
      return newTime;
    });
  }, []);

  useEffect(() => {
    if (isRun) {
      intervalID.current = window.setInterval(() => tick(), 1000);
      console.log("setInterval", intervalID.current);
      return () => {
        clearInterval(intervalID.current);
        setTime(initialTime);
        console.log("clearInterval", intervalID.current);
      }; // isRun == true 内に入れないと、マウント時にクリーンアップが走る
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRun]);

  return {
    initialTime: min * 60 + sec,
    currentTime: time.min * 60 + time.sec,
    isRun,
    setIsRun,
    timer: (
      <>
        <span>{("00" + time.min).slice(-2)}</span>
        <span>:</span>
        <span>{("00" + time.sec).slice(-2)}</span>
      </>
    ),
    button: <button onClick={() => setIsRun(!isRun)}>{isRun ? "Reset" : "Start"}</button>,
  };
};

export default useTimer;
