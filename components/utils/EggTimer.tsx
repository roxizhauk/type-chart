"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useTimer from "@/hooks/useTimer";

const EggTimer = () => {
  const [time30, setTime30] = useState([29, 40]);
  const [time05, setTime05] = useState([4, 40]);

  const {
    currentTime: currentTime30,
    timer: timer30,
    isRun: isRun30,
    setIsRun: setIsRun30,
  } = useTimer(time30);

  const {
    initialTime: currentTime05,
    timer: timer05,
    isRun: isRun05,
    setIsRun: setIsRun05,
  } = useTimer(time05);

  const isHidden = useRef(false);

  const runTimer05 = useCallback(() => setIsRun05(true), [setIsRun05]);

  const runTimers = useCallback(() => {
    setIsRun30(true);
    setIsRun05(true);
  }, [setIsRun30, setIsRun05]);

  const killTimers = useCallback(() => {
    setIsRun30(false);
    setIsRun05(false);
  }, [setIsRun30, setIsRun05]);

  useEffect(() => {
    if (currentTime30 <= currentTime05) {
      isHidden.current = true;
      setIsRun05(false);
    }
  }, [currentTime30, currentTime05, setIsRun05]);

  return (
    <>
      <div className="egg-timer">
        {isRun30 ? (
          <span className="egg-timer-text-1">{timer30}</span>
        ) : (
          <div className="egg-timer-text-1">
            <input
              type="number"
              inputMode="numeric"
              value={("00" + time30[0]).slice(-2)}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                if (num > 99 || num < 0) return;
                setTime30((x) => [num, x[1]]);
              }}
            />
            <span>:</span>
            <input
              type="number"
              inputMode="numeric"
              value={("00" + time30[1]).slice(-2)}
              onChange={(e) => {
                let num = parseFloat(e.target.value);
                if (num > 59) num = 0;
                if (num < 0) num = 59;
                setTime30((x) => [x[0], num]);
              }}
            />
          </div>
        )}
      </div>
      <div className="egg-timer">
        {isRun30 ? (
          <span className="egg-timer-text-2">{currentTime30 > currentTime05 && timer05}</span>
        ) : (
          <div className="egg-timer-text-2">
            <input
              type="number"
              inputMode="numeric"
              value={("00" + time05[0]).slice(-2)}
              onChange={(e) => {
                let num = parseFloat(e.target.value);
                if (num > 99 || num < 0) return;
                setTime05((x) => [num, x[1]]);
              }}
            />
            <span>:</span>
            <input
              type="number"
              inputMode="numeric"
              value={("00" + time05[1]).slice(-2)}
              onChange={(e) => {
                let num = parseFloat(e.target.value);
                if (num > 59) num = 0;
                if (num < 0) num = 59;
                return setTime05((x) => [x[0], num]);
              }}
            />
          </div>
        )}
      </div>
      <div>
        {isRun30 ? (
          <input type="button" className="btn btn-light" onClick={killTimers} value="Reset" />
        ) : (
          <input type="button" className="btn btn-blue" onClick={runTimers} value="Run" />
        )}
      </div>
      <div>
        {isRun30 && !isRun05 && !isHidden.current && (
          <input type="button" className="btn btn-pink" onClick={runTimer05} value="Run" />
        )}
      </div>
    </>
  );
};

export default EggTimer;
