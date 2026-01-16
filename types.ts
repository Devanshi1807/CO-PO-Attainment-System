
export type WorkflowStatus = 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED' | 'LOCKED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // For mock authentication
  role: 'ADMIN' | 'TEACHER' | 'HOD';
  departmentId: string;
}

export interface ProgramOutcome {
  id: string;
  code: string;
  description: string;
}

export interface ProgramSpecificOutcome {
  id: string;
  code: string;
  description: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: string;
  academicYear: string;
  teacherId: string;
  workflowStatus: WorkflowStatus;
  lastModified: string;
  completionProgress: number; // 0-100
  description?: string;
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
  level: number; // 0-3
}

export interface OBEConfig {
  institutionName: string;
  internalWeightage: number;
  externalWeightage: number;
  defaultTargetPercentage: number;
  attainmentLevels: {
    level1: number;
    level2: number;
    level3: number;
  };
}

export interface StudentMark {
  studentId: string;
  studentName: string;
  coMarks: Record<string, number>; // coId -> marks obtained
}
