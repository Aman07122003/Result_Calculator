import React from "react";

interface GradesProps {
  studentData: any;
  rollNumber: string; 
}

const Grades: React.FC<GradesProps> = ({ studentData, rollNumber }) => {
  // Debugging: Check the full structure
  console.log("Student Data:", studentData);

  const student = studentData.rollNumber === rollNumber ? studentData : null;


console.log(student);
  

  if (!student) {
    return <p className="text-center text-red-500 font-bold">Student not found.</p>;
  }

  return (
    <div className="overflow-x-auto md:mt-5 mt-3">
      <table className="min-w-full bg-white border border-gray-300 md:text-[18px] text-[12px] ">
        <thead className="bg-gray-100">
          <tr className="text-sm md:text-[19px]">
            <th className="py-1 px-3 border-b">Subject Code</th>
            <th className="py-1 px-4 border-b">Subject Name</th>
            <th className="py-1 px-2 border-b">Sessional Marks</th>
            <th className="py-1 px-2 border-b">Semester Marks</th>
            <th className="py-1 px-2 border-b">Total Marks</th>
            <th className="py-1 px-2 border-b">Credit</th>
            <th className="py-1 px-2 border-b">Pointers</th>
            <th className="py-1 px-2 border-b">Total Grade</th>
          </tr>
        </thead>
        <tbody>
          {student.subjects.map((subject: any, index: number) => (
            <tr 
                key={index} 
                className={subject.pointer <= 7 ? "bg-red-500 text-white" : ""}
              >
              <td className="py-1 px-2 border-b text-center">{subject.code}</td>
              <td className="py-1 px-2 border-b text-center">{subject.name}</td>
              <td className="py-1 px-2 border-b text-center">{subject.sessionalMarks}</td>
              <td className="py-1 px-2 border-b text-center">{subject.semesterMarks}</td>
              <td className="py-1 px-2 border-b text-center">{subject.totalMarks}</td>
              <td className="py-1 px-2 border-b text-center">{subject.credit}</td>
              <td className="py-1 px-2 border-b text-center">{subject.pointer}</td>
              <td className="py-1 px-2 border-b text-center">{subject.totalPointer}</td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default Grades;
