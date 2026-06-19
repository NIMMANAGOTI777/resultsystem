import { createClient } from '@supabase/supabase-js';

// Read env variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Determine if we should use Supabase or fallback
export const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

console.log(isSupabaseConfigured ? "Supabase client initialized" : "Using localStorage mock database fallback");

// TypeScript Types
export interface School {
  id: string;
  school_name: string;
  school_code: string;
  logo_url: string;
  address: string;
  academic_year: string;
  footer_text: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
}

export interface Student {
  id: string;
  roll_number: string;
  student_name: string;
  father_name: string;
  date_of_birth: string; // YYYY-MM-DD
  class: string;
  section: string;
  phone: string;
  school_id: string;
}

export interface Subject {
  id: string;
  subject_name: string;
}

export interface Mark {
  id: string;
  student_id: string;
  subject_id: string;
  fa1: number | null;
  fa2: number | null;
  fa3: number | null;
  fa4: number | null;
  sa1: number | null;
  sa2: number | null;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  text: string;
  timestamp: string;
}

// ----------------------------------------------------
// DEFAULT MOCK DATA DEFINITIONS
// ----------------------------------------------------
const DEFAULT_SCHOOL: School = {
  id: "school-zphs-1",
  school_name: "ZPHS AGAMOTHKUR",
  school_code: "28160200501",
  logo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200",
  address: "Madugulapally Mandal, Nalgonda District, Telangana - 508228",
  academic_year: "2025-2026",
  footer_text: "Note: Regular attendance and home study are key to academic success. Keep learning!"
};

const DEFAULT_TEACHERS: User[] = [
  { id: "teacher-admin", email: "admin@zphs.edu", name: "M. Srinivasa Rao (Principal)", role: "admin" },
  { id: "teacher-maths", email: "teacher@zphs.edu", name: "K. Lalitha (Mathematics Teacher)", role: "teacher" }
];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: "sub-telugu", subject_name: "Telugu" },
  { id: "sub-english", subject_name: "English" },
  { id: "sub-maths", subject_name: "Mathematics" },
  { id: "sub-science", subject_name: "Science" },
  { id: "sub-social", subject_name: "Social Studies" }
];

const CLASS_8_STUDENTS: Student[] = [
  { id: "stud-801", roll_number: "801", student_name: "B. Jyothika", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-802", roll_number: "802", student_name: "D. Sri Laxmi", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-803", roll_number: "803", student_name: "B. Gowthami", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-804", roll_number: "804", student_name: "Ch. Charitha", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-805", roll_number: "805", student_name: "B. Yogitha", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-806", roll_number: "806", student_name: "B. Nandini", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-807", roll_number: "807", student_name: "N. Anusha", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-808", roll_number: "808", student_name: "K. Sravani", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-809", roll_number: "809", student_name: "O. Vaishnavi", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-810", roll_number: "810", student_name: "J. Shindy", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-811", roll_number: "811", student_name: "Shahiya", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-812", roll_number: "812", student_name: "B. Vikas", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-813", roll_number: "813", student_name: "B. Abinav", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-814", roll_number: "814", student_name: "N. Sai Reddy", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-815", roll_number: "815", student_name: "N. Pranith", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-816", roll_number: "816", student_name: "B. Shiva", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-817", roll_number: "817", student_name: "J. Charan Teja", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-818", roll_number: "818", student_name: "M. Ishaab", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-819", roll_number: "819", student_name: "G. Veneel", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-820", roll_number: "820", student_name: "P. Shashank", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-821", roll_number: "821", student_name: "D. Varun Teja", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-822", roll_number: "822", student_name: "K. Lokesh", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-823", roll_number: "823", student_name: "V. Karthik", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-824", roll_number: "824", student_name: "N. Vignesh", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-825", roll_number: "825", student_name: "M. Mahidher", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-826", roll_number: "826", student_name: "N. Piyush", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-827", roll_number: "827", student_name: "A. Ganesh", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-828", roll_number: "828", student_name: "M. Venkatesh", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" },
  { id: "stud-829", roll_number: "829", student_name: "A. Jaswanth", father_name: "Parent", date_of_birth: "2012-06-01", class: "8", section: "A", phone: "", school_id: "school-zphs-1" }
];

const CLASS_8_MARKS: Mark[] = [];
CLASS_8_STUDENTS.forEach(student => {
  DEFAULT_SUBJECTS.forEach(subject => {
    CLASS_8_MARKS.push({
      id: `m-${student.id}-${subject.id}`,
      student_id: student.id,
      subject_id: subject.id,
      fa1: 0,
      fa2: 0,
      fa3: 0,
      fa4: 0,
      sa1: 0,
      sa2: 0,
      updated_at: new Date().toISOString()
    });
  });
});

const CLASS_9_STUDENTS: Student[] = [
  { id: "stud-901", roll_number: "901", student_name: "Allutla Jashwanth", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20043448231", school_id: "school-zphs-1" },
  { id: "stud-902", roll_number: "902", student_name: "Andem Ganesh", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20009510862", school_id: "school-zphs-1" },
  { id: "stud-903", roll_number: "903", student_name: "Bandi Abhinav", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20035943704", school_id: "school-zphs-1" },
  { id: "stud-904", roll_number: "904", student_name: "Bantu Gouthami", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20284480027", school_id: "school-zphs-1" },
  { id: "stud-905", roll_number: "905", student_name: "Bantu Jyothika", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20066437383", school_id: "school-zphs-1" },
  { id: "stud-906", roll_number: "906", student_name: "Boddu Nandini", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20286840073", school_id: "school-zphs-1" },
  { id: "stud-907", roll_number: "907", student_name: "Boddu Shiva", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20248214956", school_id: "school-zphs-1" },
  { id: "stud-908", roll_number: "908", student_name: "Boddu Vikas", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20021149874", school_id: "school-zphs-1" },
  { id: "stud-909", roll_number: "909", student_name: "Bolkonda Yogitha", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20005827141", school_id: "school-zphs-1" },
  { id: "stud-910", roll_number: "910", student_name: "Chithaluri Charitha", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20031236671", school_id: "school-zphs-1" },
  { id: "stud-911", roll_number: "911", student_name: "Dasari Srilakshmi", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20011214098", school_id: "school-zphs-1" },
  { id: "stud-912", roll_number: "912", student_name: "Dasari Vaishnavi", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20030624669", school_id: "school-zphs-1" },
  { id: "stud-913", roll_number: "913", student_name: "Dasari Varun Tej", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20200733559", school_id: "school-zphs-1" },
  { id: "stud-914", roll_number: "914", student_name: "Gaddamidi Vineel", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20030121162", school_id: "school-zphs-1" },
  { id: "stud-915", roll_number: "915", student_name: "Jakkala Sindhu", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20661586021", school_id: "school-zphs-1" },
  { id: "stud-916", roll_number: "916", student_name: "Jujjuri Charan Teja", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20531158076", school_id: "school-zphs-1" },
  { id: "stud-917", roll_number: "917", student_name: "Koka Lokesh", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20267445366", school_id: "school-zphs-1" },
  { id: "stud-918", roll_number: "918", student_name: "Konda Sravani", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20624586182", school_id: "school-zphs-1" },
  { id: "stud-919", roll_number: "919", student_name: "Madasu Venkatesh", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20014304247", school_id: "school-zphs-1" },
  { id: "stud-920", roll_number: "920", student_name: "Malleboina Issak", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20014106936", school_id: "school-zphs-1" },
  { id: "stud-921", roll_number: "921", student_name: "Mandala Mahidhar", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20032994519", school_id: "school-zphs-1" },
  { id: "stud-922", roll_number: "922", student_name: "Nakirekanti Anusha", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20287847771", school_id: "school-zphs-1" },
  { id: "stud-923", roll_number: "923", student_name: "Nakirekanti Pranith", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20022664030", school_id: "school-zphs-1" },
  { id: "stud-924", roll_number: "924", student_name: "Namireddy Sai Reddy", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20215120374", school_id: "school-zphs-1" },
  { id: "stud-925", roll_number: "925", student_name: "Nellutla Vignesh", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20402049366", school_id: "school-zphs-1" },
  { id: "stud-926", roll_number: "926", student_name: "Palla Sheshank", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20173926776", school_id: "school-zphs-1" },
  { id: "stud-927", roll_number: "927", student_name: "Shaik Shahin", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20012250540", school_id: "school-zphs-1" },
  { id: "stud-928", roll_number: "928", student_name: "Valloju Karthik", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20071880822", school_id: "school-zphs-1" },
  { id: "stud-929", roll_number: "929", student_name: "Nukapanga Rishwik", father_name: "Parent", date_of_birth: "2011-06-01", class: "9", section: "A", phone: "20091654514", school_id: "school-zphs-1" }
];

const CLASS_9_MARKS: Mark[] = [];
CLASS_9_STUDENTS.forEach(student => {
  DEFAULT_SUBJECTS.forEach(subject => {
    CLASS_9_MARKS.push({
      id: `m-${student.id}-${subject.id}`,
      student_id: student.id,
      subject_id: subject.id,
      fa1: 0,
      fa2: 0,
      fa3: 0,
      fa4: 0,
      sa1: 0,
      sa2: 0,
      updated_at: new Date().toISOString()
    });
  });
});

const CLASS_10_STUDENTS: Student[] = [
  { id: "stud-1001", roll_number: "1001", student_name: "Avirendla Bindhusri", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20341624129", school_id: "school-zphs-1" },
  { id: "stud-1002", roll_number: "1002", student_name: "Avirendla Mahalakshmi", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20096736173", school_id: "school-zphs-1" },
  { id: "stud-1003", roll_number: "1003", student_name: "Bantu Mahalaxmi", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20012282664", school_id: "school-zphs-1" },
  { id: "stud-1004", roll_number: "1004", student_name: "Bantu Shirisha", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20082311105", school_id: "school-zphs-1" },
  { id: "stud-1005", roll_number: "1005", student_name: "Chithaluri Bhavana", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20102979903", school_id: "school-zphs-1" },
  { id: "stud-1006", roll_number: "1006", student_name: "Katam Akshaya", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20056002391", school_id: "school-zphs-1" },
  { id: "stud-1007", roll_number: "1007", student_name: "Nakka Niharika", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20531661379", school_id: "school-zphs-1" },
  { id: "stud-1008", roll_number: "1008", student_name: "Nampally Chethana", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20316867564", school_id: "school-zphs-1" },
  { id: "stud-1009", roll_number: "1009", student_name: "Palla Pooja", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20004005510", school_id: "school-zphs-1" },
  { id: "stud-1010", roll_number: "1010", student_name: "Pathani Siri", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20667127504", school_id: "school-zphs-1" },
  { id: "stud-1011", roll_number: "1011", student_name: "Yalagaboina Tejasri", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20237083500", school_id: "school-zphs-1" },
  { id: "stud-1012", roll_number: "1012", student_name: "Bantu Jashwanth", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20143271715", school_id: "school-zphs-1" },
  { id: "stud-1013", roll_number: "1013", student_name: "Bantu Karthik", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20039537121", school_id: "school-zphs-1" },
  { id: "stud-1014", roll_number: "1014", student_name: "Bantu Rishi", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20006215044", school_id: "school-zphs-1" },
  { id: "stud-1015", roll_number: "1015", student_name: "Bantu Sairam", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20207602801", school_id: "school-zphs-1" },
  { id: "stud-1016", roll_number: "1016", student_name: "Boddu Shiva", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20009203847", school_id: "school-zphs-1" },
  { id: "stud-1017", roll_number: "1017", student_name: "Bommakanti Manikanta", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20920763703", school_id: "school-zphs-1" },
  { id: "stud-1018", roll_number: "1018", student_name: "Kandlakunti Rambabu", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20009698082", school_id: "school-zphs-1" },
  { id: "stud-1019", roll_number: "1019", student_name: "Kommu Lokesh", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20176486188", school_id: "school-zphs-1" },
  { id: "stud-1020", roll_number: "1020", student_name: "Kurella Shivamani Nagabhushanam", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20521038904", school_id: "school-zphs-1" },
  { id: "stud-1021", roll_number: "1021", student_name: "Mandala Saikumar", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20007971283", school_id: "school-zphs-1" },
  { id: "stud-1022", roll_number: "1022", student_name: "Pandiri Nikhil", father_name: "Parent", date_of_birth: "2010-06-01", class: "10", section: "A", phone: "20119791746", school_id: "school-zphs-1" }
];

const CLASS_10_MARKS: Mark[] = [];
CLASS_10_STUDENTS.forEach(student => {
  DEFAULT_SUBJECTS.forEach(subject => {
    CLASS_10_MARKS.push({
      id: `m-${student.id}-${subject.id}`,
      student_id: student.id,
      subject_id: subject.id,
      fa1: 0,
      fa2: 0,
      fa3: 0,
      fa4: 0,
      sa1: 0,
      sa2: 0,
      updated_at: new Date().toISOString()
    });
  });
});

const DEFAULT_STUDENTS: Student[] = CLASS_8_STUDENTS.concat(CLASS_9_STUDENTS).concat(CLASS_10_STUDENTS);

const DEFAULT_MARKS: Mark[] = CLASS_8_MARKS.concat(CLASS_9_MARKS).concat(CLASS_10_MARKS);

const DEFAULT_ACTIVITIES: ActivityLog[] = [
  { id: "act-1", text: "System initialized with Telugu & English language support", timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "act-2", text: "Imported Class 8, 9 & 10 registers (80 total students)", timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: "act-3", text: "Initialized all student marks to 0", timestamp: new Date().toISOString() }
];

// Helper to initialize local storage
function initLocalStorageMock() {
  const currentSchoolStr = localStorage.getItem('zphs_school');
  if (!currentSchoolStr || JSON.parse(currentSchoolStr).school_name.includes("Zilla Parishad")) {
    localStorage.setItem('zphs_school', JSON.stringify(DEFAULT_SCHOOL));
  }
  if (!localStorage.getItem('zphs_teachers')) {
    localStorage.setItem('zphs_teachers', JSON.stringify(DEFAULT_TEACHERS));
  }
  if (!localStorage.getItem('zphs_subjects')) {
    localStorage.setItem('zphs_subjects', JSON.stringify(DEFAULT_SUBJECTS));
  }
  
  // Force reset once to keep ONLY Class 8, 9 & 10 student data
  const migratedAllClasses = localStorage.getItem('zphs_migrated_all_classes_v4');
  if (!migratedAllClasses) {
    localStorage.setItem('zphs_students', JSON.stringify(DEFAULT_STUDENTS));
    localStorage.setItem('zphs_marks', JSON.stringify(DEFAULT_MARKS));
    localStorage.setItem('zphs_migrated_all_classes_v4', 'true');
  } else {
    // If already migrated, make sure they are not empty
    if (!localStorage.getItem('zphs_students')) {
      localStorage.setItem('zphs_students', JSON.stringify(DEFAULT_STUDENTS));
    }
    if (!localStorage.getItem('zphs_marks')) {
      localStorage.setItem('zphs_marks', JSON.stringify(DEFAULT_MARKS));
    }
  }

  if (!localStorage.getItem('zphs_activities')) {
    localStorage.setItem('zphs_activities', JSON.stringify(DEFAULT_ACTIVITIES));
  }
}

// Call helper
if (!isSupabaseConfigured) {
  initLocalStorageMock();
}

// ----------------------------------------------------
// DATABASE SERVICE IMPLEMENTATION
// ----------------------------------------------------

export const dbService = {
  // School Settings
  async getSchoolSettings(): Promise<School> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('schools').select('*').limit(1).single();
      if (!error && data) return data;
      // If error or empty, return default and insert
      return DEFAULT_SCHOOL;
    } else {
      return JSON.parse(localStorage.getItem('zphs_school') || JSON.stringify(DEFAULT_SCHOOL));
    }
  },

  async updateSchoolSettings(settings: Partial<School>): Promise<School> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('schools')
        .update(settings)
        .eq('id', settings.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const current = await this.getSchoolSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem('zphs_school', JSON.stringify(updated));
      await this.addActivity(`Updated school branding settings: ${updated.school_name}`);
      return updated;
    }
  },

  // Auth Operations
  async login(email: string, password: string): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Get teacher profile
      const { data: teacher, error: profileError } = await supabase
        .from('teachers')
        .select('*')
        .eq('email', email)
        .single();
      
      if (profileError || !teacher) {
        // Return standard user if profile missing
        return {
          id: data.user.id,
          email: data.user.email || email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'teacher'
        };
      }
      return teacher;
    } else {
      // Local Storage login check
      const teachers: User[] = JSON.parse(localStorage.getItem('zphs_teachers') || '[]');
      const user = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
      
      if (user && password === 'password') {
        sessionStorage.setItem('zphs_current_user', JSON.stringify(user));
        return user;
      }
      throw new Error("Invalid email or password");
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      sessionStorage.removeItem('zphs_current_user');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: teacher } = await supabase
        .from('teachers')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (teacher) return teacher;
      return {
        id: user.id,
        email: user.email || '',
        name: user.email?.split('@')[0] || '',
        role: user.email?.includes('admin') ? 'admin' : 'teacher'
      };
    } else {
      const stored = sessionStorage.getItem('zphs_current_user');
      return stored ? JSON.parse(stored) : null;
    }
  },

  // Students CRUD
  async getStudents(): Promise<Student[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('students').select('*').order('student_name');
      if (error) throw error;
      return data || [];
    } else {
      return JSON.parse(localStorage.getItem('zphs_students') || '[]');
    }
  },

  async addStudent(student: Omit<Student, 'id' | 'school_id'>): Promise<Student> {
    const school = await this.getSchoolSettings();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('students')
        .insert([{ ...student, school_id: school.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const students = await this.getStudents();
      
      // Check for duplicate roll number
      if (students.some(s => s.roll_number.toLowerCase() === student.roll_number.toLowerCase())) {
        throw new Error(`Roll number ${student.roll_number} already exists!`);
      }

      const newStudent: Student = {
        ...student,
        id: 'stud-' + Math.random().toString(36).substr(2, 9),
        school_id: school.id
      };
      students.push(newStudent);
      localStorage.setItem('zphs_students', JSON.stringify(students));
      await this.addActivity(`Added student: ${newStudent.student_name} (Roll: ${newStudent.roll_number})`);
      return newStudent;
    }
  },

  async updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const students = await this.getStudents();
      const idx = students.findIndex(s => s.id === id);
      if (idx === -1) throw new Error("Student not found");
      
      // Check roll number uniqueness if updated
      if (updates.roll_number && updates.roll_number !== students[idx].roll_number) {
        if (students.some(s => s.id !== id && s.roll_number.toLowerCase() === updates.roll_number?.toLowerCase())) {
          throw new Error(`Roll number ${updates.roll_number} already exists!`);
        }
      }

      const updated = { ...students[idx], ...updates };
      students[idx] = updated;
      localStorage.setItem('zphs_students', JSON.stringify(students));
      await this.addActivity(`Updated student details: ${updated.student_name}`);
      return updated;
    }
  },

  async deleteStudent(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
    } else {
      const students = await this.getStudents();
      const student = students.find(s => s.id === id);
      const filtered = students.filter(s => s.id !== id);
      localStorage.setItem('zphs_students', JSON.stringify(filtered));

      // Cascade delete marks
      const marks = await this.getAllMarks();
      const filteredMarks = marks.filter(m => m.student_id !== id);
      localStorage.setItem('zphs_marks', JSON.stringify(filteredMarks));

      if (student) {
        await this.addActivity(`Deleted student: ${student.student_name}`);
      }
    }
  },

  // Subjects
  async getSubjects(): Promise<Subject[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('subjects').select('*').order('subject_name');
      if (error) throw error;
      return data || [];
    } else {
      return JSON.parse(localStorage.getItem('zphs_subjects') || '[]');
    }
  },

  // Marks Operations
  async getAllMarks(): Promise<Mark[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('marks').select('*');
      if (error) throw error;
      return data || [];
    } else {
      return JSON.parse(localStorage.getItem('zphs_marks') || '[]');
    }
  },

  async saveMarks(studentId: string, subjectId: string, marksData: Partial<Omit<Mark, 'id' | 'student_id' | 'subject_id' | 'updated_at'>>): Promise<Mark> {
    if (isSupabaseConfigured && supabase) {
      // Check if marks record exists
      const { data: existing } = await supabase
        .from('marks')
        .select('id')
        .eq('student_id', studentId)
        .eq('subject_id', subjectId)
        .maybeSingle();

      let result;
      if (existing) {
        const { data, error } = await supabase
          .from('marks')
          .update({ ...marksData, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('marks')
          .insert([{ student_id: studentId, subject_id: subjectId, ...marksData }])
          .select()
          .single();
        if (error) throw error;
        result = data;
      }
      return result;
    } else {
      const marks = await this.getAllMarks();
      const idx = marks.findIndex(m => m.student_id === studentId && m.subject_id === subjectId);
      
      let updatedMark: Mark;
      if (idx !== -1) {
        updatedMark = {
          ...marks[idx],
          ...marksData,
          updated_at: new Date().toISOString()
        } as Mark;
        marks[idx] = updatedMark;
      } else {
        updatedMark = {
          id: 'm-' + Math.random().toString(36).substr(2, 9),
          student_id: studentId,
          subject_id: subjectId,
          fa1: marksData.fa1 !== undefined ? marksData.fa1 : null,
          fa2: marksData.fa2 !== undefined ? marksData.fa2 : null,
          fa3: marksData.fa3 !== undefined ? marksData.fa3 : null,
          fa4: marksData.fa4 !== undefined ? marksData.fa4 : null,
          sa1: marksData.sa1 !== undefined ? marksData.sa1 : null,
          sa2: marksData.sa2 !== undefined ? marksData.sa2 : null,
          updated_at: new Date().toISOString()
        };
        marks.push(updatedMark);
      }

      localStorage.setItem('zphs_marks', JSON.stringify(marks));
      
      // Log activity
      const students = await this.getStudents();
      const student = students.find(s => s.id === studentId);
      const subjects = await this.getSubjects();
      const subject = subjects.find(s => s.id === subjectId);
      if (student && subject) {
        await this.addActivity(`Updated marks for ${student.student_name} in ${subject.subject_name}`);
      }

      return updatedMark;
    }
  },

  async bulkSaveMarks(entries: { rollNumber: string; studentName: string; classVal: string; subjectName: string; marks: Partial<Omit<Mark, 'id' | 'student_id' | 'subject_id' | 'updated_at'>> }[]): Promise<{ success: number; failed: string[] }> {
    let successCount = 0;
    const failures: string[] = [];
    
    // Cache students and subjects for fast lookup
    const students = await this.getStudents();
    const subjects = await this.getSubjects();
    
    for (const entry of entries) {
      try {
        // 1. Find or create student
        let student = students.find(s => s.roll_number.toLowerCase() === entry.rollNumber.toLowerCase());
        
        if (!student) {
          // Auto create student
          student = await this.addStudent({
            roll_number: entry.rollNumber,
            student_name: entry.studentName,
            father_name: "Parent", // placeholder
            date_of_birth: "2011-01-01", // placeholder default
            class: entry.classVal,
            section: "A",
            phone: ""
          });
          // Add to local cache list
          students.push(student);
        }

        // 2. Find subject
        let subject = subjects.find(s => s.subject_name.toLowerCase() === entry.subjectName.toLowerCase());
        if (!subject) {
          // If subject doesn't exist, we can add it or return error
          // Let's auto-create subjects to be extremely robust!
          if (isSupabaseConfigured && supabase) {
            const { data, error } = await supabase
              .from('subjects')
              .insert([{ subject_name: entry.subjectName }])
              .select()
              .single();
            if (error) throw error;
            subject = data;
          } else {
            const localSubs = JSON.parse(localStorage.getItem('zphs_subjects') || '[]');
            subject = {
              id: 'sub-' + Math.random().toString(36).substr(2, 9),
              subject_name: entry.subjectName
            };
            localSubs.push(subject);
            localStorage.setItem('zphs_subjects', JSON.stringify(localSubs));
          }
          if (subject) {
            subjects.push(subject);
          }
        }

        if (!subject) {
          throw new Error(`Could not create subject: ${entry.subjectName}`);
        }

        // 3. Save marks
        await this.saveMarks(student.id, subject.id, entry.marks);
        successCount++;
      } catch (err: any) {
        failures.push(`Roll ${entry.rollNumber} (${entry.subjectName}): ${err.message || 'Validation error'}`);
      }
    }

    if (successCount > 0) {
      await this.addActivity(`Imported marks spreadsheet with ${successCount} entries`);
    }

    return {
      success: successCount,
      failed: failures
    };
  },

  // Student portal lookup
  async findStudentWithMarks(rollNumber: string, dob: string): Promise<any | null> {
    const students = await this.getStudents();
    const student = students.find(
      s => s.roll_number.toLowerCase() === rollNumber.toLowerCase() && s.date_of_birth === dob
    );

    if (!student) return null;

    // Fetch marks
    const allMarks = await this.getAllMarks();
    const subjects = await this.getSubjects();

    const studentMarksMap: { [subjectName: string]: any } = {};
    
    // Ensure all subjects are represented in the object
    subjects.forEach(sub => {
      studentMarksMap[sub.subject_name] = {
        fa1: null,
        fa2: null,
        fa3: null,
        fa4: null,
        sa1: null,
        sa2: null
      };
    });

    const studentMarksList = allMarks.filter(m => m.student_id === student.id);
    studentMarksList.forEach(m => {
      const sub = subjects.find(s => s.id === m.subject_id);
      if (sub) {
        studentMarksMap[sub.subject_name] = {
          fa1: m.fa1,
          fa2: m.fa2,
          fa3: m.fa3,
          fa4: m.fa4,
          sa1: m.sa1,
          sa2: m.sa2
        };
      }
    });

    // To compute rank, fetch all students in the same class
    const classStudents = students.filter(s => s.class === student.class);
    const classStudentsWithMarks: any[] = [];

    for (const cs of classStudents) {
      const csMarksMap: { [subjectName: string]: any } = {};
      subjects.forEach(sub => {
        csMarksMap[sub.subject_name] = { fa1: null, fa2: null, fa3: null, fa4: null, sa1: null, sa2: null };
      });

      const csMarksList = allMarks.filter(m => m.student_id === cs.id);
      csMarksList.forEach(m => {
        const sub = subjects.find(s => s.id === m.subject_id);
        if (sub) {
          csMarksMap[sub.subject_name] = {
            fa1: m.fa1,
            fa2: m.fa2,
            fa3: m.fa3,
            fa4: m.fa4,
            sa1: m.sa1,
            sa2: m.sa2
          };
        }
      });

      classStudentsWithMarks.push({
        studentId: cs.id,
        studentName: cs.student_name,
        rollNumber: cs.roll_number,
        class: cs.class,
        section: cs.section,
        subjects: csMarksMap
      });
    }

    const currentStudentWithMarks = {
      studentId: student.id,
      studentName: student.student_name,
      rollNumber: student.roll_number,
      class: student.class,
      section: student.section,
      subjects: studentMarksMap
    };

    return {
      student,
      subjectsMap: studentMarksMap,
      classStudents: classStudentsWithMarks,
      currentWithMarks: currentStudentWithMarks
    };
  },

  // Activities
  async getRecentActivities(): Promise<ActivityLog[]> {
    if (isSupabaseConfigured && supabase) {
      // Can store activities in a DB table or return empty
      return [];
    } else {
      const logs = JSON.parse(localStorage.getItem('zphs_activities') || '[]');
      return logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
    }
  },

  async addActivity(text: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const logs = JSON.parse(localStorage.getItem('zphs_activities') || '[]');
      const newLog: ActivityLog = {
        id: 'act-' + Math.random().toString(36).substr(2, 9),
        text,
        timestamp: new Date().toISOString()
      };
      logs.push(newLog);
      localStorage.setItem('zphs_activities', JSON.stringify(logs));
    }
  }
};
