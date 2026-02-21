import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

interface ITimerContext {
  time: number;
  running: boolean;
  start: (seconds: number) => void;
  pause: () => void;
}

const TimerContext = createContext<ITimerContext | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [time, setTime] = useState<number>(0);
  const [running, setRunning] = useState<boolean>(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const start = (seconds: number) => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    setTime(seconds);
    setRunning(true);
    intervalRef.current = window.setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          if (intervalRef.current) window.clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  };

  return (
    <TimerContext.Provider value={{ time, running, start, pause }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used within TimerProvider");
  return ctx;
};

export default TimerProvider;
