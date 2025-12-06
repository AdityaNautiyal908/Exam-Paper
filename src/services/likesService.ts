import { supabase } from '../lib/supabase';

/**
 * Record a like from a user (authenticated or anonymous)
 */
export async function recordLike(
  sessionId: string,
  userId?: string,
  userName?: string,
  userEmail?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_likes')
      .insert({
        session_id: sessionId,
        user_id: userId || null,
        user_name: userName || null,
        user_email: userEmail || null,
        is_anonymous: !userId,
        device_info: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        },
      });

    if (error) {
      console.error('Error recording like:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to record like:', error);
    throw error;
  }
}

/**
 * Check if a session has already liked
 */
export async function hasSessionLiked(sessionId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('user_likes')
      .select('id')
      .eq('session_id', sessionId)
      .limit(1);

    if (error) {
      console.error('Error checking like status:', error);
      return false;
    }

    return (data?.length || 0) > 0;
  } catch (error) {
    console.error('Failed to check like status:', error);
    return false;
  }
}

/**
 * Get all likes (for admin dashboard)
 */
export async function getAllLikes(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('user_likes')
      .select('*')
      .order('liked_at', { ascending: false });

    if (error) {
      console.error('Error fetching likes:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch likes:', error);
    throw error;
  }
}

/**
 * Get like statistics
 */
export async function getLikeStats(): Promise<{
  total: number;
  authenticated: number;
  anonymous: number;
}> {
  try {
    const { data, error } = await supabase
      .from('user_likes')
      .select('is_anonymous');

    if (error) {
      console.error('Error fetching like stats:', error);
      throw error;
    }

    const total = data?.length || 0;
    const anonymous = data?.filter(like => like.is_anonymous).length || 0;
    const authenticated = total - anonymous;

    return { total, authenticated, anonymous };
  } catch (error) {
    console.error('Failed to fetch like stats:', error);
    return { total: 0, authenticated: 0, anonymous: 0 };
  }
}
