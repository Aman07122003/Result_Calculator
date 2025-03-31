import { doc, getDoc, setDoc, collection, getDocs, writeBatch, } from 'firebase/firestore';
import { db } from '../firebase';
import React, { useEffect, useState } from 'react';

interface Subject {
  code: string;
  name: string;
  sessionalMarks: string;
  semesterMarks: string;
  credit: string;
  grade: string;
}

interface FormData {
  Year: string;
  name: string;
  rollNumber: string;
  semester: string;
  subjects: Subject[];
}

interface StudentData {
  Year: string;
  semester: string;
  cgpa: number;
  subjects: Subject[];
  name: string;
  rollNumber: string;
  // Add other properties if needed
}

const Admin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    rollNumber: '',
    semester: '',
    Year: '',
    subjects: [{
      code: '', name: '', sessionalMarks: '', semesterMarks: '', 
      credit: '', grade: ''
    }],
  });

  const [cgpa, setCGPA] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchTemplate = async () => {
      if (!formData.Year || !formData.semester) return;

      try {
        const semesterRef = doc(db, 
          `Years/${formData.Year}/semesters/${formData.semester}`);
        const semesterSnap = await getDoc(semesterRef);

        if (semesterSnap.exists()) {
          const semesterData = semesterSnap.data();
          setFormData(prev => ({
            ...prev,
            subjects: semesterData.subjects.map((subject: Subject) => ({
              ...subject,
              sessionalMarks: "",
              semesterMarks: ""
            }))
          }));
        }
      } catch (error) {
        console.error("Error fetching semester template:", error);
      }
    };

    fetchTemplate();
  }, [formData.Year, formData.semester]);
  
  

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'sessionalMarks':
        const sessional = parseInt(value);
        if (isNaN(sessional)) error = 'Invalid marks';
        else if (sessional < 0 || sessional > 50) error = 'Marks must be 0-50';
        break;
      case 'semesterMarks':
        const semester = parseInt(value);
        if (isNaN(semester)) error = 'Invalid marks';
        else if (semester < 0 || semester > 100) error = 'Marks must be 0-100';
        break;
      case 'credit':
        const credit = parseInt(value);
        if (isNaN(credit)) error = 'Invalid credit';
        else if (credit < 0) error = 'Credit cannot be negative';
        break;
      case 'semester':
        const semesterNum = parseInt(value);
        if (isNaN(semesterNum)) error = 'Invalid semester';
        else if (semesterNum < 1 || semesterNum > 8) error = 'Semester must be 1-8';
        break;
      case 'Year':
        if (!value) error = 'Year is required';
        break;
    }
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: keyof Subject
  ) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    let errorKey = name;

    if (index !== undefined && field !== undefined) {
      const error = validateField(field, value);
      errorKey = `${field}-${index}`;
      if (error) newErrors[errorKey] = error;
      else delete newErrors[errorKey];
      
      const updatedSubjects = [...formData.subjects];
      updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
      setFormData({ ...formData, subjects: updatedSubjects });
    } else {
      const error = validateField(name, value);
      errorKey = name;
      if (error) newErrors[errorKey] = error;
      else delete newErrors[errorKey];
      setFormData({ ...formData, [name]: value });
    }

    setErrors(newErrors);
  };

  const addSubject = () => {
    setFormData({
      ...formData,
      subjects: [...formData.subjects, {
        code: '', name: '', sessionalMarks: '', semesterMarks: '',
        credit: '', grade: '', 
      }],
    });
  };

  const removeSubject = (index: number) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const calculateCGPA = (year: string) => { // Add proper typing
    let totalGradePoints = 0;
    let totalCredits = 0;
  
    formData.subjects.forEach(subject => {
      const sessional = parseInt(subject.sessionalMarks) || 0;
      const semester = parseInt(subject.semesterMarks) || 0;
      const total = sessional + semester;
      const credit = parseInt(subject.credit) || 0;
  
      let grade = 0;
      
      // Unified grading system with year-specific thresholds
      const thresholds = {
        "2022-2026": { 
          ranges: [90, 80, 70, 60, 50, 40],
          grades: [10, 9, 8, 7, 6, 5]
        },
        "2021-2025": {
          ranges: [135, 120, 105, 90, 75, 60],
          grades: [10, 9, 8, 7, 6, 5]
        }
      };
  
      const { ranges, grades } = thresholds[year as keyof typeof thresholds] || { ranges: [], grades: [] };
  
      for (let i = 0; i < ranges.length; i++) {
        if (total >= ranges[i]) {
          grade = grades[i];
          break;
        }
      }
  
      totalGradePoints += grade * credit;
      totalCredits += credit;
    });
  
    return totalCredits > 0 ? Number((totalGradePoints / totalCredits).toFixed(2)) : 0;
  };

  const calculateRank = async (year: string, semester: string) => {
    try {
      const studentsRef = collection(db, 
        `Years/${year}/semesters/${semester}/students`);
      const snapshot = await getDocs(studentsRef);
      
      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as StudentData[];

      // Sort students by CGPA descending
      const sortedStudents = [...students].sort((a, b) => b.cgpa - a.cgpa);

      // Update ranks in batch
      const batch = writeBatch(db);
      sortedStudents.forEach((student, index) => {
        const studentRef = doc(db, 
          `Years/${year}/semesters/${semester}/students/${student.rollNumber}`);
        batch.update(studentRef, { rank: index + 1 });
      });
      
      await batch.commit();

      return sortedStudents.findIndex(s => s.rollNumber === formData.rollNumber) + 1;

    } catch (error) {
      console.error('Rank calculation error:', error);
      throw new Error('Failed to calculate ranks');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    try {
      const cgpaValue = calculateCGPA(formData.Year);
      setCGPA(cgpaValue);

      // Save student document
      const studentPath = `Years/${formData.Year}/semesters/${formData.semester}/students/${formData.rollNumber}`;
      const studentRef = doc(db, studentPath);

      // Check if student already exists
      const studentSnap = await getDoc(studentRef);
      if (studentSnap.exists()) {
        alert('Student with this roll number already exists in this semester!');
        return;
      }

      // Create student document
      await setDoc(studentRef, {
        ...formData,
        cgpa: cgpaValue,
        timestamp: new Date(),
      });

      // Create/update semester template
      const semesterRef = doc(db, 
        `Years/${formData.Year}/semesters/${formData.semester}`);
      const semesterSnap = await getDoc(semesterRef);

      if (!semesterSnap.exists()) {
        await setDoc(semesterRef, {
          subjects: formData.subjects.map(({ code, name, credit, grade }) => ({
            code, name, credit, grade
          })),
          semester: formData.semester,
          Year: formData.Year
        });
      }


      // Calculate and update rank
      const rank = await calculateRank(formData.Year, formData.semester);
      await setDoc(studentRef, { rank }, { merge: true });

      alert('Result saved successfully!');
      setFormData({
        name: '',
        rollNumber: '',
        semester: '',
        Year: '',
        subjects: [{
          code: '', name: '', sessionalMarks: '', semesterMarks: '',
          credit: '', grade: ''
        }],
      });
      setCGPA(null);

    } catch (error) {
      console.error('Error saving result:', error);
      alert('Error saving result. Please check console for details.');
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen w-full flex items-center justify-center p-4'>
      <div className='bg-amber-200 w-full max-w-4xl rounded-lg shadow-lg flex flex-col p-6'>
        <h1 className='text-4xl font-extrabold text-center mb-6 text-amber-800'>Result Builder</h1>
        
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='mt-1 p-2 w-full rounded border border-amber-500'
                required
              />
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700'>Roll Number</label>
              <input
                type='text'
                name='rollNumber'
                value={formData.rollNumber}
                onChange={handleChange}
                className='mt-1 p-2 w-full rounded border border-amber-500'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Semester</label>
              <select
                name='semester'
                value={formData.semester}
                onChange={handleChange}
                className='mt-1 p-2 w-full rounded border border-amber-500'
                required
              >
                <option value=''>Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
              {errors.semester && <span className='text-red-500 text-sm'>{errors.semester}</span>}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Year</label>
              <select
                name="Year"
                value={formData.Year}
                onChange={handleChange}
                className="mt-1 p-2 w-full rounded border border-amber-500"
                required
              >
                <option value="">Select Year</option>
                {["2022-2026", "2021-2025"].map((num) => (
                  <option key={num} value={num}>
                    Year {num}
                  </option>
                ))}
              </select>

              {errors.Year && <span className='text-red-500 text-sm'>{errors.Year}</span>}
            </div>
          </div>

          <div className='space-y-4'>
            <h2 className='text-xl font-semibold text-amber-800'>Subjects</h2>
            {formData.subjects.map((subject, index) => (
              <div key={index} className='bg-amber-50 p-4 rounded-lg shadow-sm'>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                  <div>
                    <label className='text-sm font-medium text-gray-600'>Subject Code</label>
                    <input
                      type='text'
                      value={subject.code}
                      onChange={(e) => handleChange(e, index, 'code')}
                      className='mt-1 p-1 w-full rounded border border-amber-300'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-600'>Subject Name</label>
                    <input
                      type='text'
                      value={subject.name}
                      onChange={(e) => handleChange(e, index, 'name')}
                      className='mt-1 p-1 w-full rounded border border-amber-300'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-600'>Sessional Marks</label>
                    <input
                      type='number'
                      value={subject.sessionalMarks}
                      onChange={(e) => handleChange(e, index, 'sessionalMarks')}
                      className='mt-1 p-1 w-full rounded border border-amber-300'
                      min='0'
                      max='100'
                      required
                    />
                    {errors[`sessionalMarks-${index}`] && (
                      <span className='text-red-500 text-xs'>{errors[`sessionalMarks-${index}`]}</span>
                    )}
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-600'>Semester Marks</label>
                    <input
                      type='number'
                      value={subject.semesterMarks}
                      onChange={(e) => handleChange(e, index, 'semesterMarks')}
                      className='mt-1 p-1 w-full rounded border border-amber-300'
                      min='0'
                      max='100'
                      required
                    />
                  </div>
                  <div>
                    <label className='text-sm font-medium text-gray-600'>Credits</label>
                    <input
                      type='number'
                      value={subject.credit}
                      onChange={(e) => handleChange(e, index, 'credit')}
                      className='mt-1 p-1 w-full rounded border border-amber-300'
                      min='0'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => removeSubject(index)}
                      className='mt-2 text-red-500 text-sm hover:text-red-700'
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type='button'
              onClick={addSubject}
              className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Add Subject
            </button>
          </div>

          {cgpa !== null && (
            <div className='mt-6 p-4 bg-amber-100 rounded-lg'>
              <h3 className='text-lg font-semibold text-amber-800'>Result Summary</h3>
              <p className='mt-2'>CGPA: {cgpa.toFixed(2)}</p>
            </div>
          )}

          <div className='mt-8 flex justify-center'>
            <button
              type='submit'
              className='bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors'
            >
              Generate Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Admin;

