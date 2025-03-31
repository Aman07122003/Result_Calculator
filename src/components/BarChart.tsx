import React, { useEffect, useState } from "react";
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
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";
import { useParams } from "react-router-dom";

// Register required Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

interface Subject {
  code: string;
  name: string;
  sessional_marks: number;
  semester_marks: number;
  total_marks: number;
  pointer: number;
  grade: number;
  total_grade: string;
}

interface StudentData {
  roll_number: string;
  name: string;
  semester: string;
  subjects: Subject[];
  cgpa: number;
}

const BarChart: React.FC = () => {
  const { originalRollNumber, compareRollNumber } = useParams<{
    originalRollNumber: string;
    compareRollNumber: string;
  }>();
  const [students, setStudents] = useState<[StudentData?, StudentData?]>([undefined, undefined]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Type guard to ensure both students are defined
  const hasValidStudents = (students: [StudentData?, StudentData?]): students is [StudentData, StudentData] => {
    return !!students[0] && !!students[1];
  };

  useEffect(() => {
    const fetchStudentData = async (rollNumber: string): Promise<StudentData | null> => {
      const db = getFirestore(app);
      const docRef = doc(db, "semester", rollNumber);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return null;
      
      const data = docSnap.data();
      return {
        roll_number: docSnap.id,
        name: data.name,
        semester: data.semester,
        cgpa: data.cgpa,
        subjects: data.subjects.map((subject: any) => ({
          code: subject.code,
          name: subject.name,
          sessional_marks: subject.sessional_marks,
          semester_marks: subject.semester_marks,
          total_marks: subject.total_marks,
          pointer: subject.pointer,
          grade: subject.grade,
          total_grade: subject.total_grade
        }))
      };
    };

    const fetchData = async () => {
      try {
        if (!originalRollNumber || !compareRollNumber) {
          setError("Missing roll numbers for comparison");
          return;
        }
        
        const [student1, student2] = await Promise.all([
          fetchStudentData(originalRollNumber),
          fetchStudentData(compareRollNumber)
        ]);

        if (!student1 || !student2) {
          setError("One or both students not found");
          return;
        }

        setStudents([student1, student2]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [originalRollNumber, compareRollNumber]);

  if (loading) return <div className="text-center p-4">Loading comparison data...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!hasValidStudents(students)) return null;

  // Destructure after type guard confirmation
  const [firstStudent, secondStudent] = students;

  // Get all unique subjects from both students
  const allSubjects = Array.from(new Set([
    ...firstStudent.subjects.map(s => s.name),
    ...secondStudent.subjects.map(s => s.name)
  ]));

  const chartData: ChartData<"bar"> = {
    labels: allSubjects,
    datasets: [
      {
        label: firstStudent.name,
        data: allSubjects.map(subjectName => {
          const subject = firstStudent.subjects.find(s => s.name === subjectName);
          return subject?.total_marks ?? 0;
        }),
        backgroundColor: "#2563EB",
      },
      {
        label: secondStudent.name,
        data: allSubjects.map(subjectName => {
          const subject = secondStudent.subjects.find(s => s.name === subjectName);
          return subject?.total_marks ?? 0;
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
          text: "Total Marks (out of 100)"
        }
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 45
        }
      }
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
            const student = studentIndex === 0 ? firstStudent : secondStudent;
            const subject = student.subjects.find(s => s.name === subjectName);
            
            return [
              `Student: ${student.name}`,
              `Code: ${subject?.code ?? 'N/A'}`,
              `Sessional: ${subject?.sessional_marks ?? 0}`,
              `Semester: ${subject?.semester_marks ?? 0}`,
              `Total: ${context.raw}`
            ];
          }
        }
      }
    },
  };

  return (
    <div className="h-full w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;