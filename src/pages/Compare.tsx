// src/pages/Compare.tsx
import { useEffect, useState } from "react";
import BarChart from "../components/BarChart";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";
import { useParams } from "react-router-dom";
import { StudentData, Subject } from "../types"

const Compare = () => {
  const { year, semester, rollNumber1, rollNumber2 } = useParams<{
    year: string;
    semester: string;
    rollNumber1: string;
    rollNumber2: string;
  }>();


  const [students, setStudents] = useState<[StudentData?, StudentData?]>([undefined, undefined]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async (rollNumber: string): Promise<StudentData | null> => {
      const db = getFirestore(app);
      const docRef = doc(db, `Years/${year}/semesters/${semester}/students/${rollNumber}`);
      
      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;

        const data = docSnap.data();
        return {
          name: data.name,
          rollNumber: data.rollNumber,
          cgpa: data.cgpa,
          rank: data.rank || undefined,
          semester: data.semester,
          Year: data.Year,
          totalCredit: data.totalCredit,
          totalPointer: data.totalPointer,
          subjects: data.subjects.map((subject: any) => ({
            code: subject.code,
            name: subject.name,
            sessionalMarks: subject.sessionalMarks,
            semesterMarks: subject.semesterMarks,
            totalMarks: subject.totalMarks,
            credit: subject.credit,
            pointer: subject.pointer || subject.pointers || 0,
            totalPointer: subject.totalPointer,
            grade: subject.grade
          }))
        };
      } catch (error) {
        console.error("Error fetching student data:", error);
        return null;
      }
    };

    const fetchData = async () => {
      try {
        if (!rollNumber1 || !rollNumber2 || !year || !semester) {
          setError("Missing required parameters for comparison");
          return;
        }

        const [student1, student2] = await Promise.all([
          fetchStudentData(rollNumber1),
          fetchStudentData(rollNumber2)
        ]);

        if (!student1 || !student2) {
          setError("One or both students not found");
          return;
        }

        if (student1.semester !== student2.semester || student1.Year !== student2.Year) {
          setError("Students are from different academic periods");
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
  }, [rollNumber1, rollNumber2, year, semester]);

  const calculateAverageMarks = (subjects: Subject[]) => {
    if (!subjects || subjects.length === 0) return 0;
    const total = subjects.reduce((sum, subject) => sum + subject.totalMarks, 0);
    return (total / subjects.length).toFixed(1);
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!students[0] || !students[1]) return <div>No student data available</div>;

  const [firstStudent, secondStudent] = students;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-8 md:px-12">
      {/* Header */}
      <div className="text-center md:h-[20%] mb-12 space-y-1">
        <div className="inline-block" >
          <div className="flex justify-center bg-gray-800 px-6 py-2 rounded-full shadow-sm mb-4 border border-gray-700">
          <p className="text-sm text-gray-400 font-medium">
            {firstStudent.Year} • Semester {firstStudent.semester}
          </p>
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-100 text-center md:flex md:justify-center">
          <div className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
            {firstStudent.name}
          </div>
          <div className="mx-3 text-gray-500">vs</div>
          <div className="bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
            {secondStudent.name}
          </div>
      </h1>
      </div>
  
      {/* Chart Section */}
      <div className="bg-gray-800 min-h-[400px] p-6 rounded-3xl shadow-lg mb-10 border border-gray-700 overflow-x-auto">
  <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 min-w-[600px]">
    <h2 className="text-xl font-semibold text-gray-200">Performance Comparison</h2>
    <div className="flex gap-4 justify-center">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
        <span className="text-sm text-gray-400">{firstStudent.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
        <span className="text-sm text-gray-400">{secondStudent.name}</span>
      </div>
    </div>
  </div>
  <div className="min-w-[600px]">
    <BarChart
      firstStudentSubjects={firstStudent.subjects}
      secondStudentSubjects={secondStudent.subjects}
      firstStudentName={firstStudent.name}
      secondStudentName={secondStudent.name}
    />
  </div>
</div>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Marks Card */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-gray-200 relative pb-2">
              Average Marks
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full"></div>
            </h3>
          </div>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400 mb-1">
                {calculateAverageMarks(firstStudent.subjects)}%
              </div>
              <div className="text-sm text-gray-400">{firstStudent.name}</div>
            </div>
            <div className="h-12 w-px bg-gray-700 my-auto"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {calculateAverageMarks(secondStudent.subjects)}%
              </div>
              <div className="text-sm text-gray-400">{secondStudent.name}</div>
            </div>
          </div>
        </div>
  
        {/* CGPA Card */}
        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700">
          <div className="mb-6 text-center">
            <h3 className="text-lg font-semibold text-gray-200 relative pb-2">
              CGPA Comparison
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full"></div>
            </h3>
          </div>
          <div className="flex justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400 mb-1">
                {firstStudent.cgpa}
              </div>
              <div className="text-sm text-gray-400">{firstStudent.name}</div>
            </div>
            <div className="h-12 w-px bg-gray-700 my-auto"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {secondStudent.cgpa}
              </div>
              <div className="text-sm text-gray-400">{secondStudent.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compare;