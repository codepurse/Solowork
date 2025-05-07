import dayjs from "dayjs";
import { Ellipsis } from "lucide-react";
import Space from "../../../space";

export default function RecentActivity() {
  return (
    <div className="recent-activity">
      <div className="recent-activity-header">
        <Space gap={10} align="evenly">
          <p className="recent-activity-title-header">Recent Activity</p>
          <i>
            <Ellipsis size={17} color="lightgray" />
          </i>
        </Space>
        <p className="recent-activity-subtitle-header">
          {dayjs().format("dd, MMMM D, YYYY")} -{" "}
          {dayjs().subtract(1, "day").format("dd, MMMM D, YYYY")}
        </p>
      </div>
      <div className="recent-activity-item-container-wrapper">
        <div className="recent-activity-item-container">
          <p className="recent-activity-title">Moved tasked</p>
          <p className="recent-activity-subtitle">
            ‘Design homepage wireframe’ from To Do to In Progress in Marketing
            Board
          </p>
        </div>
        <div className="recent-activity-item-container">
          <p className="recent-activity-title">Moved tasked</p>
          <p className="recent-activity-subtitle">
            ‘Design homepage wireframe’ from To Do to In Progress in Marketing
            Board
          </p>
        </div>
        <div className="recent-activity-item-container">
          <p className="recent-activity-title">Moved tasked</p>
          <p className="recent-activity-subtitle">
            ‘Design homepage wireframe’ from To Do to In Progress in Marketing
            Board
          </p>
        </div>
        <div className="recent-activity-item-container">
          <p className="recent-activity-title">Moved tasked</p>
          <p className="recent-activity-subtitle">
            ‘Design homepage wireframe’ from To Do to In Progress in Marketing
            Board
          </p>
        </div>
        <div className="recent-activity-item-container">
          <p className="recent-activity-title">Moved tasked</p>
          <p className="recent-activity-subtitle">
            ‘Design homepage wireframe’ from To Do to In Progress in Marketing
            Board
          </p>
        </div>
      </div>
    </div>
  );
}
