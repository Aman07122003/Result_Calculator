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
    <div className="md:min-h-screen h-[1200px] w-full bg-gray-200 flex items-center justify-center">
      <div className="min-h-[calc(100vh+20px)] flex items-center justify-center w-[95%] md:w-[55%] bg-white pb-8 pt-8 rounded-2xl shadow-2xl">
        <div className="h-[97%] w-[91%]">
          {/* Header Section */}
          <div className="md:h-[20px] h-[5%] w-full flex items-center justify-center">
            <h2 className="md:text-4xl text-2xl font-extrabold text-gray-900">Academic Result</h2>
          </div>

          {/* Personal Information */}
          <div className="flex md:text-[25px] md:mt-7 mt-4 font-semibold w-full items-center h-[5%] md:h-[8%]">
            Personal Information
          </div>
          <div className="w-full border-[1px] border-gray-100"></div>
          
          <div className="md:h-[100px] md:mt-1 md:flex items-center justify-between w-full h-[150px] mt-3 md:flex-row flex-col gap-y-2 md:gap-y-0">
            {/* Name Card */}
            <div className="md:h-[70%] h-[25%] md:w-[30%] bg-[#e2f0fd] items-center flex justify-center rounded-2xl">
              <div className="md:h-[90%] h-[80%] w-[80%] md:flex-col flex gap-x-1">
                <div className="md:h-[50%] md:w-full md:text-xl text-sm font-bold flex items-center text-blue-800">
                  Name
                </div>
                <div className="md:h-[40%] md:w-full flex items-center text-sm md:text-lg font-sans text-blue-800">
                  {studentData.name}
                </div>
              </div>
            </div>

            {/* Roll Number Card */}
            <div className="md:h-[70%] md:w-[30%] h-[25%] md:mt-0 mt-2 bg-[#11f01134] items-center flex justify-center rounded-2xl">
              <div className="md:h-[90%] w-[80%] flex md:flex-col items-center gap-x-1 md:gap-0">
                <div className="md:h-[50%] md:w-full md:text-xl text-sm font-bold flex items-center text-green-800">
                  Roll Number
                </div>
                <div className="h-[40%] md:w-full text-sm md:text-lg font-sans text-green-800">
                  {rollNumber}
                </div>
              </div>
            </div>

            {/* Semester Card */}
            <div className="md:h-[70%] md:w-[30%] h-[25%] mt-2 bg-[#ffff0060] items-center flex justify-center rounded-2xl">
              <div className="md:h-[90%] w-[80%] flex md:flex-col items-center gap-x-1 md:gap-0">
                <div className="md:h-[50%] md:w-full md:text-xl text-sm font-bold flex items-center text-amber-800">
                  Semester
                </div>
                <div className="h-[40%] md:w-full text-sm md:text-lg font-sans text-amber-800">
                  {semester}
                </div>
              </div>
            </div>
          </div>

          {/* Grades Section */}
          <div className="w-full md:h-[55%]">
            <div className="h-[30px] md:h-[8%] md:mt-2.5 md:text-[25px] font-semibold">
              Detailed Subject Grades
            </div>
            <div className="w-full md:mt-4 border-[1px] border-gray-100"></div>
            <Grades studentData={studentData} rollNumber={rollNumber ?? ""} />
          </div>

          {/* Result Summary */}
          <div className="h-[150px] md:h-[150px] w-full md:mt-5 mt-5">
            <div className="md:text-[25px] md:h-[40%] flex items-center font-semibold">
              Result Summary
            </div>
            <div className="w-full border border-gray-200 md:mt-0 mt-1"></div>
            <div className="md:h-[55%] md:w-full h-[50%] items-center justify-between md:mt-0 md:flex">
              <div className="md:h-[70%] h-7/12 rounded-2xl bg-[#11f01134] flex items-center md:w-5/12 md:mt-0 mt-3">
                <div className="md:h-[100%] flex items-center ml-5 font-bold text-green-800 md:text-lg w-full">
                  Rank: {studentData.rank || "N/A"}
                </div>
              </div>
              <div className="md:h-[70%] h-7/12 rounded-2xl bg-[#ffff0060] flex items-center md:w-5/12 md:mt-0 mt-3">
                <div className="md:h-[100%] items-center flex md:ml-5 ml-4 font-bold text-amber-800 md:text-lg text-sm w-full">
                  CGPA: <span className="font-light ml-2">{studentData.cgpa?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Section */}
          <div className="h-[15%] mt-2 w-full">
            <div className="md:text-[25px] md:h-[40%] flex items-center font-semibold">
              Compare Your Result
            </div>
            <div className="w-full md:mt-4 mt-2 border-[1px] border-gray-100"></div>
            <div className="h-full w-full flex md:flex-row flex-col justify-around items-center">
              <input
                type="text"
                placeholder="Enter Roll Number to Compare"
                value={compareRollNumber}
                onChange={(e) => setCompareRollNumber(e.target.value)}
                className="block w-full md:w-[40%] rounded-md bg-white px-3 py-1.5 text-base mt-5 text-gray-900 outline-1 outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-black sm:text-sm/6"
              />
              <button
                onClick={handleCompare}
                className="flex w-full md:w-[40%] justify-center rounded-md bg-black px-3 py-1.5 text-sm/6 font-semibold text-white mt-5 shadow-xs hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Compare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}