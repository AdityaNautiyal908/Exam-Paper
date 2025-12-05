-- First, disable RLS to start fresh
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow all operations on user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow all operations on page_views" ON page_views;
DROP POLICY IF EXISTS "Allow all operations on user_actions" ON user_actions;
DROP POLICY IF EXISTS "Allow insert user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow update user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow read user_sessions for authenticated" ON user_sessions;
DROP POLICY IF EXISTS "Allow insert page_views" ON page_views;
DROP POLICY IF EXISTS "Allow read page_views for authenticated" ON page_views;
DROP POLICY IF EXISTS "Allow insert user_actions" ON user_actions;
DROP POLICY IF EXISTS "Allow read user_actions for authenticated" ON user_actions;

-- Now enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Create new policies
-- User Sessions: Allow insert/update for everyone, read for authenticated
CREATE POLICY "user_sessions_insert_policy" ON user_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "user_sessions_update_policy" ON user_sessions
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "user_sessions_select_policy" ON user_sessions
  FOR SELECT TO authenticated
  USING (true);

-- Page Views: Allow insert for everyone, read for authenticated
CREATE POLICY "page_views_insert_policy" ON page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "page_views_select_policy" ON page_views
  FOR SELECT TO authenticated
  USING (true);

-- User Actions: Allow insert for everyone, read for authenticated
CREATE POLICY "user_actions_insert_policy" ON user_actions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "user_actions_select_policy" ON user_actions
  FOR SELECT TO authenticated
  USING (true);
