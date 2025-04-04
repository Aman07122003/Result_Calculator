import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";
import Grades from "../components/Grades";

const db = getFirestore(app);

export default function Result() {
  const { year, semester, rollNumber } = useParams();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [compareRollNumber, setCompareRollNumber] = useState("");
  const navigate = useNavigate();

  const handleCompare = () => {
    if (!compareRollNumber.trim()) {
      alert("Please enter a roll number!");
      return;
    }
    navigate(`/compare/${year}/${semester}/${rollNumber}/${compareRollNumber}`);
  };

  
  
  useEffect(() => {
    const fetchResult = async () => {
      try {
        if (!year || !semester || !rollNumber) {
          setError("Invalid URL parameters");
          setLoading(false);
          return;
        }

        const docRef = doc(db, 
          `Years/${year}/semesters/${semester}/students/${rollNumber}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudentData(docSnap.data());
        } else {
          setError("Result not found.");
        }
      } catch (err) {
        console.error("Error fetching result:", err);
        setError("Failed to fetch result. Please try again.");
      }
      setLoading(false);
    };

    fetchResult();
  }, [year, semester, rollNumber]);

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (!studentData) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full border border-gray-700/50 max-w-4xl bg-gray-800/80 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden p-2 sm:p-6 backdrop-blur-lg">
        {/* Header Section - Mobile Adjusted */}
        <div className="p-4 sm:p-8 text-center rounded-xl sm:rounded-2xl border border-gray-700/30 bg-gradient-to-br from-gray-900/80 to-gray-800/80">
          <div className="flex justify-center items-center gap-4 ">
            <span className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Academic
            </span>
            <span className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
              Result
            </span>
          </div>
        </div>
  
        {/* Personal Information */}
        <div className="p-2 sm:p-6 space-y-6 mt-3">
          <div className="space-y-4">
            <h3 className="text-xl sm:text-3xl font-bold text-gray-300 mb-4 border-l-4 border-indigo-400 pl-3">
              Student Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cards - Mobile Optimized */}
              {[
                { title: "Name", value: studentData.name, color: "indigo" },
                { title: "Roll Number", value: rollNumber, color: "green" },
                { title: "Semester", value: semester, color: "amber" }
              ].map((card, index) => (
                <div key={index} className={`p-4 sm:p-6 rounded-lg border border-gray-700/30 hover:border-${card.color}-400/30 transition-all`}>
                  <div className={`text-${card.color}-400 text-xs sm:text-sm font-bold mb-2 uppercase tracking-wider`}>
                    {card.title}
                  </div>
                  <div className="text-lg sm:text-2xl font-semibold text-white truncate">
                    {card.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Grades Section - Mobile Scroll */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-3xl font-bold text-gray-300 mb-4 border-l-4 border-emerald-400 pl-3">
              Academic Performance
            </h3>
            <div className="overflow-x-auto">
              <Grades studentData={studentData} rollNumber={rollNumber ?? ""} />
            </div>
          </div>
  
          {/* Result Summary - Mobile Stack */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-3xl font-bold text-gray-300 mb-4 border-l-4 border-blue-400 pl-3">
              Academic Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 sm:p-6 rounded-lg border border-gray-700/30">
                <div className="text-green-400/80 text-sm sm:text-lg font-bold mb-2">Rank</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-200">{studentData.rank || "N/A"}</div>
              </div>
              <div className="p-4 sm:p-6 rounded-lg border border-gray-700/30">
                <div className="text-amber-400/80 text-sm sm:text-lg font-bold mb-2">CGPA</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-200">{studentData.cgpa?.toFixed(2)}</div>
              </div>
            </div>
          </div>
  
          {/* Comparison Section - Mobile Stack */}
          <div className="space-y-4">
            <h3 className="text-xl sm:text-3xl font-bold text-gray-300 mb-4 border-l-4 border-purple-400 pl-3">
              Result Comparison
            </h3>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Enter Roll Number to Compare"
                value={compareRollNumber}
                onChange={(e) => setCompareRollNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/30 rounded-lg text-base text-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-400/50"
              />
              <button
                onClick={handleCompare}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-400 to-blue-400 text-gray-900 font-bold rounded-lg hover:from-indigo-300 hover:to-blue-300 transition-all active:scale-95"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}