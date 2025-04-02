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

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface Subject {
  code: string;
  name: string;
  sessionalMarks: number;
  semesterMarks: number;
  totalMarks: number;
  pointers: number;
  grade: string;
  totalGrade: number;
}

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
        backgroundColor: "#2563EB",
      },
      {
        label: secondStudentName,
        data: allSubjects.map((subjectName) => {
          const subject = secondStudentSubjects.find((s) => s.name === subjectName);
          return subject?.totalMarks ?? 0;
        }),
        backgroundColor: "#DB2777",
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
        },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Subject-wise Marks Comparison",
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
              `Sessional: ${subject?.sessionalMarks ?? 0}`,
              `Semester: ${subject?.semesterMarks ?? 0}`,
              `Total: ${context.raw}`,
            ];
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;