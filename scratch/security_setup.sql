-- Production Security Setup for ZPHS Results Portal

-- 1. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS on All Tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Drop all previous policies to avoid duplication
DROP POLICY IF EXISTS "Allow public read schools" ON public.schools;
DROP POLICY IF EXISTS "Allow authenticated write schools" ON public.schools;
DROP POLICY IF EXISTS "Allow public read teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow authenticated write teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow public read students" ON public.students;
DROP POLICY IF EXISTS "Allow authenticated write students" ON public.students;
DROP POLICY IF EXISTS "Allow public read subjects" ON public.subjects;
DROP POLICY IF EXISTS "Allow authenticated write subjects" ON public.subjects;
DROP POLICY IF EXISTS "Allow public read marks" ON public.marks;
DROP POLICY IF EXISTS "Allow authenticated write marks" ON public.marks;
DROP POLICY IF EXISTS "Allow authenticated write audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow authenticated read audit_logs" ON public.audit_logs;

-- 4. Establish Strict RLS Policies

-- Schools: Public read, Authenticated write
CREATE POLICY "Allow public read schools" ON public.schools 
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated write schools" ON public.schools 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Subjects: Public read, Authenticated write
CREATE POLICY "Allow public read subjects" ON public.subjects 
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow authenticated write subjects" ON public.subjects 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Teachers: Authenticated only
CREATE POLICY "Allow authenticated read teachers" ON public.teachers 
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write teachers" ON public.teachers 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Students: Authenticated only (NO PUBLIC SELECT)
CREATE POLICY "Allow authenticated read students" ON public.students 
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write students" ON public.students 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Marks: Authenticated only (NO PUBLIC SELECT)
CREATE POLICY "Allow authenticated read marks" ON public.marks 
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write marks" ON public.marks 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Audit Logs: Authenticated only
CREATE POLICY "Allow authenticated read audit_logs" ON public.audit_logs 
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated write audit_logs" ON public.audit_logs 
  FOR INSERT TO authenticated WITH CHECK (true);


-- 5. Secure RPC: get_student_result(roll_num, dob_val)
-- SECURITY DEFINER allows this function to bypass RLS tables.
CREATE OR REPLACE FUNCTION public.get_student_result(roll_num TEXT, dob_val TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  student_row RECORD;
  current_student_json JSONB;
  class_students_json JSONB;
  result_json JSONB;
BEGIN
  -- Validate inputs to prevent injection (inputs are parameterized anyway, but check length/validity)
  IF roll_num IS NULL OR dob_val IS NULL OR LENGTH(roll_num) = 0 OR LENGTH(dob_val) = 0 THEN
    RETURN NULL;
  END IF;

  -- 1. Query student matching roll number and DOB (exact match)
  SELECT id, roll_number, student_name, father_name, date_of_birth, class, section, school_id 
  INTO student_row
  FROM public.students
  WHERE LOWER(roll_number) = LOWER(roll_num) AND date_of_birth = dob_val;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- 2. Build current student info with marks map
  SELECT jsonb_build_object(
    'studentId', student_row.id,
    'studentName', student_row.student_name,
    'rollNumber', student_row.roll_number,
    'class', student_row.class,
    'section', student_row.section,
    'subjects', (
      SELECT jsonb_object_agg(
        sub.subject_name,
        jsonb_build_object(
          'fa1', m.fa1,
          'fa2', m.fa2,
          'fa3', m.fa3,
          'fa4', m.fa4,
          'sa1', m.sa1,
          'sa2', m.sa2
        )
      )
      FROM public.subjects sub
      LEFT JOIN public.marks m ON m.subject_id = sub.id AND m.student_id = student_row.id
    )
  ) INTO current_student_json;

  -- 3. Fetch anonymized class students (only ID and marks) for rank computation
  SELECT jsonb_agg(
    jsonb_build_object(
      'studentId', cs.id,
      'subjects', (
        SELECT jsonb_object_agg(
          sub.subject_name,
          jsonb_build_object(
            'fa1', m.fa1,
            'fa2', m.fa2,
            'fa3', m.fa3,
            'fa4', m.fa4,
            'sa1', m.sa1,
            'sa2', m.sa2
          )
        )
        FROM public.subjects sub
        LEFT JOIN public.marks m ON m.subject_id = sub.id AND m.student_id = cs.id
      )
    )
  ) INTO class_students_json
  FROM public.students cs
  WHERE cs.class = student_row.class;

  -- 4. Combine results
  result_json := jsonb_build_object(
    'student', jsonb_build_object(
      'id', student_row.id,
      'roll_number', student_row.roll_number,
      'student_name', student_row.student_name,
      'father_name', student_row.father_name,
      'date_of_birth', student_row.date_of_birth,
      'class', student_row.class,
      'section', student_row.section
    ),
    'currentWithMarks', current_student_json,
    'classStudents', class_students_json
  );

  -- Log student result lookup audit trail (anonymous search)
  INSERT INTO public.audit_logs(user_id, action)
  VALUES ('anonymous', 'Student result lookup: Roll ' || student_row.roll_number || ' (Class ' || student_row.class || ')');

  RETURN result_json;
END;
$$;


-- 6. Secure RPC: get_portal_stats()
-- Calculates statistics without exposing individual records.
CREATE OR REPLACE FUNCTION public.get_portal_stats()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  stats_json JSONB;
  stud_count INTEGER;
  class_count INTEGER;
  pub_count INTEGER;
  avg_pct INTEGER;
  total_obt NUMERIC := 0;
  total_max NUMERIC := 0;
  m_row RECORD;
BEGIN
  SELECT COUNT(*) INTO stud_count FROM public.students;
  SELECT COUNT(DISTINCT class) INTO class_count FROM public.students;
  SELECT COUNT(DISTINCT student_id) INTO pub_count FROM public.marks;
  
  FOR m_row IN SELECT fa1, fa2, fa3, fa4, sa1, sa2 FROM public.marks LOOP
    IF m_row.fa1 IS NOT NULL THEN total_obt := total_obt + m_row.fa1; total_max := total_max + 50; END IF;
    IF m_row.fa2 IS NOT NULL THEN total_obt := total_obt + m_row.fa2; total_max := total_max + 50; END IF;
    IF m_row.fa3 IS NOT NULL THEN total_obt := total_obt + m_row.fa3; total_max := total_max + 50; END IF;
    IF m_row.fa4 IS NOT NULL THEN total_obt := total_obt + m_row.fa4; total_max := total_max + 50; END IF;
    IF m_row.sa1 IS NOT NULL THEN total_obt := total_obt + m_row.sa1; total_max := total_max + 100; END IF;
    IF m_row.sa2 IS NOT NULL THEN total_obt := total_obt + m_row.sa2; total_max := total_max + 100; END IF;
  END LOOP;

  IF total_max = 0 THEN
    avg_pct := 80;
  ELSE
    avg_pct := ROUND((total_obt / total_max) * 100);
  END IF;

  stats_json := jsonb_build_object(
    'studentsCount', stud_count,
    'classesCount', class_count,
    'publishedCount', pub_count,
    'avgPercent', avg_pct
  );

  RETURN stats_json;
END;
$$;
