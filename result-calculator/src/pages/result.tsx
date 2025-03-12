import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";
import Grades from "../components/Grades";

const db = getFirestore(app);

export default function Result() {
  const { rollNumber } = useParams();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const docRef = doc(db, "semester", rollNumber!);
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
  }, [rollNumber]);

  if (loading) return <p className="text-center text-gray-600"></p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="h-screen w-full bg-gray-200 flex items-center justify-center">
        <div className="h-[95%] flex items-center justify-center md:w-[60%] bg-white rounded-2xl shadow-2xl">
            <div className="h-11/12 w-11/12" >
                <div className="h-[5%] w-full flex flex-col items-center justify-center">
                    <h2 className="text-5xl font-extrabold text-gray-900">Calculation Result</h2>
                </div>
                <div className="flex text-2xl mt-1 font-bold w-full items-center h-[7%]">Personal Information</div>
                <div className="w-full border-[1px] border-gray-200"></div>
                <div className="h-[14%] mt-1 flex items-center justify-between w-full">
                    <div className="h-[80%] w-[30%] bg-[#e2f0fd] items-center flex justify-center rounded-2xl">
                        <div className="h-[80%] w-[80%]">
                            <div className="h-50% w-full text-2xl font-bold text-blue-800">Name</div>
                            <div className="h-50% mt-1.5 text-xl w-full font-sans text-blue-800">{studentData.name}</div>
                        </div>
                    </div>
                    <div className="h-[80%] w-[30%] bg-[#11f01134] items-center flex justify-center rounded-2xl">
                        <div className="h-[80%] w-[80%]">
                            <div className="h-50% w-full text-2xl font-bold text-green-800">Roll Number</div>
                            <div className="h-50% mt-1.5 text-xl w-full font-sans text-green-800">{rollNumber}</div>
                        </div>
                    </div>
                    <div className="h-[80%] w-[30%] bg-[#ffff0060] items-center flex justify-center rounded-2xl">
                        <div className="h-[80%] w-[80%]">
                            <div className="h-50% w-full text-2xl font-bold text-amber-800">Roll Number</div>
                            <div className="h-50% mt-1.5 text-xl w-full font-sans text-amber-800">{studentData.semester}</div>
                        </div>
                    </div>
                </div>
                <div className="h-[60%] w-full bg-amber-300 mt-1">
                    <Grades studentData={studentData} />
                </div>
                <div className="h-[10%] w-full">
                    <div className="text-2xl font-bold mt-2">Result Summary</div>
                    <div className="w-full border border-gray-200 mt-3 "></div>
                    <div className="h-11/12 w-full flex
                    items-center justify-between">
                        <div className="h-8/12 rounded-2xl bg-[#11f01134] flex items-center w-5/12">
                           <div className="h-7/12 ml-5 font-bold text-green-800 text-2xl w-full">
                            Rank :- {}
                           </div>
                        </div>
                        <div className="h-8/12 rounded-2xl bg-[#ffff0060] flex items-center w-5/12">
                           <div className="h-7/12 ml-5 font-bold text-amber-800 text-2xl w-full">
                            CGPA :-  <span className="font-light">{studentData.cgpa}</span>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
    </div>
  );
}
