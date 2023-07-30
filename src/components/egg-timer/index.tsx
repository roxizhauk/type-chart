"use client";

import "./style.css";
import { memo, useCallback, useEffect, useState } from "react";
import useTimer from "@/hooks/useTimer";

function EggTimer() {
  const [time, setTime] = useState([29, 40]);
  const [time2, setTime2] = useState([4, 40]);

  const { currentTime, timer, isRun, setIsRun } = useTimer(time);
  const {
    initialTime: currentTime2,
    timer: timer2,
    isRun: isRun2,
    setIsRun: setIsRun2,
  } = useTimer(time2);

  const start = useCallback(() => {
    setIsRun(true);
    setIsRun2(true);
  }, [setIsRun, setIsRun2]);

  const reset = useCallback(() => setIsRun(false), [setIsRun]);

  const runTimer2 = useCallback(() => setIsRun2(true), [setIsRun2]);

  useEffect(() => {
    if (!isRun) setIsRun2(false);
  }, [isRun, setIsRun2]);

  return (
    <>
      <div className="egg-timer">
        {isRun ? (
          <span className="egg-timer-text-1">{timer}</span>
        ) : (
          <div className="egg-timer-text-1">
            <input
              type="number"
              inputMode="numeric"
              aria-label="hour-1"
              value={("00" + time[0]).slice(-2)}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (num > 99 || num < 0) return;
                setTime((x) => [num, x[1]]);
              }}
            />
            <span>:</span>
            <input
              type="number"
              inputMode="numeric"
              aria-label="min-1"
              value={("00" + time[1]).slice(-2)}
              onChange={(e) => {
                let num = parseFloat(e.target.value);
                if (num > 59) num = 0;
                if (num < 0) num = 59;
                setTime((x) => [x[0], num]);
              }}
            />
          </div>
        )}
      </div>
      <div className="egg-timer">
        {isRun ? (
          <span className="egg-timer-text-2">{timer2}</span>
        ) : (
          <div className="egg-timer-text-2">
            <input
              type="number"
              inputMode="numeric"
              aria-label="hour-2"
              value={("00" + time2[0]).slice(-2)}
              onChange={(e) => {
                let num = parseFloat(e.target.value);
                if (num > 99 || num < 0) return;
                setTime2((x) => [num, x[1]]);
              }}
            />
            <span>:</span>
            <input
              type="number"
              inputMode="numeric"
              aria-label="min-2"
              value={("00" + time2[1]).slice(-2)}
              onChange={(e) => {
                let num = parseFloat(e.target.value);
                if (num > 59) num = 0;
                if (num < 0) num = 59;
                return setTime2((x) => [x[0], num]);
              }}
            />
          </div>
        )}
      </div>
      <div>
        {isRun ? (
          !isRun2 && (
            <button className="btn btn-pink" onClick={runTimer2}>
              Run
            </button>
          )
        ) : (
          <button className="btn btn-blue" onClick={start}>
            Start
          </button>
        )}
      </div>
      <div>
        {isRun && (
          <button className="btn btn-light" onClick={reset}>
            Reset
          </button>
        )}
      </div>
    </>
  );
}

export default memo(EggTimer);
