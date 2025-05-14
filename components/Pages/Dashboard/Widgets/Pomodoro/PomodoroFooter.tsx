import { Pause, Play, RotateCw, Settings } from "lucide-react";
import Space from "../../../../space";

type PomodoroFooterProps = {
  setIsPlaying: (isPlaying: boolean) => void;
  isPlaying: boolean;
  setOpenSettings: (openSettings: boolean) => void;
  onReset: () => void;
  data: any;
};

export default function PomodoroFooter({
  setIsPlaying,
  isPlaying,
  setOpenSettings,
  onReset,
  data,
}: Readonly<PomodoroFooterProps>) {
  return (
    <div style={{ padding: "10px 20px 0px 20px" }}>
      <Space gap={10} align="center">
        <i
          className="pomodoro-widget-icon"
          onClick={() => setOpenSettings(true)}
        >
          <Settings size={18} />
        </i>
        <i
          className="pomodoro-widget-icon pomodoro-widget-icon-play"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </i>
        <i
          className="pomodoro-widget-icon"
          onClick={onReset}
        >
          <RotateCw size={18} />
        </i>
      </Space>
    </div>
  );
}
