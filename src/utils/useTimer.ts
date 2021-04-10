import {
  useEffect, useMemo, useRef, useState,
} from 'react';

interface Timer {
  increase(s: number): void;
  start(): void;
  stop(): void;
}

export function useTimer(max: number) {
  const [seconds, setSeconds] = useState(max);
  const timerHandle = useRef(0);
  const timer = useMemo<Timer>(() => ({
    increase(s = 1) {
      if (timerHandle.current) {
        setSeconds((prevSeconds) => Math.max(Math.min(prevSeconds + s + 1, max), 0));
      }
    },
    start() {
      if (!timerHandle.current) {
        timerHandle.current = window.setInterval(() => {
          setSeconds((prevSeconds) => {
            if (prevSeconds === 0) {
              window.clearInterval(timerHandle.current);
              timerHandle.current = 0;
              return 0;
            }

            return Math.max(prevSeconds - 1, 0);
          });
        }, 1000);
      }
    },
    stop() {
      if (timerHandle.current) {
        window.clearInterval(timerHandle.current);
        timerHandle.current = 0;
      }
    },
  }), [max]);

  useEffect(() => () => {
    if (timerHandle.current) {
      window.clearInterval(timerHandle.current);
    }
  }, []);

  return [seconds, timer] as [number, Timer];
}
