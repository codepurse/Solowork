import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Camera, File, FileText, Tv } from "lucide-react";
import { Doughnut } from "react-chartjs-2";
import Space from "../../space";
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutChart = () => {
  const totalStorage = 1750; // 450 + 300 + 800 + 200 MB

  const data = {
    labels: ["Images", "Documents", "Videos", "Others"],
    datasets: [
      {
        data: [450, 300, 800, 200], // sizes in MB
        backgroundColor: [
          "rgba(66, 165, 245, 0.95)", // Images - Blue with less transparency
          "rgba(124, 77, 255, 0.95)", // Documents - Purple with less transparency
          "rgba(255, 138, 101, 0.95)", // Videos - Orange with less transparency
          "rgba(96, 125, 139, 0.95)", // Others - Gray with less transparency
        ],
        borderColor: ["#42A5F5", "#7C4DFF", "#FF8A65", "#607D8B"],
        borderWidth: 1.5,
        hoverBorderWidth: 0,
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
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = ((value / totalStorage) * 100).toFixed(1);
            return `${value} MB (${percentage}%)`;
          },
        },
      },
    },
    cutout: "70%",
  };

  const plugins = [
    {
      id: "centerText",
      beforeDraw: (chart: any) => {
        const {
          ctx,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;
        ctx.save();

        // Add subtle glow to the text
        ctx.shadowColor = "rgba(124, 77, 255, 0.2)";
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw total storage in the center
        ctx.fillStyle = "#fbfbfb";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 18px Poppins";
        ctx.fillText(
          `${totalStorage} MB`,
          width / 2 + left,
          height / 2 + top - 10
        );

        // Reset shadow for the label
        ctx.shadowBlur = 0;

        // Draw "Total Storage" label
        ctx.fillStyle = "#888";
        ctx.font = "12px Poppins";
        ctx.fillText("Total Storage", width / 2 + left, height / 2 + top + 12);
      },
    },
  ];

  const fileTypes = [
    { label: "Images", icon: Camera, color: "#42A5F5", size: 450 },
    { label: "Documents", icon: FileText, color: "#7C4DFF", size: 300 },
    { label: "Videos", icon: Tv, color: "#FF8A65", size: 800 },
    { label: "Others", icon: File, color: "#607D8B", size: 200 },
  ];

  return (
    <div className="donut-chart-container">
      <div className="donut-chart-header">
        <p className="donut-chart-title">Storage Distribution</p>
        <p className="donut-chart-subtitle">
          Total storage used across file types
        </p>
      </div>
      <div className="donut-chart-wrapper">
        <Doughnut data={data} options={options} plugins={plugins} />
        <hr className="faded-line-lightDark" />
        {fileTypes.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="mb-2">
              <Space align="evenly" gap={10}>
                <Space gap={15} alignItems="start">
                  <i>
                    <Icon size={18} color={item.color} />
                  </i>
                  <div>
                    <p className="donut-chart-label">{item.label}</p>
                    <p className="donut-chart-files">1000 files</p>
                  </div>
                </Space>
                <p className="donut-chart-size">{item.size} MB</p>
              </Space>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonutChart;
