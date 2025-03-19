import { doc, getDoc, setDoc, collection, getDocs,  writeBatch } from 'firebase/firestore';
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
  name: string;
  rollNumber: string;
  semester: string;
  subjects: Subject[];
}

const Admin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    rollNumber: '',
    semester: '',
    subjects: [{
      code: '', name: '', sessionalMarks: '', semesterMarks: '', 
      credit: '', grade: ''
    }],
  });

  const [cgpa, setCGPA] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSemesterTemplate = async () => {
      if (formData.semester) {
        const semesterRef = doc(db, 'semesterTemplates', `semester-${formData.semester}`);
        const docSnap = await getDoc(semesterRef);

        if (docSnap.exists()) {
          const template = docSnap.data().subjects;
          setFormData(prev => ({
            ...prev,
            subjects: template.map((subject: Subject) => ({
              ...subject,
              sessionalMarks: '',
              semesterMarks: ''
            }))
          }));
        }
      }
    };
    fetchSemesterTemplate();
  }, [formData.semester]);

  const validateField = (name: string, value: string) => {
    const numericValue = parseInt(value);
    let error = '';
    
    switch (name) {
      case 'sessionalMarks':
        if (isNaN(numericValue)) error = 'Invalid marks';
        else if (numericValue < 0 || numericValue > 50) error = 'Marks must be 0-50';
        break;
      case 'semesterMarks':
        if (isNaN(numericValue)) error = 'Invalid marks';
        else if (numericValue < 0 || numericValue > 100) error = 'Marks must be 0-100';
        break;
      case 'credit':
        if (isNaN(numericValue)) error = 'Invalid credit';
        else if (numericValue < 0) error = 'Credit cannot be negative';
        break;
      case 'semester':
        if (isNaN(numericValue)) error = 'Invalid semester';
        else if (numericValue < 1 || numericValue > 5) error = 'Semester must be 1-5';
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
        credit: '', grade: ''
      }],
    });
  };

  const removeSubject = (index: number) => {
    const updatedSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: updatedSubjects });
  };

  const calculateCGPA = () => {
    let totalGradePoints = 0;
    let totalCredits = 0;

    formData.subjects.forEach(subject => {
      const sessional = parseInt(subject.sessionalMarks) || 0;
      const semester = parseInt(subject.semesterMarks) || 0;
      const total = sessional + semester;
      const credit = parseInt(subject.credit) || 0;

      let grade = 0;
      if (total >= 90) grade = 10;
      else if (total >= 80) grade = 9;
      else if (total >= 70) grade = 8;
      else if (total >= 60) grade = 7;
      else if (total >= 50) grade = 6;
      else if (total >= 40) grade = 5;

      totalGradePoints += grade * credit;
      totalCredits += credit;
    });

    return totalCredits > 0 ? totalGradePoints / totalCredits : 0;
  };

  const calculateRank = async (studentId: string) => {
    try {
      const studentsRef = collection(db, 'student');
      const snapshot = await getDocs(studentsRef);
      const students = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        cgpa: doc.data().cgpa || 0,
        subjects: doc.data().subjects || []
      }));

      // Calculate 4-credit grade points for all students
      const studentsWithPoints = students.map(student => ({
        ...student,
        gradePoints: student.subjects
          .filter((subj: { credit: string; }) => parseInt(subj.credit) === 4)
          .reduce((acc: number, subj: { sessionalMarks: string; semesterMarks: string; }) => {
            const total = parseInt(subj.sessionalMarks) + parseInt(subj.semesterMarks);
            let grade = 0;
            if (total >= 90) grade = 10;
            else if (total >= 80) grade = 9;
            else if (total >= 70) grade = 8;
            else if (total >= 60) grade = 7;
            else if (total >= 50) grade = 6;
            else if (total >= 40) grade = 5;
            return acc + (grade * 4);
          }, 0)
      }));

      // Sort students
      studentsWithPoints.sort((a, b) => {
        if (b.cgpa !== a.cgpa) return b.cgpa - a.cgpa;
        return b.gradePoints - a.gradePoints;
      });

      // Update ranks using batch
      const batch = writeBatch(db);
      studentsWithPoints.forEach((student, index) => {
        const rank = index + 1;
        const studentRef = doc(db, 'student', student.id);
        batch.update(studentRef, { rank });
      });
      await batch.commit();

      // Return current student's rank
      const currentStudent = studentsWithPoints.find(s => s.id === studentId);
      return currentStudent ? studentsWithPoints.indexOf(currentStudent) + 1 : null;
    } catch (error) {
      console.error('Error calculating rank:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    try {
      const cgpaValue = calculateCGPA();
      setCGPA(cgpaValue);

      // Save student document
      const studentRef = doc(collection(db, 'student'));
      await setDoc(studentRef, {
        ...formData,
        cgpa: cgpaValue,
        timestamp: new Date(),
      });

      // Calculate and update ranks
      await calculateRank(studentRef.id);

      // Save semester template if needed
      const semesterRef = doc(db, 'semesterTemplates', `semester-${formData.semester}`);
      const docSnap = await getDoc(semesterRef);
      
      if (!docSnap.exists()) {
        await setDoc(semesterRef, {
          semester: formData.semester,
          subjects: formData.subjects.map(({ code, name, credit, grade }) => ({
            code, name, credit, grade
          }))
        });
      }

      alert('Result saved successfully');
      setFormData({
        name: '',
        rollNumber: '',
        semester: '',
        subjects: [{
          code: '', name: '', sessionalMarks: '', semesterMarks: '',
          credit: '', grade: ''
        }],
      });
      setCGPA(null);
    } catch (error) {
      console.error('Error saving result:', error);
      alert('Error saving result');
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
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>Semester {num}</option>
                ))}
              </select>
              {errors.semester && <span className='text-red-500 text-sm'>{errors.semester}</span>}
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

