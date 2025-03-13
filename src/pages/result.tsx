import { useEffect, useState } from "react";
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
    <div className="md:h-screen h-[880px] w-full bg-gray-200 flex items-center justify-center">
        <div className="h-[97%] flex items-center justify-center w-[95%] md:w-[55%] bg-white rounded-2xl shadow-2xl">
            <div className="h-[92%] w-[91%]" >
                <div className="md:h-[20px] h-[5%] w-full flex items-center justify-center">
                    <h2 className="md:text-4xl text-2xl font-extrabold text-gray-900">Calculation Result</h2>
                </div>
                <div className="flex md:text-lg md:mt-7 mt-4 font-semibold w-full items-center h-[5%]">Personal Information</div>
                <div className="w-full border-[1px] border-gray-100"></div>
                <div className="md:h-[12%] md:mt-1 md:flex items-center justify-between w-full h-[20%] mt-3 md:flex-row flex-col gap-y-2 md:gap-y-0">
                    <div className="md:h-[70%] h-[25%] md:w-[30%] bg-[#e2f0fd] items-center flex justify-center rounded-2xl">
                        <div className="md:h-[90%] h-[80%] w-[80%] md:flex-col flex  gap-x-1">
                            <div className="md:h-[50%] md:w-full md:text-lg text-sm font-bold flex items-center text-blue-800">Name </div>
                            <div className="md:h-[50%] md:w-full flex items-center text-sm  w-full font-sans text-blue-800"> {studentData.name}</div>
                        </div>
                    </div>
                    <div className="md:h-[70%] md:w-[30%] h-[25%] md:mt-0 mt-2 bg-[#11f01134] items-center flex justify-center rounded-2xl">
                        <div className="md:h-[90%] w-[80%] flex md:flex-col items-center gap-x-1 md:gap-0">
                            <div className="h-50% md:w-full md:text-lg font-bold text-sm text-green-800">Roll Number</div>
                            <div className="h-50% md:w-full text-sm font-sans text-green-800"> {rollNumber}</div>
                        </div>
                    </div>
                    <div className="md:h-[70%] md:w-[30%] h-[25%] mt-2 bg-[#ffff0060] items-center flex justify-center rounded-2xl">
                        <div className="md:h-[90%] w-[80%] flex md:flex-col items-center gap-x-1 md:gap-0">
                            <div className="h-50% md:w-full md:text-lg text-sm font-bold text-amber-800">Semester</div>
                            <div className="h-50% md:w-full text-sm font-sans text-amber-800"> {studentData.semester}</div>
                        </div>
                    </div>
                </div>
                <div className="w-full h-[55%]">
                  <div className="h-[30px] md:mt-2.5 md:text-lg font-semibold"> Detailed Subject Grades</div>
                  <div className="w-full md:mt-2 border-[1px] border-gray-100"></div>
                  <Grades studentData={studentData} rollNumber={rollNumber ?? ""} />
                </div>
                <div className="h-[10%] w-full md:mt-5 mt-3 ">
                    <div className="md:text-lg font-semibold md:mt-2">Result Summary</div>
                    <div className="w-full border border-gray-200 md:mt-2 mt-1"></div>
                    <div className="h-11/12 w-full flex 
                    items-center justify-between md:mt-2">
                        <div className="md:h-8/12 h-6/12 rounded-2xl bg-[#11f01134] flex items-center w-5/12">
                           <div className="md:h-7/12 ml-5 font-bold text-green-800 md:text-lg  w-full">
                            Rank :- {}
                           </div>
                        </div>
                        <div className="md:h-8/12 h-6/12 rounded-2xl bg-[#ffff0060] flex items-center w-5/12">
                           <div className="md:h-7/12 md:ml-5 ml-4 font-bold text-amber-800 md:text-lg text-sm w-full">
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
