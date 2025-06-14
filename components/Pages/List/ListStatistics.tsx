import { Query } from "appwrite";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import dayjs from "dayjs";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import useSWR from "swr";
import {
  DATABASE_ID,
  databases,
  LIST_COLLECTION_ID,
} from "../../../constant/appwrite";
import Space from "../../space";

type ListStatisticsProps = {
  selectedDate?: dayjs.Dayjs;
};

// Custom glow plugin
const glowPlugin = {
  id: "glow",
  beforeDatasetDraw(chart, args, pluginOptions) {
    const { ctx } = chart;
    const dataset = chart.getDatasetMeta(args.index);
    const data = dataset.data;
    const colors = chart.data.datasets[args.index].backgroundColor;

    ctx.save();

    data.forEach((arc, index) => {
      ctx.shadowColor = colors[index];
      ctx.shadowBlur = pluginOptions.glowBlur || 20;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      arc.draw(ctx);
    });

    ctx.restore();

    // Prevent default draw to avoid double-drawing
    return false;
  },
};

ChartJS.register(ArcElement, Tooltip, Legend, glowPlugin);

export default function ListStatistics({
  selectedDate,
}: Readonly<ListStatisticsProps>) {
  const [done, setDone] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  const [overdue, setOverdue] = useState(0);
  const [percentageProgress, setPercentageProgress] = useState<number>(0);
  const [percentageDone, setPercentageDone] = useState<number>(0);
  const [percentageOverdue, setPercentageOverdue] = useState<number>(0);

  const chartData = {
    labels: ["Done", "In Progress", "Overdue"],
    datasets: [
      {
        data: [done, inProgress, overdue],
        backgroundColor: [
          "rgba(0, 176, 255, 1)", // Blue
          "rgba(255, 122, 0, 1)", // Orange
          "rgba(245, 0, 87, 1)", // Pink
        ],
        borderWidth: 0,
        circumference: 360,
        rotation: 270,
      },
    ],
  };

  const options = {
    cutout: "85%",
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 5, // add space around the chart
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      glow: {
        glowBlur: 15,
      },
    },
  };
  // Helper functions to get week range
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0); // Start of Monday
    return monday;
  };

  const getEndOfWeek = (date) => {
    const startOfWeek = getStartOfWeek(date);
    const sunday = new Date(startOfWeek);
    sunday.setDate(startOfWeek.getDate() + 6); // Add 6 days to get Sunday
    sunday.setHours(23, 59, 59, 999); // End of Sunday
    return sunday;
  };

  const fetchList = async () => {
    try {
      // Get Monday to Sunday range
      const today = new Date();
      const mondayOfWeek = getStartOfWeek(today);
      const sundayOfWeek = getEndOfWeek(today);

      // Extend end date for forward-looking items (optional)
      const extendedEnd = new Date();
      extendedEnd.setDate(extendedEnd.getDate() + 30);
      const finalEndDate =
        extendedEnd > sundayOfWeek ? extendedEnd : sundayOfWeek;

      const result = await databases.listDocuments(
        DATABASE_ID,
        LIST_COLLECTION_ID,
        [
          Query.orderAsc("dateSched"),
          Query.greaterThanEqual("dateSched", mondayOfWeek.toISOString()),
          Query.lessThanEqual("dateSched", finalEndDate.toISOString()),
          Query.limit(100),
          Query.offset(0),
        ]
      );

      // Filter data for different purposes
      const allDocs = result.documents;

      // For checklist (today onwards)
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const checklistItems = allDocs.filter(
        (item) => new Date(item.dateSched) >= todayStart
      );

      // For weekly stats (Monday to Sunday only)
      const weeklyStatsData = allDocs.filter((item) => {
        const itemDate = new Date(item.dateSched);
        return itemDate >= mondayOfWeek && itemDate <= sundayOfWeek;
      });

      console.log(checklistItems, "checklistItems");
      console.log(weeklyStatsData, "weeklyStatsData");
      console.log(weeklyStatsData.length, "weeklyStatsData length"); // Add this!

      // FIX: Convert dateSched to Date objects for comparison
      const doneTaskWeek = weeklyStatsData.filter((item) => item.done === true);

      const inProgressTaskWeek = weeklyStatsData.filter(
        (item) => item.done === false && new Date(item.dateSched) >= todayStart
      );

      const overdueTaskWeek = weeklyStatsData.filter(
        (item) => item.done === false && new Date(item.dateSched) < todayStart
      );

      // Add safety check for division by zero
      const totalTasks = weeklyStatsData.length;
      const percentageDone =
        totalTasks > 0 ? (doneTaskWeek.length / totalTasks) * 100 : 0;
      const percentageInProgress =
        totalTasks > 0 ? (inProgressTaskWeek.length / totalTasks) * 100 : 0;
      const percentageOverdue =
        totalTasks > 0 ? (overdueTaskWeek.length / totalTasks) * 100 : 0;

      console.log(doneTaskWeek.length, "done count");
      console.log(inProgressTaskWeek.length, "in progress count");
      console.log(overdueTaskWeek.length, "overdue count");
      console.log(percentageDone, "percentageDone");
      console.log(percentageInProgress, "percentageInProgress");
      console.log(percentageOverdue, "percentageOverdue");

      setDone(doneTaskWeek.length);
      setInProgress(inProgressTaskWeek.length);
      setOverdue(overdueTaskWeek.length);
      setPercentageProgress(
        parseFloat(percentageInProgress.toFixed(2).replace("%", ""))
      );
      setPercentageDone(parseFloat(percentageDone.toFixed(2).replace("%", "")));
      setPercentageOverdue(
        parseFloat(percentageOverdue.toFixed(2).replace("%", ""))
      );

      return allDocs;
    } catch (err) {
      console.error("Failed to fetch list:", err);
      return [];
    }
  };

  useSWR("listStatistics", fetchList, {
    revalidateOnFocus: false,
  });

  return (
    <div className="statistics-wrapper mt-2">
      <Space gap={10} align="evenly">
        <p className="statistics-title">Statistics</p>
        <p className="statistics-date">
          {dayjs(selectedDate).format("MMMM YYYY")}
        </p>
      </Space>
      <div
        className="statistics-container mt-3"
        style={{ position: "relative", width: 200, height: 200 }}
      >
        <Doughnut data={chartData} options={options} />
        <div
          className="statistics-content"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#fff",
          }}
        >
          <div className="statistics-amount">{percentageDone}%</div>
          <div className="statistics-label">This week</div>
        </div>
      </div>
      <div className="statistics-content">
        <Space gap={10} className="mb-1" align="evenly">
          <Space gap={10}>
            <div
              className="statistics-progress-item"
              style={{
                width: 12,
                height: 12,
                backgroundColor: "rgba(0, 176, 255, 1)",
                borderRadius: "3px",
              }}
            />
            <p className="statistics-label">Done</p>
          </Space>
          <p className="statistics-label">{percentageDone} %</p>
        </Space>
        <Space gap={10} className="mb-1" align="evenly">
          <Space gap={10}>
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: "rgba(255, 122, 0, 1)",
                borderRadius: "3px",
              }}
            />
            <p className="statistics-label">In Progress</p>
          </Space>
          <p className="statistics-label">{percentageProgress} %</p>
        </Space>
        <Space gap={10} className="mb-1" align="evenly">
          <Space gap={10}>
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: "rgba(245, 0, 87, 1)",
                borderRadius: "3px",
              }}
            />
            <p className="statistics-label">Overdue</p>
          </Space>
          <p className="statistics-label">{percentageOverdue} %</p>
        </Space>
      </div>
    </div>
  );
}
