import React from "react";

interface GradesProps {
  studentData: any;
  rollNumber: string; // Add roll number as a prop to find the correct student
}

const Grades: React.FC<GradesProps> = ({ studentData, rollNumber }) => {
  // Debugging: Check the full structure
  console.log("Student Data:", studentData);

  // Find the student with the matching roll number
  const student = studentData.results?.find(
    (s: any) => s.roll_number === rollNumber
  );

  if (!student) {
    return <p className="text-center text-red-500 font-bold">Student not found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Subject Code</th>
            <th className="py-2 px-4 border-b">Subject Name</th>
            <th className="py-2 px-4 border-b">Sessional Marks</th>
            <th className="py-2 px-4 border-b">Semester Marks</th>
            <th className="py-2 px-4 border-b">Total Marks</th>
            <th className="py-2 px-4 border-b">Credit</th>
            <th className="py-2 px-4 border-b">Pointers</th>
            <th className="py-2 px-4 border-b">Total Grade</th>
          </tr>
        </thead>
        <tbody>
          {student.subjects.map((subject: any, index: number) => (
            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="py-2 px-4 border-b text-center">{subject.code}</td>
              <td className="py-2 px-4 border-b text-center">{subject.name}</td>
              <td className="py-2 px-4 border-b text-center">{subject.sessional_marks}</td>
              <td className="py-2 px-4 border-b text-center">{subject.semester_marks}</td>
              <td className="py-2 px-4 border-b text-center">{subject.total_marks}</td>
              <td className="py-2 px-4 border-b text-center">{subject.pointer}</td>
              <td className="py-2 px-4 border-b text-center">{subject.grade}</td>
              <td className="py-2 px-4 border-b text-center">{subject.total_grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Grades;
