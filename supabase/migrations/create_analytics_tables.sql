-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  user_id TEXT, -- Clerk user ID (null for anonymous)
  user_name TEXT,
  user_email TEXT,
  user_photo TEXT,
  signup_date TIMESTAMP,
  is_anonymous BOOLEAN DEFAULT true,
  first_visit TIMESTAMP DEFAULT NOW(),
  last_visit TIMESTAMP DEFAULT NOW(),
  total_visits INTEGER DEFAULT 1,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  device_info JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_last_visit ON user_sessions(last_visit DESC);
CREATE INDEX IF NOT EXISTS idx_is_anonymous ON user_sessions(is_anonymous);

-- Create page_views table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  time_spent INTEGER DEFAULT 0, -- in seconds
  timestamp TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- Create indexes for page_views
CREATE INDEX IF NOT EXISTS idx_page_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_timestamp ON page_views(timestamp DESC);

-- Create user_actions table
CREATE TABLE IF NOT EXISTS user_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  action_type TEXT NOT NULL, -- 'download', 'search', 'view_paper', etc.
  action_data JSONB, -- Additional data about the action
  timestamp TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_action_session FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- Create indexes for user_actions
CREATE INDEX IF NOT EXISTS idx_action_session ON user_actions(session_id);
CREATE INDEX IF NOT EXISTS idx_action_type ON user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_action_timestamp ON user_actions(timestamp DESC);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on user_sessions" ON user_sessions;
DROP POLICY IF EXISTS "Allow all operations on page_views" ON page_views;
DROP POLICY IF EXISTS "Allow all operations on user_actions" ON user_actions;

-- User Sessions Policies
-- Allow anyone to insert and update their own session (for tracking)
CREATE POLICY "Allow insert user_sessions" ON user_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update user_sessions" ON user_sessions
  FOR UPDATE USING (true);

-- Allow authenticated users to read all sessions (for admin dashboard)
CREATE POLICY "Allow read user_sessions for authenticated" ON user_sessions
  FOR SELECT USING (auth.role() = 'authenticated');

-- Page Views Policies
-- Allow anyone to insert page views (for tracking)
CREATE POLICY "Allow insert page_views" ON page_views
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all page views (for admin dashboard)
CREATE POLICY "Allow read page_views for authenticated" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- User Actions Policies
-- Allow anyone to insert actions (for tracking)
CREATE POLICY "Allow insert user_actions" ON user_actions
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all actions (for admin dashboard)
CREATE POLICY "Allow read user_actions for authenticated" ON user_actions
  FOR SELECT USING (auth.role() = 'authenticated');
