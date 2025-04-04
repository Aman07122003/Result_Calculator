// src/types/index.ts
export interface Subject {
    code: string;
    name: string;
    sessionalMarks: number;
    semesterMarks: number;
    credit: number;
    pointer: number;
    totalPointer: number;
    totalMarks: number;
    grade?: string;
  }
  
  export interface StudentData {
    Year: string;
    semester: string;
    name: string;
    rollNumber: number;
    cgpa: number;
    rank?: number;
    totalCredit: number;
    totalPointer: number;
    subjects: Subject[];
  }