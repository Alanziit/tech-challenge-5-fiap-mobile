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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current as any);
    };
  }, []);

  const start = (seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current as any);
    setTime(seconds);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current as any);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as any);
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
