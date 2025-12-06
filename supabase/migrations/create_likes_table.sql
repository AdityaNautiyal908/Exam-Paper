-- Create user_likes table
CREATE TABLE IF NOT EXISTS user_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_id TEXT, -- Clerk user ID (null for anonymous users)
  user_name TEXT,
  user_email TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  liked_at TIMESTAMP DEFAULT NOW(),
  device_info JSONB,
  CONSTRAINT fk_like_session FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- Create indexes for user_likes
CREATE INDEX IF NOT EXISTS idx_likes_session ON user_likes(session_id);
CREATE INDEX IF NOT EXISTS idx_likes_user ON user_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_timestamp ON user_likes(liked_at DESC);

-- Enable Row Level Security
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow insert user_likes" ON user_likes;
DROP POLICY IF EXISTS "Allow read user_likes for authenticated" ON user_likes;

-- User Likes Policies
-- Allow anyone to insert likes (for tracking)
CREATE POLICY "Allow insert user_likes" ON user_likes
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to read all likes (for admin dashboard)
CREATE POLICY "Allow read user_likes for authenticated" ON user_likes
  FOR SELECT USING (auth.role() = 'authenticated');
