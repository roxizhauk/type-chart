import { useState, useEffect, useRef, useCallback } from "react";

function useTimer(defaultTime: number[]) {
  const [min, sec] = defaultTime;
  const [time, setTime] = useState({ min, sec });
  const [isRun, setIsRun] = useState(false);
  const intervalID = useRef(0);

  useEffect(() => {
    const [min, sec] = defaultTime;
    setTime({ min, sec });
  }, [defaultTime]);

  const tick = useCallback(() => {
    setTime((prevTime) => {
      const newTime = Object.assign({}, prevTime);
      if (prevTime.sec > 0) newTime.sec -= 1;
      if (prevTime.sec == 0) {
        if (prevTime.min == 0) {
          clearInterval(intervalID.current);
          setIsRun(false);
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
      return () => {
        clearInterval(intervalID.current);
        setTime({ min, sec });
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
}

export default useTimer;
