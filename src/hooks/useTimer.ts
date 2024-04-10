import { useState, useRef, useEffect, useCallback } from "react";

export function useTimer([min, sec]: number[]) {
  const [time, setTime] = useState({ min, sec });
  const [isRun, setIsRun] = useState(false);
  const intervalID = useRef(0);

  const tick = useCallback(
    () =>
      setTime((previousTime) => {
        const newTime = Object.assign({}, previousTime);
        if (previousTime.sec > 0) {
          newTime.sec -= 1;
        } else if (previousTime.min == 0) {
          clearInterval(intervalID.current);
          setIsRun(false);
        } else {
          newTime.min -= 1;
          newTime.sec = 59;
        }
        return newTime;
      }),
    [],
  );

  useEffect(() => setTime({ min, sec }), [min, sec]);
  useEffect(() => {
    if (isRun) {
      intervalID.current = window.setInterval(() => tick(), 1000);
      return () => {
        clearInterval(intervalID.current);
        setTime({ min, sec });
      }; // isRun == true 内に入れないと、マウント時にクリーンアップが走る
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRun]);

  return [time, isRun, setIsRun] as const;
}
