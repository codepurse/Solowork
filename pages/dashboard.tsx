import dayjs from "dayjs";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import LineChart from "../components/Pages/Dashboard/LineChart";
import DailyCheckList from "../components/Pages/Dashboard/Widgets/DailyCheckList";
import RecentActivity from "../components/Pages/Dashboard/Widgets/RecentActivity";
import TaskWidgets from "../components/Pages/Dashboard/Widgets/TaskWidgets";
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function Dashboard() {
  const checkTime = () => {
    const hours = dayjs().hour();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const layouts = {
    lg: [
      { i: "todo", x: 0, y: 0, w: 3, h: 6 },
      { i: "inprogress", x: 3, y: 0, w: 3, h: 6 },
      { i: "completed", x: 6, y: 0, w: 3, h: 6 },
      { i: "cancelled", x: 9, y: 0, w: 3, h: 6 },
      { i: "chart", x: 0, y: 6, w: 12, h: 16 },
      { i: "recent-activity", x: 0, y: 22, w: 12, h: 16 },
      { i: "daily-checklist", x: 0, y: 38, w: 3, h: 16 },
    ],
    md: [
      { i: "todo", x: 0, y: 0, w: 3, h: 6 },
      { i: "inprogress", x: 3, y: 0, w: 3, h: 6 },
      { i: "completed", x: 6, y: 0, w: 3, h: 6 },
      { i: "cancelled", x: 9, y: 0, w: 3, h: 6 },
      { i: "chart", x: 0, y: 6, w: 9, h: 16 },
      { i: "recent-activity", x: 9, y: 6, w: 3, h: 16 },
      { i: "daily-checklist", x: 0, y: 22, w: 3, h: 16 },
    ],
    sm: [
      { i: "todo", x: 0, y: 0, w: 3, h: 6 },
      { i: "inprogress", x: 3, y: 0, w: 3, h: 6 },
      { i: "completed", x: 0, y: 6, w: 3, h: 6 },
      { i: "cancelled", x: 3, y: 6, w: 3, h: 6 },
      { i: "chart", x: 0, y: 12, w: 6, h: 16 },
      { i: "recent-activity", x: 6, y: 12, w: 6, h: 16 },
      { i: "daily-checklist", x: 0, y: 28, w: 3, h: 16 },
    ],
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <p className="dashboard-title">
          {checkTime()}, Alfon <span className="wave-emoji">👋</span>
        </p>
        <p className="dashboard-date">{dayjs().format("dddd, DD MMMM YYYY")}</p>
      </div>

      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 900, sm: 768, xs: 480 }}
        cols={{ lg: 12, md: 12, sm: 6, xs: 4 }}
        rowHeight={10}
        isResizable={true}
        isDraggable={false}
        margin={[15, 15]}
        style={{ padding: "0px" }}
      >
        <div key="todo">
          <TaskWidgets label="To Do" subLabel="Waiting for approval" />
        </div>
        <div key="inprogress">
          <TaskWidgets
            label="In Progress"
            subLabel="Currently being worked on"
          />
        </div>
        <div key="completed">
          <TaskWidgets label="Completed" subLabel="Task finished last month" />
        </div>
        <div key="cancelled">
          <TaskWidgets label="Cancelled" subLabel="Task cancelled last week" />
        </div>
        <div key="chart">
          <LineChart />
        </div>
        <div key="recent-activity">
          <RecentActivity />
        </div>
        <div key="daily-checklist">
          <DailyCheckList />
        </div>
      </ResponsiveGridLayout>
    </div>
  );
}
