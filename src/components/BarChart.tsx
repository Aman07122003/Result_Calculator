import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Subject } from "../types";

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface BarChartProps {
  firstStudentSubjects: Subject[];
  secondStudentSubjects: Subject[];
  firstStudentName: string;
  secondStudentName: string;
}

const BarChart: React.FC<BarChartProps> = ({
  firstStudentSubjects,
  secondStudentSubjects,
  firstStudentName,
  secondStudentName,
}) => {
  // Get all unique subjects from both students
  const allSubjects = Array.from(
    new Set([
      ...firstStudentSubjects.map((s) => s.name),
      ...secondStudentSubjects.map((s) => s.name),
    ])
  );

  const chartData: ChartData<"bar"> = {
    labels: allSubjects,
    datasets: [
      {
        label: firstStudentName,
        data: allSubjects.map((subjectName) => {
          const subject = firstStudentSubjects.find((s) => s.name === subjectName);
          return subject?.totalMarks ?? 0;
        }),
        backgroundColor: "rgba(129, 140, 248, 0.8)",
        borderColor: "rgba(129, 140, 248, 1)",
        borderWidth: 1,
      },
      {
        label: secondStudentName,
        data: allSubjects.map((subjectName) => {
          const subject = secondStudentSubjects.find((s) => s.name === subjectName);
          return subject?.totalMarks ?? 0;
        }),
        backgroundColor: "rgba(52, 211, 153, 0.8)",
        borderColor: "rgba(52, 211, 153, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Total Marks (out of 100)",
          font: {
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 16,
            weight: "bold",
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: "Subject-wise Marks Comparison",
        font: {
          size: 24,
          weight: "bold",
        },
        padding: {
          bottom: 0,
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const studentIndex = context.datasetIndex;
            const subjectName = context.label;
            const studentSubjects = studentIndex === 0 ? firstStudentSubjects : secondStudentSubjects;
            const subject = studentSubjects.find((s) => s.name === subjectName);
            
            return [
              `Student: ${studentIndex === 0 ? firstStudentName : secondStudentName}`,
              `Code: ${subject?.code ?? "N/A"}`,
              `Sessional: ${subject?.sessionalMarks ?? 0}/50`,
              `Semester: ${subject?.semesterMarks ?? 0}/100`,
              `Total: ${context.raw}/150`,
              `Pointer: ${subject?.pointer ?? 0}`,
              `Grade: ${subject?.grade ?? "N/A"}`,
            ];
          },
          footer: (context) => {
            const subjectName = context[0].label;
            const subject1 = firstStudentSubjects.find((s) => s.name === subjectName);
            const subject2 = secondStudentSubjects.find((s) => s.name === subjectName);
            const difference = (subject1?.totalMarks ?? 0) - (subject2?.totalMarks ?? 0);
            
            if (Math.abs(difference) > 0) {
              return [
                `Difference: ${Math.abs(difference)} points`,
                difference > 0 
                  ? `${firstStudentName} leads by ${difference}`
                  : `${secondStudentName} leads by ${Math.abs(difference)}`
              ];
            }
            return ["Scores are equal"];
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 11,
        },
        padding: 12,
        displayColors: true,
        usePointStyle: true,
      },
    },
    animation: {
      duration: 1000,
      easing: "easeInOutQuad",
    },
  };

  return (
    <div className="h-full w-full p-4">
      <div className="rounded-lg shadow-md p-4 h-full">
        <Bar 
          data={chartData} 
          options={options} 
          height={400}
        />
      </div>
    </div>
  );
};

export default BarChart;