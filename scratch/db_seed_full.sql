-- Full Supabase Seeding Script
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
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-700', '700', 'Arjun Konda', 'Konda Sr.', '2012-06-01', '8', 'A', '9876543200', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-701', '701', 'Sai Madasu', 'Madasu Sr.', '2011-06-01', '9', 'B', '9876543201', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-702', '702', 'Karthik Bantu', 'Bantu Sr.', '2010-06-01', '10', 'A', '9876543202', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-703', '703', 'Pranathi Dasari', 'Dasari Sr.', '2012-06-01', '8', 'B', '9876543203', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-704', '704', 'Sravanthi Jujjuri', 'Jujjuri Sr.', '2011-06-01', '9', 'A', '9876543204', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-705', '705', 'Nikhil Kommu', 'Kommu Sr.', '2010-06-01', '10', 'B', '9876543205', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-706', '706', 'Pooja Nellutla', 'Nellutla Sr.', '2012-06-01', '8', 'A', '9876543206', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-707', '707', 'Lokesh Allutla', 'Allutla Sr.', '2011-06-01', '9', 'B', '9876543207', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-708', '708', 'Vineeth Andem', 'Andem Sr.', '2010-06-01', '10', 'A', '9876543208', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-709', '709', 'Siri Avirendla', 'Avirendla Sr.', '2012-06-01', '8', 'B', '9876543209', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-710', '710', 'Anusha Kurella', 'Kurella Sr.', '2011-06-01', '9', 'A', '9876543210', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-711', '711', 'Charitha Pandiri', 'Pandiri Sr.', '2010-06-01', '10', 'B', '9876543211', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-712', '712', 'Manikanta Nakirekanti', 'Nakirekanti Sr.', '2012-06-01', '8', 'A', '9876543212', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-713', '713', 'Ganesh Boddu', 'Boddu Sr.', '2011-06-01', '9', 'B', '9876543213', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-714', '714', 'Venkatesh Bommakanti', 'Bommakanti Sr.', '2010-06-01', '10', 'A', '9876543214', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-715', '715', 'Rishwik Kandlakunti', 'Kandlakunti Sr.', '2012-06-01', '8', 'B', '9876543215', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-716', '716', 'Varun Nellore', 'Nellore Sr.', '2011-06-01', '9', 'A', '9876543216', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-717', '717', 'Tejasri Bairi', 'Bairi Sr.', '2010-06-01', '10', 'B', '9876543217', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-718', '718', 'Akshaya Chekka', 'Chekka Sr.', '2012-06-01', '8', 'A', '9876543218', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;
INSERT INTO public.students (id, roll_number, student_name, father_name, date_of_birth, class, section, phone, school_id)
VALUES ('stud-seeded-719', '719', 'Bhavana Palla', 'Palla Sr.', '2011-06-01', '9', 'B', '9876543219', 'school-zphs-1')
ON CONFLICT (roll_number) DO UPDATE SET student_name = EXCLUDED.student_name;

-- 6. Seed Marks for all students and subjects
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-700-sub-telugu', 'stud-seeded-700', 'sub-telugu', 19, 19, 19, 19, 81, 70, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-700-sub-english', 'stud-seeded-700', 'sub-english', 19, 18, 15, 18, 78, 84, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-700-sub-maths', 'stud-seeded-700', 'sub-maths', 20, 20, 20, 20, 66, 69, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-700-sub-science', 'stud-seeded-700', 'sub-science', 20, 15, 16, 19, 90, 71, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-700-sub-social', 'stud-seeded-700', 'sub-social', 16, 17, 17, 18, 76, 92, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-701-sub-telugu', 'stud-seeded-701', 'sub-telugu', 17, 18, 17, 20, 70, 80, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-701-sub-english', 'stud-seeded-701', 'sub-english', 19, 15, 15, 17, 94, 76, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-701-sub-maths', 'stud-seeded-701', 'sub-maths', 15, 18, 16, 18, 65, 83, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-701-sub-science', 'stud-seeded-701', 'sub-science', 18, 17, 19, 20, 79, 78, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-701-sub-social', 'stud-seeded-701', 'sub-social', 19, 18, 20, 18, 70, 80, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-702-sub-telugu', 'stud-seeded-702', 'sub-telugu', 15, 19, 19, 19, 87, 79, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-702-sub-english', 'stud-seeded-702', 'sub-english', 19, 15, 20, 16, 73, 86, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-702-sub-maths', 'stud-seeded-702', 'sub-maths', 20, 18, 16, 19, 77, 90, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-702-sub-science', 'stud-seeded-702', 'sub-science', 20, 17, 16, 18, 88, 66, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-702-sub-social', 'stud-seeded-702', 'sub-social', 18, 18, 15, 20, 87, 68, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-703-sub-telugu', 'stud-seeded-703', 'sub-telugu', 18, 20, 17, 16, 74, 77, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-703-sub-english', 'stud-seeded-703', 'sub-english', 19, 20, 20, 18, 74, 90, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-703-sub-maths', 'stud-seeded-703', 'sub-maths', 15, 20, 18, 20, 92, 80, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-703-sub-science', 'stud-seeded-703', 'sub-science', 18, 16, 15, 19, 88, 88, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-703-sub-social', 'stud-seeded-703', 'sub-social', 20, 16, 18, 15, 81, 80, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-704-sub-telugu', 'stud-seeded-704', 'sub-telugu', 20, 16, 18, 16, 70, 88, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-704-sub-english', 'stud-seeded-704', 'sub-english', 16, 18, 15, 20, 94, 73, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-704-sub-maths', 'stud-seeded-704', 'sub-maths', 16, 19, 19, 15, 86, 80, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-704-sub-science', 'stud-seeded-704', 'sub-science', 18, 20, 18, 19, 79, 81, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-704-sub-social', 'stud-seeded-704', 'sub-social', 20, 17, 17, 19, 95, 73, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-705-sub-telugu', 'stud-seeded-705', 'sub-telugu', 18, 18, 17, 20, 65, 82, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-705-sub-english', 'stud-seeded-705', 'sub-english', 20, 15, 15, 16, 83, 79, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-705-sub-maths', 'stud-seeded-705', 'sub-maths', 16, 19, 15, 19, 82, 82, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-705-sub-science', 'stud-seeded-705', 'sub-science', 15, 18, 20, 19, 92, 75, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-705-sub-social', 'stud-seeded-705', 'sub-social', 20, 19, 18, 19, 72, 92, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-706-sub-telugu', 'stud-seeded-706', 'sub-telugu', 15, 16, 18, 19, 73, 93, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-706-sub-english', 'stud-seeded-706', 'sub-english', 16, 18, 19, 17, 74, 68, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-706-sub-maths', 'stud-seeded-706', 'sub-maths', 17, 17, 18, 15, 89, 88, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-706-sub-science', 'stud-seeded-706', 'sub-science', 20, 18, 15, 18, 89, 69, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-706-sub-social', 'stud-seeded-706', 'sub-social', 16, 15, 17, 15, 81, 87, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-707-sub-telugu', 'stud-seeded-707', 'sub-telugu', 20, 18, 18, 19, 88, 66, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-707-sub-english', 'stud-seeded-707', 'sub-english', 16, 16, 15, 16, 85, 72, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-707-sub-maths', 'stud-seeded-707', 'sub-maths', 20, 16, 19, 18, 88, 87, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-707-sub-science', 'stud-seeded-707', 'sub-science', 17, 20, 19, 15, 72, 84, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-707-sub-social', 'stud-seeded-707', 'sub-social', 16, 15, 16, 18, 75, 80, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-708-sub-telugu', 'stud-seeded-708', 'sub-telugu', 19, 19, 15, 20, 73, 82, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-708-sub-english', 'stud-seeded-708', 'sub-english', 19, 17, 15, 16, 69, 66, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-708-sub-maths', 'stud-seeded-708', 'sub-maths', 16, 19, 18, 16, 82, 69, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-708-sub-science', 'stud-seeded-708', 'sub-science', 20, 16, 18, 17, 65, 78, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-708-sub-social', 'stud-seeded-708', 'sub-social', 18, 19, 18, 19, 72, 94, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-709-sub-telugu', 'stud-seeded-709', 'sub-telugu', 16, 18, 19, 16, 82, 93, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-709-sub-english', 'stud-seeded-709', 'sub-english', 18, 18, 16, 17, 71, 67, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-709-sub-maths', 'stud-seeded-709', 'sub-maths', 18, 16, 20, 19, 93, 65, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-709-sub-science', 'stud-seeded-709', 'sub-science', 20, 19, 16, 17, 89, 65, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-709-sub-social', 'stud-seeded-709', 'sub-social', 20, 15, 19, 15, 76, 69, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-710-sub-telugu', 'stud-seeded-710', 'sub-telugu', 15, 16, 19, 18, 90, 94, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-710-sub-english', 'stud-seeded-710', 'sub-english', 18, 18, 20, 18, 84, 90, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-710-sub-maths', 'stud-seeded-710', 'sub-maths', 20, 20, 15, 15, 83, 91, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-710-sub-science', 'stud-seeded-710', 'sub-science', 19, 17, 20, 16, 77, 84, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-710-sub-social', 'stud-seeded-710', 'sub-social', 19, 15, 17, 17, 75, 66, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-711-sub-telugu', 'stud-seeded-711', 'sub-telugu', 18, 16, 20, 19, 68, 76, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-711-sub-english', 'stud-seeded-711', 'sub-english', 18, 16, 20, 15, 89, 85, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-711-sub-maths', 'stud-seeded-711', 'sub-maths', 19, 20, 19, 18, 91, 95, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-711-sub-science', 'stud-seeded-711', 'sub-science', 19, 19, 19, 16, 87, 70, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-711-sub-social', 'stud-seeded-711', 'sub-social', 18, 15, 17, 20, 77, 78, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-712-sub-telugu', 'stud-seeded-712', 'sub-telugu', 16, 20, 16, 20, 71, 69, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-712-sub-english', 'stud-seeded-712', 'sub-english', 15, 16, 17, 20, 81, 90, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-712-sub-maths', 'stud-seeded-712', 'sub-maths', 20, 19, 16, 15, 90, 88, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-712-sub-science', 'stud-seeded-712', 'sub-science', 16, 18, 15, 19, 75, 93, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-712-sub-social', 'stud-seeded-712', 'sub-social', 18, 19, 19, 20, 70, 87, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-713-sub-telugu', 'stud-seeded-713', 'sub-telugu', 16, 15, 19, 20, 66, 68, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-713-sub-english', 'stud-seeded-713', 'sub-english', 20, 15, 20, 18, 71, 91, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-713-sub-maths', 'stud-seeded-713', 'sub-maths', 17, 17, 15, 20, 76, 66, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-713-sub-science', 'stud-seeded-713', 'sub-science', 16, 15, 19, 17, 82, 95, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-713-sub-social', 'stud-seeded-713', 'sub-social', 16, 18, 19, 16, 95, 88, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-714-sub-telugu', 'stud-seeded-714', 'sub-telugu', 20, 17, 18, 19, 78, 72, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-714-sub-english', 'stud-seeded-714', 'sub-english', 20, 15, 20, 16, 92, 89, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-714-sub-maths', 'stud-seeded-714', 'sub-maths', 17, 20, 19, 20, 68, 81, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-714-sub-science', 'stud-seeded-714', 'sub-science', 17, 16, 20, 15, 84, 78, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-714-sub-social', 'stud-seeded-714', 'sub-social', 16, 16, 15, 17, 68, 67, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-715-sub-telugu', 'stud-seeded-715', 'sub-telugu', 16, 15, 17, 17, 80, 87, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-715-sub-english', 'stud-seeded-715', 'sub-english', 17, 16, 16, 19, 83, 88, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-715-sub-maths', 'stud-seeded-715', 'sub-maths', 20, 16, 20, 17, 66, 93, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-715-sub-science', 'stud-seeded-715', 'sub-science', 20, 18, 17, 17, 72, 95, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-715-sub-social', 'stud-seeded-715', 'sub-social', 16, 15, 20, 16, 71, 90, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-716-sub-telugu', 'stud-seeded-716', 'sub-telugu', 18, 15, 15, 19, 73, 88, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-716-sub-english', 'stud-seeded-716', 'sub-english', 17, 16, 19, 16, 91, 72, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-716-sub-maths', 'stud-seeded-716', 'sub-maths', 19, 20, 19, 17, 82, 86, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-716-sub-science', 'stud-seeded-716', 'sub-science', 16, 15, 17, 17, 83, 74, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-716-sub-social', 'stud-seeded-716', 'sub-social', 18, 18, 17, 18, 69, 72, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-717-sub-telugu', 'stud-seeded-717', 'sub-telugu', 15, 17, 17, 18, 89, 94, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-717-sub-english', 'stud-seeded-717', 'sub-english', 17, 18, 17, 19, 74, 93, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-717-sub-maths', 'stud-seeded-717', 'sub-maths', 17, 17, 19, 19, 77, 65, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-717-sub-science', 'stud-seeded-717', 'sub-science', 17, 17, 20, 18, 76, 83, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-717-sub-social', 'stud-seeded-717', 'sub-social', 16, 18, 15, 15, 85, 66, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-718-sub-telugu', 'stud-seeded-718', 'sub-telugu', 19, 16, 16, 17, 83, 75, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-718-sub-english', 'stud-seeded-718', 'sub-english', 20, 15, 15, 18, 82, 82, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-718-sub-maths', 'stud-seeded-718', 'sub-maths', 16, 18, 19, 16, 68, 73, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-718-sub-science', 'stud-seeded-718', 'sub-science', 15, 16, 15, 17, 69, 95, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-718-sub-social', 'stud-seeded-718', 'sub-social', 20, 15, 20, 16, 86, 71, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-719-sub-telugu', 'stud-seeded-719', 'sub-telugu', 20, 16, 17, 20, 66, 78, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-719-sub-english', 'stud-seeded-719', 'sub-english', 15, 19, 15, 15, 77, 92, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-719-sub-maths', 'stud-seeded-719', 'sub-maths', 17, 17, 15, 16, 85, 89, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-719-sub-science', 'stud-seeded-719', 'sub-science', 18, 16, 15, 17, 66, 67, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
INSERT INTO public.marks (id, student_id, subject_id, fa1, fa2, fa3, fa4, sa1, sa2, updated_at)
VALUES ('m-seeded-719-sub-social', 'stud-seeded-719', 'sub-social', 17, 19, 19, 19, 70, 93, now())
ON CONFLICT (student_id, subject_id) DO UPDATE SET fa1 = EXCLUDED.fa1, fa2 = EXCLUDED.fa2, fa3 = EXCLUDED.fa3, fa4 = EXCLUDED.fa4, sa1 = EXCLUDED.sa1, sa2 = EXCLUDED.sa2;
