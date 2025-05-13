import dayjs from "dayjs";
import { Pause, Play, RotateCw, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import Space from "../../../space";
import Cup from "./cup";
export default function PomodoroWidget() {
  const [timer, setTimer] = useState(1500); // 25 minutes in seconds
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (timer <= 0) return; // Stop when timer reaches 0
    if (!isPlaying) return; // Stop when paused

    const interval = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0)); // Prevent going below 0
    }, 1000);

    return () => clearInterval(interval); // Cleanup
  }, [timer, isPlaying]); // Added isPlaying to dependencies

  // ... existing code ...

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

  return (
    <div className="pomodoro-widget">
      <div className="pomodoro-widget-header">
        <h5 className="pomodoro-widget-title">Pomodoro</h5>
        <p className="pomodoro-widget-subtitle">
          A simple pomodoro timer to help you stay focused and productive.
        </p>
      </div>
      <div className="pomodoro-widget-body">
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
              <div>
                <Cup />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "5px",
                }}
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
              <span className="pomodoro-widget-timer-date">
                {dayjs().format("ddd, DD MMM, HH:mm")}
              </span>
            </div>
          </div>
          <div className="wrapper">
            <div className="breath">
              <div className="flare1"></div>
              <div className="flare2"></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "10px 20px" }}>
        <Space gap={10} align="center">
          <i className="pomodoro-widget-icon">
            <Settings size={18} />
          </i>
          <i
            className="pomodoro-widget-icon pomodoro-widget-icon-play"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </i>
          <i className="pomodoro-widget-icon">
            <RotateCw size={18} />
          </i>
        </Space>
      </div>
    </div>
  );
}
