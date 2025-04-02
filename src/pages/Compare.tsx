import { useEffect, useState } from "react";
import BarChart from "../components/BarChart";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";
import { useParams } from "react-router-dom";

interface Subject {
  code: string;
  name: string;
  sessionalMarks: number;
  semesterMarks: number;
  credit: number;
  grade: string;
  pointers: number;
  totalGrade: number;
  totalMarks: number;
}

interface StudentData {
  Year: string;
  semester: string;
  name: string;
  rollNumber: number;
  cgpa: number;
  rank?: number;
  totalCredit: number;
  totalGrade: number;
  subjects: Subject[];
}

const Compare = () => {
  const { originalRollNumber, compareRollNumber } = useParams<{
    originalRollNumber: string;
    compareRollNumber: string;
  }>();

  const [students, setStudents] = useState<[StudentData?, StudentData?]>([undefined, undefined]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [year, setYear] = useState("2022-2026"); // Default year or get from URL
  const [semester, setSemester] = useState("1"); // Default semester or get from URL

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
          totalGrade: data.totalGrade,
          subjects: data.subjects.map((subject: any) => ({
            code: subject.code,
            name: subject.name,
            sessionalMarks: subject.sessionalMarks,
            semesterMarks: subject.semesterMarks,
            totalMarks: subject.totalMarks,
            credit: subject.credit,
            grade: subject.grade,
            pointers: subject.pointers,
            totalGrade: subject.totalGrade
          }))
        };
      } catch (error) {
        console.error("Error fetching student data:", error);
        return null;
      }
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

        // Verify both students are from same semester and year
        if (student1.semester !== student2.semester || student1.Year !== student2.Year) {
          setError("Students are from different academic periods");
          return;
        }

        // Update context with actual year and semester
        setYear(student1.Year);
        setSemester(student1.semester);
        setStudents([student1, student2]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch student data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [originalRollNumber, compareRollNumber, year, semester]);

  // Calculate average marks across all subjects
  const calculateAverageMarks = (subjects: Subject[]) => {
    const total = subjects.reduce((sum, subject) => sum + subject.totalMarks, 0);
    return (total / subjects.length).toFixed(1);
  };

  // Rest of your component remains the same, just update these displays:
  // Change total_marks to totalMarks in the BarChart component props
  // Change pointer to pointers if needed

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-xl text-gray-600">Loading comparison data...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-xl p-4 border border-red-200 bg-red-50 rounded-lg">
        {error}
      </div>
    </div>
  );

  if (!students[0] || !students[1]) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 text-xl">No student data available</div>
    </div>
  );

  const [firstStudent, secondStudent] = students;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-4">
      <div className="h-full md:h-[95vh] w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <h1 className="md:text-xl text-sm font-bold text-gray-800 mb-2 md:mb-0">
              <span className="text-blue-600">{firstStudent.name}</span>
              <span className="mx-3 text-gray-400">vs</span>
              <span className="text-pink-600">{secondStudent.name}</span>
            </h1>
            {/* Legend */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span className="text-sm text-gray-600">{firstStudent.name}'s Marks</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-pink-600 mr-2"></div>
                <span className="text-sm text-gray-600">{secondStudent.name}'s Marks</span>
              </div>
            </div>
          </div>
          <h2 className="text-xl text-gray-500">
            {firstStudent.Year} - Semester {firstStudent.semester}
          </h2>
          <p className="text-center md:text-left text-gray-500 mt-2 text-sm">
            Academic Performance Comparison Dashboard
          </p>
        </div>

        {/* Chart Section */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden">
          <div className="h-full w-full rounded-xl border border-gray-100 bg-white shadow-sm p-2 md:p-4">
            <div className="h-full w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              <div className="md:min-w-[600px] min-w-[1000px] h-full"> 
                <BarChart
                  firstStudentSubjects={firstStudent.subjects}
                  secondStudentSubjects={secondStudent.subjects} firstStudentName={""} secondStudentName={""}                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-t border-gray-100 bg-gray-50/50">
          {/* Average Marks */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Average Marks</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold text-2xl">
                {calculateAverageMarks(firstStudent.subjects)}%
              </span>
              <span className="text-pink-600 font-bold text-2xl">
                {calculateAverageMarks(secondStudent.subjects)}%
              </span>
            </div>
          </div>

          {/* CGPA Comparison */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">CGPA Comparison</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold text-2xl">
                {firstStudent.cgpa.toFixed(1)}
              </span>
              <span className="text-pink-600 font-bold text-2xl">
                {secondStudent.cgpa.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Total Credits */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Total Credits</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold text-2xl">
                {firstStudent.totalCredit}
              </span>
              <span className="text-pink-600 font-bold text-2xl">
                {secondStudent.totalCredit}
              </span>
            </div>
          </div>

          {/* Rank Comparison */}
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Rank Comparison</h3>
            <div className="flex justify-between items-center">
              <span className="text-blue-600 font-bold text-2xl">
                {firstStudent.rank ? firstStudent.rank : 'N/A'}
              </span>
              <span className="text-pink-600 font-bold text-2xl">
                {secondStudent.rank ? secondStudent.rank : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;