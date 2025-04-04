import React from "react";

interface GradesProps {
  studentData: any;
  rollNumber: string; 
}

const Grades: React.FC<GradesProps> = ({ studentData, rollNumber }) => {
  const student = studentData.rollNumber === rollNumber ? studentData : null;

  if (!student) {
    return <p className="text-center text-red-400 text-sm sm:text-base p-3">Student not found</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700/30 shadow-lg">
      <table className="min-w-full bg-gray-900/50 backdrop-blur-sm">
        <thead className="bg-gray-800/80">
          <tr className="text-gray-400 font-semibold text-xs sm:text-sm md:text-base">
            <th className="py-2 sm:py-3 px-4 text-left border-b border-gray-700/30">Code</th>
            <th className="py-2 sm:py-3 px-3 text-left border-b border-gray-700/30">Subject</th>
            <th className="py-2 sm:py-3 px-2 sm:px-3 text-center border-b border-gray-700/30">Sessional</th>
            <th className="py-2 sm:py-3 px-2 sm:px-3 text-center border-b border-gray-700/30">Semester</th>
            <th className="py-2 sm:py-3 px-2 sm:px-3 text-center border-b border-gray-700/30">Total</th>
            <th className="py-2 sm:py-3 px-2 sm:px-3 text-center border-b border-gray-700/30">Credit</th>
            <th className="py-2 sm:py-3 px-2 sm:px-3 text-center border-b border-gray-700/30">Pointer</th>
            <th className="py-2 sm:py-3 px-2 sm:px-3 text-center border-b border-gray-700/30">Grade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/30">
          {student.subjects.map((subject: any, index: number) => (
            <tr 
              key={index}
              className={`hover:bg-gray-800/30 transition-colors ${
                subject.pointer <= 7 ? " text-red-400 font-bold"  : "text-gray-300"
              } md:text text-sm`}
            >
              <td className="py-2 sm:py-3 px-1 font-mono">{subject.code}</td>
              <td className="py-2 sm:py-3 px-4 sm:px-3 max-w-[100px] sm:max-w-none truncate hover:text-clip">
                {subject.name}
              </td>
              <td className="py-2 sm:py-3 px-2 sm:px-3 text-center">{subject.sessionalMarks}</td>
              <td className="py-2 sm:py-3 px-2 sm:px-3 text-center">{subject.semesterMarks}</td>
              <td className="py-2 sm:py-3 px-2 sm:px-3 text-center font-medium">{subject.totalMarks}</td>
              <td className="py-2 sm:py-3 px-2 sm:px-3 text-center">{subject.credit}</td>
              <td className="py-2 sm:py-3 px-2 sm:px-3 text-center font-semibold">{subject.pointer}</td>
              <td className="py-2 sm:py-3 px-2 sm:px-3 text-center font-bold">{subject.totalPointer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;