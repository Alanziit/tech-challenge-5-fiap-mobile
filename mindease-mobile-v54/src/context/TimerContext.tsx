
import React, { createContext, useContext, useState, useEffect } from 'react';

type TimerContextType = {
  time: number;
  running: boolean;
  start: (seconds: number) => void;
  pause: () => void;
};

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const i = setInterval(() => setTime(t => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(i);
  }, [running]);

  const start = (seconds: number) => {
    setTime(seconds);
    setRunning(true);
  };

  const pause = () => setRunning(false);

  return (
    <TimerContext.Provider value={{ time, running, start, pause }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used inside TimerProvider");
  return ctx;
}
