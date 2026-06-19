import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envPath = 'c:/Users/ADMIN/OneDrive/goal/Desktop/zphs/.env';
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf-8');
} catch (e) {
  console.error("Error reading .env file:", e.message);
  process.exit(1);
}

const urlMatch = envContent.match(/VITE_SUPABASE_URL\s*=\s*([^\r\n]+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY\s*=\s*([^\r\n]+)/);

if (!urlMatch || !keyMatch) {
  console.error("Could not parse VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY from .env");
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim().replace(/['"]/g, '');
const supabaseAnonKey = keyMatch[1].trim().replace(/['"]/g, '');

console.log("Connecting to Supabase at:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    // 1. Verify connection and table accessibility
    const tables = ['schools', 'teachers', 'students', 'subjects', 'marks'];
    console.log("\n=== 1. Verifying Tables ===");
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.error(`❌ Table '${table}' check failed:`, error.message);
        process.exit(1);
      }
      console.log(`✅ Table '${table}' is accessible.`);
    }

    // 2. Setup Admin Teacher Account
    console.log("\n=== 2. Creating Admin Teacher Account ===");
    const adminEmail = 'admin_teacher@zphs.edu';
    const adminPassword = 'Password123';
    const adminName = 'Principal (Admin)';

    // Register User in Supabase Auth
    console.log(`Signing up ${adminEmail} via Supabase Auth...`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword,
    });

    let userId = '';
    if (authError) {
      if (authError.message.includes("already registered") || authError.status === 400) {
        console.log("User already signed up in Auth. Attempting to log in to fetch User ID...");
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminPassword,
        });
        if (loginError) {
          console.error("❌ Auth verification failed:", loginError.message);
          process.exit(1);
        } else {
          console.log("✅ Logged in successfully.");
          userId = loginData.user.id;
        }
      } else {
        console.error("❌ Sign up failed:", authError.message);
        process.exit(1);
      }
    } else if (authData && authData.user) {
      console.log("✅ Sign up successful!");
      userId = authData.user.id;
      
      // Since signup requires confirmation sometimes, let's login to be safe
      console.log("Logging in to establish session...");
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword,
      });
      if (!loginError && loginData.user) {
        userId = loginData.user.id;
      }
    }

    if (userId) {
      // Upsert teacher profile
      console.log("Upserting teacher profile into 'teachers' table...");
      const { error: teacherError } = await supabase.from('teachers').upsert({
        id: userId,
        email: adminEmail,
        name: adminName,
        role: 'admin'
      });

      if (teacherError) {
        console.error("❌ Upsert teacher profile failed:", teacherError.message);
        process.exit(1);
      } else {
        console.log("✅ Admin profile upserted successfully.");
      }
    }

    // 3. Setup Subjects
    console.log("\n=== 3. Seeding Subjects ===");
    const subjects = [
      { id: 'sub-telugu', subject_name: 'Telugu' },
      { id: 'sub-english', subject_name: 'English' },
      { id: 'sub-maths', subject_name: 'Mathematics' },
      { id: 'sub-science', subject_name: 'Science' },
      { id: 'sub-social', subject_name: 'Social Studies' }
    ];

    for (const sub of subjects) {
      const { error } = await supabase.from('subjects').upsert(sub);
      if (error) {
        console.error(`❌ Subject ${sub.subject_name} upsert failed:`, error.message);
        process.exit(1);
      }
    }
    console.log("✅ Subjects upserted successfully.");

    // 4. Create 20 Sample Students
    console.log("\n=== 4. Seeding 20 Students ===");
    const firstNames = ['Arjun', 'Sai', 'Karthik', 'Pranathi', 'Sravanthi', 'Nikhil', 'Pooja', 'Lokesh', 'Vineeth', 'Siri', 'Anusha', 'Charitha', 'Manikanta', 'Ganesh', 'Venkatesh', 'Rishwik', 'Varun', 'Tejasri', 'Akshaya', 'Bhavana'];
    const lastNames = ['Konda', 'Madasu', 'Bantu', 'Dasari', 'Jujjuri', 'Kommu', 'Nellutla', 'Allutla', 'Andem', 'Avirendla', 'Kurella', 'Pandiri', 'Nakirekanti', 'Boddu', 'Bommakanti', 'Kandlakunti', 'Nellore', 'Bairi', 'Chekka', 'Palla'];
    
    const studentsList = [];
    const classes = ['8', '9', '10'];
    const sections = ['A', 'B'];
    
    for (let i = 0; i < 20; i++) {
      const rollNumber = (700 + i).toString(); // Roll numbers 700 to 719
      const studentName = `${firstNames[i]} ${lastNames[i]}`;
      const fatherName = `${lastNames[i]} Sr.`;
      const classVal = classes[i % classes.length];
      const sectionVal = sections[i % sections.length];
      
      let dob = '2012-06-01'; // Class 8 default
      if (classVal === '9') dob = '2011-06-01';
      if (classVal === '10') dob = '2010-06-01';

      studentsList.push({
        id: `stud-seeded-${rollNumber}`,
        roll_number: rollNumber,
        student_name: studentName,
        father_name: fatherName,
        date_of_birth: dob,
        class: classVal,
        section: sectionVal,
        phone: '98765432' + i.toString().padStart(2, '0'),
        school_id: 'school-zphs-1'
      });
    }

    const { error: studentsError } = await supabase.from('students').upsert(studentsList);
    if (studentsError) {
      console.error("❌ Students seeding failed:", studentsError.message);
      process.exit(1);
    }
    console.log("✅ 20 Sample Students seeded successfully.");

    // 5. Seed Marks
    console.log("\n=== 5. Seeding Marks ===");
    const marksList = [];
    for (const student of studentsList) {
      for (const sub of subjects) {
        // Generate random realistic marks
        const fa1 = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const fa2 = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const fa3 = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const fa4 = Math.floor(Math.random() * 6) + 15; // 15 to 20
        const sa1 = Math.floor(Math.random() * 31) + 65; // 65 to 95
        const sa2 = Math.floor(Math.random() * 31) + 65; // 65 to 95

        marksList.push({
          id: `m-seeded-${student.roll_number}-${sub.id}`,
          student_id: student.id,
          subject_id: sub.id,
          fa1,
          fa2,
          fa3,
          fa4,
          sa1,
          sa2,
          updated_at: new Date().toISOString()
        });
      }
    }

    const { error: marksError } = await supabase.from('marks').upsert(marksList);
    if (marksError) {
      console.error("❌ Marks seeding failed:", marksError.message);
      process.exit(1);
    }
    console.log("✅ Sample Marks for all 5 subjects seeded successfully.");

    console.log("\n⭐️ Database verification and seeding completed successfully! ⭐️");
  } catch (err) {
    console.error("❌ Unexpected error:", err);
  }
}

run();
