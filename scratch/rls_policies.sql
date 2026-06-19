-- Enable RLS for all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to prevent errors
DROP POLICY IF EXISTS "Allow public read schools" ON schools;
DROP POLICY IF EXISTS "Allow authenticated write schools" ON schools;
DROP POLICY IF EXISTS "Allow public read teachers" ON teachers;
DROP POLICY IF EXISTS "Allow authenticated write teachers" ON teachers;
DROP POLICY IF EXISTS "Allow public read students" ON students;
DROP POLICY IF EXISTS "Allow authenticated write students" ON students;
DROP POLICY IF EXISTS "Allow public read subjects" ON subjects;
DROP POLICY IF EXISTS "Allow authenticated write subjects" ON subjects;
DROP POLICY IF EXISTS "Allow public read marks" ON marks;
DROP POLICY IF EXISTS "Allow authenticated write marks" ON marks;

-- 1. schools policies (Public read-only, Auth edit)
CREATE POLICY "Allow public read schools" ON schools
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write schools" ON schools
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. teachers policies (Public read-only, Auth edit)
CREATE POLICY "Allow public read teachers" ON teachers
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write teachers" ON teachers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. students policies (Public read-only, Auth edit)
CREATE POLICY "Allow public read students" ON students
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write students" ON students
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. subjects policies (Public read-only, Auth edit)
CREATE POLICY "Allow public read subjects" ON subjects
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write subjects" ON subjects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. marks policies (Public read-only, Auth edit)
CREATE POLICY "Allow public read marks" ON marks
  FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write marks" ON marks
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
