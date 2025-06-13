import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

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

export default function ListStatistics() {
  const done = 8000;
  const inProgress = 10000;
  const overdue = 4123;

  const chartData = {
    labels: ["Done", "In Progress", "Overdue"],
    datasets: [
      {
        data: [done, inProgress, overdue],
        backgroundColor: [
          "rgba(0, 157, 255, 1)", // Blue
          "rgba(255, 122, 0, 1)", // Orange
          "rgba(138, 43, 226, 1)", // Purple
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

  return (
    <div className="statistics-wrapper">
      <div
        className="statistics-container"
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
          <div className="statistics-amount">75%</div>
          <div className="statistics-label">Done today!</div>
        </div>
      </div>
    </div>
  );
}
