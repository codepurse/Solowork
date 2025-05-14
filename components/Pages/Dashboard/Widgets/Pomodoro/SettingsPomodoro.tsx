import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { account } from "../../../../../constant/appwrite";
import Button from "../../../../Elements/Button";
import Space from "../../../../space";

type SettingsPomodoroProps = {
  data: any;
  setOpenSettings: (openSettings: boolean) => void;
};

export default function SettingsPomodoro({
  data,
  setOpenSettings,
}: Readonly<SettingsPomodoroProps>) {
  const [session, setSession] = useState(data?.session || 0);
  const [breakTime, setBreakTime] = useState(data?.break || 0);
  const [longBreak, setLongBreak] = useState(data?.longBreak || 0);
  const [loop, setLoop] = useState(data?.loop || 0);
  const [isLoading, setIsLoading] = useState(false);

  const safeSetSession = (value: number) => setSession(Math.max(1, value));
  const safeSetBreakTime = (value: number) => setBreakTime(Math.max(1, value));
  const safeSetLongBreak = (value: number) => setLongBreak(Math.max(1, value));
  const safeSetLoop = (value: number) => setLoop(Math.max(1, value));

  const updatePomodoro = async () => {
    setIsLoading(true);
    const data = JSON.stringify({
      session: session,
      break: breakTime,
      longBreak: longBreak,
      loop: loop,
    });

    try {
      await account.updatePrefs({
        pomodoro: data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setSession(data.session);
      setBreakTime(data.break);
      setLongBreak(data.longBreak);
      setLoop(data.loop);
    }
  }, [data]);

  return (
    <div className="pomodoro-widget-settings animate__animated animate__slideInLeft">
      <div className="pomodoro-widget-settings-header">
        <Space gap={10} align="evenly">
          <h5 className="pomodoro-widget-settings-title">Settings</h5>
          <i
            className="pomodoro-widget-settings-close"
            onClick={() => setOpenSettings(false)}
          >
            <X size={18} />
          </i>
        </Space>
      </div>
      <div className="pomodoro-widget-settings-body">
        <Space align="evenly" gap={5}>
          <h5 className="pomodoro-widget-settings-body-item-title">Session</h5>
          <div>
            <Space align="center" gap={10}>
              <i
                className="pomodoro-widget-settings-body-item-button"
                onClick={() => safeSetSession(session - 1)}
              >
                <Minus size={14} />
              </i>
              <span className="pomodoro-widget-settings-body-item-value">
                {session}
              </span>

              <i
                className="pomodoro-widget-settings-body-item-button"
                onClick={() => safeSetSession(session + 1)}
              >
                <Plus size={14} />
              </i>
            </Space>
          </div>
        </Space>
        <Space align="evenly" gap={5}>
          <h5 className="pomodoro-widget-settings-body-item-title">Break</h5>
          <div>
            <Space align="center" gap={10}>
              <i
                className="pomodoro-widget-settings-body-item-button"
                onClick={() => safeSetBreakTime(breakTime - 1)}
              >
                <Minus size={14} />
              </i>
              <span className="pomodoro-widget-settings-body-item-value">
                {breakTime}
              </span>
              <i
                className="pomodoro-widget-settings-body-item-button"
                onClick={() => safeSetBreakTime(breakTime + 1)}
              >
                <Plus size={14} />
              </i>
            </Space>
          </div>
        </Space>
        <Space align="evenly" gap={5}>
          <h5 className="pomodoro-widget-settings-body-item-title">
            Long Break
          </h5>
          <div>
            <Space align="center" gap={10}>
              <i
                className="pomodoro-widget-settings-body-item-button"
                onClick={() => safeSetLongBreak(longBreak - 1)}
              >
                <Minus size={14} />
              </i>

              <span className="pomodoro-widget-settings-body-item-value">
                {longBreak}
              </span>
              <i
                className="pomodoro-widget-settings-body-item-button"
                onClick={() => safeSetLongBreak(longBreak + 1)}
              >
                <Plus size={14} />
              </i>
            </Space>
          </div>
        </Space>
        <Space align="evenly" gap={5}>
          <h5 className="pomodoro-widget-settings-body-item-title">Loop</h5>
          <div>
            <Space align="center" gap={10}>
              <i
                className="pomodoro-widget-settings-body-item-button"
                onClick={() => safeSetLoop(loop - 1)}
              >
                <Minus size={14} />
              </i>

              <span className="pomodoro-widget-settings-body-item-value">
                {loop}
              </span>
              <i
                className="pomodoro-widget-settings-body-item-button"
                onClick={() => safeSetLoop(loop + 1)}
              >
                <Plus size={14} />
              </i>
            </Space>
          </div>
        </Space>
        <Button
          style={{ width: "100%" }}
          className="mt-2"
          onClick={updatePomodoro}
          loading={isLoading}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
