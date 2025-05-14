import { useEffect, useState } from "react";
import { account } from "../../../../../constant/appwrite";
import PomodoroTimer from "./PomodoroTimer";
import SettingsPomodoro from "./SettingsPomodoro";

export default function PomodoroWidget() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [data, setData] = useState<any>({});

  useEffect(() => {
    const fetchPomodoro = async () => {
      const pomodoro = await account.getPrefs();
      const pomodoroData = JSON.parse(pomodoro.pomodoro);
      setData(pomodoroData);
    };
    fetchPomodoro();
  }, []);

  return (
    <div className="pomodoro-widget">
      <div className="pomodoro-widget-header">
        <h5 className="pomodoro-widget-title">Pomodoro</h5>
        <p className="pomodoro-widget-subtitle">
          A simple pomodoro timer to help you stay focused and productive.
        </p>
      </div>
      {openSettings ? (
        <SettingsPomodoro data={data} setOpenSettings={setOpenSettings} />
      ) : (
        <PomodoroTimer
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          data={data}
          setOpenSettings={setOpenSettings}
        />
      )}
    </div>
  );
}
