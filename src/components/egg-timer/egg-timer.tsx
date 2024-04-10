"use client";

import "./style.css";
import { useCallback, useEffect, useState } from "react";
import { useTimer } from "@/hooks/useTimer";

type Event = React.ChangeEvent<HTMLInputElement>;

export function EggTimer() {
  const [initialTime, setInitialTime] = useState([29, 40]);
  const [initialTime2, setInitialTime2] = useState([4, 40]);
  const [time, isRun, setIsRun] = useTimer(initialTime);
  const [time2, isRun2, setIsRun2] = useTimer(initialTime2);

  const resetTimer = useCallback(() => setIsRun(false), [setIsRun]);
  const runTimer2 = useCallback(() => setIsRun2(true), [setIsRun2]);
  const runAll = useCallback(() => {
    setIsRun(true);
    setIsRun2(true);
  }, [setIsRun, setIsRun2]);

  const onChangeMin = useCallback((e: Event) => {
    let min = parseFloat(e.target.value);
    if (min > 99 || min < 0) return;
    setInitialTime((x) => [min, x[1]]);
  }, []);
  const onChangeSec = useCallback((e: Event) => {
    let sec = parseFloat(e.target.value);
    if (sec > 59) sec = 0;
    if (sec < 0) sec = 59;
    setInitialTime((x) => [x[0], sec]);
  }, []);
  const onChangeMin2 = useCallback((e: Event) => {
    let min = parseFloat(e.target.value);
    if (min > 99 || min < 0) return;
    setInitialTime2((x) => [min, x[1]]);
  }, []);
  const onChangeSec2 = useCallback((e: Event) => {
    let sec = parseFloat(e.target.value);
    if (sec > 59) sec = 0;
    if (sec < 0) sec = 59;
    setInitialTime2((x) => [x[0], sec]);
  }, []);

  useEffect(() => {
    if (!isRun) setIsRun2(false);
  }, [isRun, setIsRun2]);

  return (
    <>
      <div className="egg-timer text-blue-500">
        {isRun ? (
          <>
            {("0" + time.min).slice(-2)}:{("0" + time.sec).slice(-2)}
          </>
        ) : (
          <div>
            <input
              type="number"
              inputMode="numeric"
              aria-label="timer1-min"
              value={("00" + initialTime[0]).slice(-2)}
              onChange={onChangeMin}
            />
            <span>:</span>
            <input
              type="number"
              inputMode="numeric"
              aria-label="timer1-sec"
              value={("00" + initialTime[1]).slice(-2)}
              onChange={onChangeSec}
            />
          </div>
        )}
      </div>

      <div className="egg-timer text-pink-400">
        {isRun ? (
          <>
            {("0" + time2.min).slice(-2)}:{("0" + time2.sec).slice(-2)}
          </>
        ) : (
          <div>
            <input
              type="number"
              inputMode="numeric"
              aria-label="timer2-min"
              value={("0" + initialTime2[0]).slice(-2)}
              onChange={onChangeMin2}
            />
            <span>:</span>
            <input
              type="number"
              inputMode="numeric"
              aria-label="timer2-sec"
              value={("0" + initialTime2[1]).slice(-2)}
              onChange={onChangeSec2}
            />
          </div>
        )}
      </div>

      <div>
        {isRun ? (
          !isRun2 && (
            <button className="btn-pink" onClick={runTimer2}>
              Run
            </button>
          )
        ) : (
          <button className="btn-blue" onClick={runAll}>
            Start
          </button>
        )}
      </div>

      <div>
        {isRun && (
          <button className="btn-light" onClick={resetTimer}>
            Reset
          </button>
        )}
      </div>
    </>
  );
}
