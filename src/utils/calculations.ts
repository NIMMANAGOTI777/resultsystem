export interface SubjectMarks {
  fa1?: number | null;
  fa2?: number | null;
  fa3?: number | null;
  fa4?: number | null;
  sa1?: number | null;
  sa2?: number | null;
}

export const MAX_MARKS = {
  fa1: 50,
  fa2: 50,
  fa3: 50,
  fa4: 50,
  sa1: 100,
  sa2: 100
};

export function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A+': return 'text-green-600 bg-green-50 border-green-200';
    case 'A': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'F': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function calculateSubjectTotal(marks: SubjectMarks): number {
  let total = 0;
  if (marks.fa1 != null) total += marks.fa1;
  if (marks.fa2 != null) total += marks.fa2;
  if (marks.fa3 != null) total += marks.fa3;
  if (marks.fa4 != null) total += marks.fa4;
  if (marks.sa1 != null) total += marks.sa1;
  if (marks.sa2 != null) total += marks.sa2;
  return total;
}

export function calculateSubjectMaxTotal(marks: SubjectMarks): number {
  let maxTotal = 0;
  if (marks.fa1 != null) maxTotal += MAX_MARKS.fa1;
  if (marks.fa2 != null) maxTotal += MAX_MARKS.fa2;
  if (marks.fa3 != null) maxTotal += MAX_MARKS.fa3;
  if (marks.fa4 != null) maxTotal += MAX_MARKS.fa4;
  if (marks.sa1 != null) maxTotal += MAX_MARKS.sa1;
  if (marks.sa2 != null) maxTotal += MAX_MARKS.sa2;
  return maxTotal;
}

export function calculateSubjectPercentage(marks: SubjectMarks): number {
  const total = calculateSubjectTotal(marks);
  const maxTotal = calculateSubjectMaxTotal(marks);
  if (maxTotal === 0) return 0;
  return Math.round((total / maxTotal) * 100 * 10) / 10;
}

export interface StudentWithMarks {
  studentId: string;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  subjects: {
    [subjectName: string]: SubjectMarks;
  };
}

export interface StudentResultSummary {
  studentId: string;
  studentName: string;
  rollNumber: string;
  class: string;
  section: string;
  totalMarksObtained: number;
  totalMaxMarks: number;
  overallPercentage: number;
  overallGrade: string;
  subjectResults: {
    subjectName: string;
    marks: SubjectMarks;
    total: number;
    maxTotal: number;
    percentage: number;
    grade: string;
  }[];
  rank: number;
}

export function calculateStudentSummary(
  student: StudentWithMarks,
  allStudentsInClass: StudentWithMarks[]
): StudentResultSummary {
  const subjectResults = Object.entries(student.subjects).map(([subjectName, marks]) => {
    const total = calculateSubjectTotal(marks);
    const maxTotal = calculateSubjectMaxTotal(marks);
    const percentage = calculateSubjectPercentage(marks);
    const grade = getGrade(percentage);

    return {
      subjectName,
      marks,
      total,
      maxTotal,
      percentage,
      grade
    };
  });

  let totalMarksObtained = 0;
  let totalMaxMarks = 0;

  subjectResults.forEach(sub => {
    totalMarksObtained += sub.total;
    totalMaxMarks += sub.maxTotal;
  });

  const overallPercentage = totalMaxMarks === 0 ? 0 : Math.round((totalMarksObtained / totalMaxMarks) * 100 * 10) / 10;
  const overallGrade = getGrade(overallPercentage);

  // Calculate ranks
  const classPercentages = allStudentsInClass.map(s => {
    let obtained = 0;
    let max = 0;
    Object.values(s.subjects).forEach(marks => {
      obtained += calculateSubjectTotal(marks);
      max += calculateSubjectMaxTotal(marks);
    });
    return {
      id: s.studentId,
      percentage: max === 0 ? 0 : obtained / max
    };
  });

  // Sort descending by percentage
  classPercentages.sort((a, b) => b.percentage - a.percentage);

  // Find rank (1-indexed, handle ties)
  let rank = 1;
  for (let i = 0; i < classPercentages.length; i++) {
    if (classPercentages[i].id === student.studentId) {
      // Find the first index with the same percentage to handle ties
      const firstIndexWithSamePercentage = classPercentages.findIndex(
        item => item.percentage === classPercentages[i].percentage
      );
      rank = firstIndexWithSamePercentage + 1;
      break;
    }
  }

  return {
    studentId: student.studentId,
    studentName: student.studentName,
    rollNumber: student.rollNumber,
    class: student.class,
    section: student.section,
    totalMarksObtained,
    totalMaxMarks,
    overallPercentage,
    overallGrade,
    subjectResults,
    rank
  };
}
