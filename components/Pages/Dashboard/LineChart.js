import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useRef } from "react";
import { Line } from "react-chartjs-2";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const LineChart = () => {
  const chartRef = useRef(null);

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Tasks Completed",
        data: Array.from({length: 7}, () => Math.floor(Math.random() * 401) + 100),
        borderColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(
            0,
            0,
            context.chart.width,
            0
          );
          gradient.addColorStop(0, "#ff7e5f");
          gradient.addColorStop(0.5, "#d57eeb");
          gradient.addColorStop(1, "#5b59e3");
          return gradient;
        },
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const chartArea = context.chart.chartArea;
          if (!chartArea) return "rgba(255, 126, 95, 0)";

          // Create horizontal gradient for the line
          const gradientStroke = ctx.createLinearGradient(
            0,
            0,
            context.chart.width,
            0
          );
          gradientStroke.addColorStop(0, "rgba(255, 126, 95, 0.2)");
          gradientStroke.addColorStop(0.5, "rgba(213, 126, 235, 0.2)");
          gradientStroke.addColorStop(1, "rgba(91, 89, 227, 0.2)");

          // Create vertical gradient for the fill
          const gradientFill = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom
          );
          gradientFill.addColorStop(0, "rgba(255, 126, 95, 0.3)");
          gradientFill.addColorStop(0.5, "rgba(213, 126, 235, 0.15)");
          gradientFill.addColorStop(1, "rgba(0, 0, 0, 0)");

          return gradientFill;
        },
        tension: 0.5,
        fill: true,
        pointBackgroundColor: "transparent",
        pointBorderColor: "transparent",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#5b59e3",
        pointHoverBorderWidth: 2,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(33, 33, 50, 0.9)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        bodyFont: {
          size: 14,
        },
        displayColors: false,
        callbacks: {
          title: () => null,
          label: (context) => `${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          padding: 10,
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          padding: 10,
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 4,
      },
      point: {
        radius: 0,
      },
    },
  };

  return (
    <div className="line-chart-container">
      <div className="line-chart-header">
        <p className="line-chart-title">Goal Progress Over Time</p>
        <p className="line-chart-subtitle">
          Chart of your goal progress over time.
        </p>
      </div>
      <div className="line-chart-wrapper">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
