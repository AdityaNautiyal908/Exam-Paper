-- Create subject_notes table
CREATE TABLE IF NOT EXISTS subject_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  semester INTEGER NOT NULL,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER DEFAULT 0,
  file_type TEXT DEFAULT 'pdf',
  uploaded_by TEXT, -- Clerk user ID of admin who uploaded
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for subject_notes
CREATE INDEX IF NOT EXISTS idx_notes_subject ON subject_notes(subject);
CREATE INDEX IF NOT EXISTS idx_notes_semester ON subject_notes(semester);
CREATE INDEX IF NOT EXISTS idx_notes_created ON subject_notes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE subject_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read notes" ON subject_notes;
DROP POLICY IF EXISTS "Allow admin to insert notes" ON subject_notes;
DROP POLICY IF EXISTS "Allow admin to update notes" ON subject_notes;
DROP POLICY IF EXISTS "Allow admin to delete notes" ON subject_notes;

-- Notes Policies
-- Allow all authenticated users to read notes
CREATE POLICY "Allow authenticated users to read notes" ON subject_notes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow any authenticated user to insert notes (we'll check admin role in the app)
CREATE POLICY "Allow admin to insert notes" ON subject_notes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow any authenticated user to update notes (we'll check admin role in the app)
CREATE POLICY "Allow admin to update notes" ON subject_notes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow any authenticated user to delete notes (we'll check admin role in the app)
CREATE POLICY "Allow admin to delete notes" ON subject_notes
  FOR DELETE USING (auth.role() = 'authenticated');
