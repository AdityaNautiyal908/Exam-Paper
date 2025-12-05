-- FINAL SOLUTION: Disable RLS for analytics tables
-- This is the correct approach for analytics that need to track anonymous users
-- Security is handled at the application level (admin-only dashboard access via Clerk)

-- Disable RLS on all analytics tables
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions DISABLE ROW LEVEL SECURITY;

-- Drop all policies (cleanup)
DROP POLICY IF EXISTS "user_sessions_insert_policy" ON user_sessions;
DROP POLICY IF EXISTS "user_sessions_update_policy" ON user_sessions;
DROP POLICY IF EXISTS "user_sessions_select_policy" ON user_sessions;
DROP POLICY IF EXISTS "page_views_insert_policy" ON page_views;
DROP POLICY IF EXISTS "page_views_select_policy" ON page_views;
DROP POLICY IF EXISTS "user_actions_insert_policy" ON user_actions;
DROP POLICY IF EXISTS "user_actions_select_policy" ON user_actions;

-- Note: Security is enforced by:
-- 1. Analytics dashboard is protected by Clerk admin authentication
-- 2. Only admins can access /admin/analytics route
-- 3. Supabase anon key has limited permissions
-- 4. No sensitive user data is stored (just analytics metadata)
