import fs from 'fs';

const firstNames = ['Arjun', 'Sai', 'Karthik', 'Pranathi', 'Sravanthi', 'Nikhil', 'Pooja', 'Lokesh', 'Vineeth', 'Siri', 'Anusha', 'Charitha', 'Manikanta', 'Ganesh', 'Venkatesh', 'Rishwik', 'Varun', 'Tejasri', 'Akshaya', 'Bhavana'];
const lastNames = ['Konda', 'Madasu', 'Bantu', 'Dasari', 'Jujjuri', 'Kommu', 'Nellutla', 'Allutla', 'Andem', 'Avirendla', 'Kurella', 'Pandiri', 'Nakirekanti', 'Boddu', 'Bommakanti', 'Kandlakunti', 'Nellore', 'Bairi', 'Chekka', 'Palla'];
const classes = ['8', '9', '10'];
const sections = ['A', 'B'];
const subjects = [
  { id: 'sub-telugu', name: 'Telugu' },
  { id: 'sub-english', name: 'English' },
  { id: 'sub-maths', name: 'Mathematics' },
  { id: 'sub-science', name: 'Science' },
  { id: 'sub-social', name: 'Social Studies' }
];

let sql = `-- Full Supabase Seeding Script
-- Run this in your Supabase SQL Editor

-- 1. Create pgcrypto extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Setup Admin User (admin@zphs.edu / Password123)
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Clean up existing data to allow re-runs
  DELETE FROM auth.users WHERE email = 'admin@zphs.edu';
  DELETE FROM public.teachers WHERE email = 'admin@zphs.edu';

  -- Insert into auth.users
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@zphs.edu',
    crypt('Password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    now(),
    now()
  )
  RETURNING id INTO new_user_id;

  -- Insert into public.teachers
  INSERT INTO public.teachers (id, email, name, role)
  VALUES (new_user_id, 'admin@zphs.edu', 'Principal (Admin)', 'admin');

END $$;

-- 3. Ensure default subjects exist
INSERT INTO public.subjects (id, subject_name) VALUES
  ('sub-telugu', 'Telugu'),
  ('sub-english', 'English'),
  ('sub-maths', 'Mathematics'),
  ('sub-science', 'Science'),
  ('sub-social', 'Social Studies')
ON CONFLICT (id) DO UPDATE SET subject_name = EXCLUDED.subject_name;

-- 4. Clean existing seeded students and marks to allow clean slate
DELETE FROM public.students WHERE id LIKE 'stud-seeded-%';

-- 5. Seed 20 Students
`;

// Generate students SQL
for (let i = 0; i < 20; i++) {
  const rollNumber = (700 + i).toString();
  const name = `${firstNames[i]} ${lastNames[i]}`;
  const fatherName = `${lastNames[i]} Sr.`;
  const classVal = classes[i % classes.length];
  const sectionVal = sections[i % sections.length];
  let dob = '2012-06-01';
  if (classVal === '9') dob = '2011-06-01';
  if (classVal === '10') dob = '2010-06-01';

  sql += `INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-${rollNumber}', '${rollNumber}', '${name}', '${fatherName}', '${dob}', '${classVal}', '${sectionVal}', '98765432${i.toString().padStart(2, '0')}', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;\n`;
}

sql += `\n-- 6. Seed Marks for all students and subjects\n`;

// Generate marks SQL
for (let i = 0; i < 20; i++) {
  const rollNumber = (700 + i).toString();
  const studentId = `stud-seeded-${rollNumber}`;
  
  for (const sub of subjects) {
    const fa1 = Math.floor(Math.random() * 6) + 15; // 15 to 20
    const fa2 = Math.floor(Math.random() * 6) + 15;
    const fa3 = Math.floor(Math.random() * 6) + 15;
    const fa4 = Math.floor(Math.random() * 6) + 15;
    const sa1 = Math.floor(Math.random() * 31) + 65; // 65 to 95
    const sa2 = Math.floor(Math.random() * 31) + 65;

    sql += `INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-${rollNumber}-${sub.id}', '${studentId}', '${sub.id}', ${fa1}, ${fa2}, ${fa3}, ${fa4}, ${sa1}, ${sa2}, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;\n`;
}
}

fs.writeFileSync('c:/Users/ADMIN/OneDrive/goal/Desktop/zphs/scratch/db_seed_full.sql', sql);
console.log("SQL seed file successfully generated in scratch/db_seed_full.sql");
