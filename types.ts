
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER';
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface ProgramOutcome {
  id: string;
  code: string;
  description: string;
  programId: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  academicYear: string;
  teacherId: string; // The allotted faculty
}

export interface CourseOutcome {
  id: string;
  courseId: string;
  code: string;
  description: string;
  targetMarksPercentage: number;
}

export interface CoPoMapping {
  courseId: string;
  coId: string;
  poId: string;
  level: number;
}

export interface AssessmentTool {
  id: string;
  courseId: string;
  name: string;
  type: 'internal' | 'external';
  weightage: number;
  maxMarks: number;
}

export interface StudentMark {
  studentId: string;
  courseId: string;
  marks: Record<string, Record<string, number>>; 
}

export interface OBEConfig {
  institutionName: string;
  attainmentLevels: {
    level1: number;
    level2: number;
    level3: number;
  };
}
