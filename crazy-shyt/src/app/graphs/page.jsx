"use client"
import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  DoughnutController,
  PolarAreaController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";
import { Line, Bar, Pie, Radar, Doughnut, PolarArea } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  DoughnutController,
  PolarAreaController,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement
);

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Sales",
      data: [2400, 2210, 2290, 2000, 2181, 2500],
      borderColor: "#8884d8",
      backgroundColor: "rgba(136, 132, 216, 0.5)",
    },
    {
      label: "Profit",
      data: [240, 210, 290, 200, 310, 400],
      borderColor: "#82ca9d",
      backgroundColor: "rgba(130, 202, 157, 0.5)",
    },
  ],
};

const pieData = {
  labels: ["Sales"],
  datasets: [
    {
      label: "Sales",
      data: [13500],
      backgroundColor: ["#8884d8"],
    },
  ],
};

const GraphVisualization = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-20 text-black">
      <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4">Line Chart</h2>
        <Line data={data} />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4">Bar Chart</h2>
        <Bar data={data} />
      </div>

      <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4">Pie Chart</h2>
        <Pie data={pieData} />
      </div>

      {/* <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4">Radar Chart</h2>
        <Radar data={data} />
      </div> */}

      <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4">Doughnut Chart</h2>
        <Doughnut data={data} />
      </div>

      {/* <div className="bg-white shadow-lg rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4">Polar Area Chart</h2>
        <PolarArea data={data} />
      </div> */}
    </div>
  );
};

export default GraphVisualization;