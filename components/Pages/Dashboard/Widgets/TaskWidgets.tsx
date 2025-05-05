import { Ellipsis, TrendingUp } from "lucide-react";
import Space from "../../../space";

interface TaskWidgetsProps {
  label: string;
  subLabel?: string;
}

export default function TaskWidgets({
  label,
  subLabel,
}: Readonly<TaskWidgetsProps>) {
  const removeSpace = (label: string) => {
    return label.replace(/\s+/g, "");
  };

  return (
    <div className="progress-widget">
      <Space gap={10} align="evenly" fill className="progress-widget-header">
        <div>
          <Space gap={8}>
            <div className={`progress-icon ${removeSpace(label)}`} />
            <h1 className="progress-widget-title">{label}</h1>
          </Space>
        </div>
        <i>
          <Ellipsis size={17} />
        </i>
      </Space>
      <div className="progress-widget-content">
        <Space gap={10} align="evenly" fill>
          <p className="progress-widget-content-title">10</p>
          <div className="progress-widget-line">
            <i>
              <TrendingUp size={13} />
            </i>
            <span>20%</span>
          </div>
        </Space>
        <p className="progress-widget-content-subtitle">{subLabel}</p>
      </div>
    </div>
  );
}
