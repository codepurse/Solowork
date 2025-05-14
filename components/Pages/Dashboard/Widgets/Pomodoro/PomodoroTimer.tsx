import { useEffect, useState } from "react";
import Cup from "../cup";
import PomodoroFooter from "./PomodoroFooter";

type PomodoroTimerProps = {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  data: any;
  setOpenSettings: (open: boolean) => void;
};

export default function PomodoroTimer({
  isPlaying,
  setIsPlaying,
  data,
  setOpenSettings,
}: Readonly<PomodoroTimerProps>) {
  const sessionDuration = data?.session ? data.session * 60 : 1500;
  const breakDuration = data?.break ? data.break * 60 : 300;
  const longBreakDuration = data?.longBreak ? data.longBreak * 60 : 900;
  const loop = data?.loop ?? 0;
  const loopLimit = loop > 0 ? loop : 0;

  const [timer, setTimer] = useState(sessionDuration);
  const [isSession, setIsSession] = useState(true);
  const [currentLoop, setCurrentLoop] = useState(0);

  useEffect(() => {
    if (!isPlaying || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, timer]);

  // When timer ends, switch between session/break and handle looping
  useEffect(() => {
    console.log(loopLimit, "loopLimit");
    if (timer === 0 && isPlaying) {
      console.log(loopLimit, "loopLimit");
      if (isSession) {
        // Finished session, go to break
        setIsSession(false);
        setTimer(
          currentLoop + 1 === loopLimit ? longBreakDuration : breakDuration
        );
      } else {
        // Finished break
        const nextLoop = currentLoop + 1;
        if (nextLoop <= loopLimit) {
          setCurrentLoop(nextLoop);
          setIsSession(true);
          setTimer(sessionDuration);
        } else {
          setIsPlaying(false); // Stop playback
        }
      }
    }
  }, [timer, isPlaying, loopLimit]);

  useEffect(() => {
    setTimer(sessionDuration);
    setIsSession(true);

    setCurrentLoop(0);
  }, [data]);

  const formatTimeParts = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    return {
      hours: pad(hours),
      minutes: pad(minutes),
      seconds: pad(seconds),
    };
  };

  const handleReset = () => {
    setTimer(sessionDuration);
    setIsSession(true);
    setCurrentLoop(0);
    setIsPlaying(false); // Stop the timer when reset
  };

  return (
    <div className="pomodoro-widget-body animate__animated animate__slideInLeft">
      <div className="outer-circle">
        <div className="pomodoro-widget-timer-container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <Cup />
            <div
              style={{ display: "flex", justifyContent: "center", gap: "5px" }}
            >
              <div className="pomodoro-widget-timer-hours-container">
                <span className="pomodoro-widget-timer-hours">
                  {formatTimeParts(timer).hours}
                </span>
                <label className="pomodoro-widget-timer-hours-label">
                  hours
                </label>
              </div>
              <div className="pomodoro-widget-timer-colon">:</div>
              <div className="pomodoro-widget-timer-hours-container">
                <span className="pomodoro-widget-timer-minutes">
                  {formatTimeParts(timer).minutes}
                </span>
                <label className="pomodoro-widget-timer-minutes-label">
                  min
                </label>
              </div>
              <div className="pomodoro-widget-timer-colon">:</div>
              <div className="pomodoro-widget-timer-hours-container">
                <span className="pomodoro-widget-timer-seconds">
                  {formatTimeParts(timer).seconds}
                </span>
                <label className="pomodoro-widget-timer-seconds-label">
                  sec
                </label>
              </div>
            </div>
            <span className="pomodoro-widget-timer-status">
              {isSession
                ? "Work Session"
                : currentLoop + 1 === loopLimit
                ? "Long Break"
                : "Short Break"}{" "}
              ({currentLoop}/{loopLimit})
            </span>
          </div>
        </div>
        <div className="wrapper">
          <div className={`breath ${isSession ? "" : "breath-break"}`}>
            <div
              className={`flare1 ${
                isSession ? "session-glow1" : "break-glow1"
              }`}
            ></div>
            <div
              className={`flare2 ${
                isSession ? "session-glow2" : "break-glow2"
              }`}
            ></div>
          </div>
        </div>
      </div>
      <PomodoroFooter
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
        setOpenSettings={setOpenSettings}
        onReset={handleReset}
        data={data}
      />
    </div>
  );
}
