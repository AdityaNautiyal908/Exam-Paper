import { supabase } from '../lib/supabase';

export interface UserSession {
  id?: string;
  session_id: string;
  user_id?: string | null;
  user_name?: string | null;
  user_email?: string | null;
  user_photo?: string | null;
  signup_date?: string | null;
  is_anonymous: boolean;
  first_visit: string;
  last_visit: string;
  total_visits: number;
  total_time_spent: number;
  device_info?: any;
}

export interface PageView {
  id?: string;
  session_id: string;
  page_path: string;
  page_title?: string;
  time_spent: number;
  timestamp: string;
}

export interface UserAction {
  id?: string;
  session_id: string;
  action_type: string;
  action_data?: any;
  timestamp: string;
}

export class AnalyticsService {
  // Session Management
  static async createOrUpdateSession(sessionData: Partial<UserSession>): Promise<UserSession | null> {
    try {
      const { data: existing } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_id', sessionData.session_id)
        .single();

      if (existing) {
        // Update existing session
        const { data, error } = await supabase
          .from('user_sessions')
          .update({
            last_visit: new Date().toISOString(),
            total_visits: existing.total_visits + 1,
            total_time_spent: (existing.total_time_spent || 0) + (sessionData.total_time_spent || 0),
            ...(sessionData.user_id && {
              user_id: sessionData.user_id,
              user_name: sessionData.user_name,
              user_email: sessionData.user_email,
              user_photo: sessionData.user_photo,
              signup_date: sessionData.signup_date,
              is_anonymous: false,
            }),
            updated_at: new Date().toISOString(),
          })
          .eq('session_id', sessionData.session_id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new session
        const { data, error } = await supabase
          .from('user_sessions')
          .insert({
            session_id: sessionData.session_id,
            user_id: sessionData.user_id || null,
            user_name: sessionData.user_name || null,
            user_email: sessionData.user_email || null,
            user_photo: sessionData.user_photo || null,
            signup_date: sessionData.signup_date || null,
            is_anonymous: !sessionData.user_id,
            device_info: sessionData.device_info || {},
            total_time_spent: sessionData.total_time_spent || 0,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error creating/updating session:', error);
      return null;
    }
  }

  // Page View Tracking
  static async trackPageView(pageView: Omit<PageView, 'id' | 'timestamp'>): Promise<void> {
    try {
      const { error } = await supabase.from('page_views').insert({
        session_id: pageView.session_id,
        page_path: pageView.page_path,
        page_title: pageView.page_title,
        time_spent: pageView.time_spent,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // Action Tracking
  static async trackAction(action: Omit<UserAction, 'id' | 'timestamp'>): Promise<void> {
    try {
      const { error } = await supabase.from('user_actions').insert({
        session_id: action.session_id,
        action_type: action.action_type,
        action_data: action.action_data,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking action:', error);
    }
  }

  // Analytics Dashboard Queries
  static async getAllSessions(filters?: {
    isAnonymous?: boolean;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }) {
    try {
      let query = supabase
        .from('user_sessions')
        .select('*', { count: 'exact' })
        .order('last_visit', { ascending: false });

      if (filters?.isAnonymous !== undefined) {
        query = query.eq('is_anonymous', filters.isAnonymous);
      }

      if (filters?.startDate) {
        query = query.gte('first_visit', filters.startDate);
      }

      if (filters?.endDate) {
        query = query.lte('last_visit', filters.endDate);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return { data: [], count: 0 };
    }
  }

  static async getSessionDetails(sessionId: string) {
    try {
      const [sessionResult, pageViewsResult, actionsResult] = await Promise.all([
        supabase.from('user_sessions').select('*').eq('session_id', sessionId).single(),
        supabase.from('page_views').select('*').eq('session_id', sessionId).order('timestamp', { ascending: false }),
        supabase.from('user_actions').select('*').eq('session_id', sessionId).order('timestamp', { ascending: false }),
      ]);

      return {
        session: sessionResult.data,
        pageViews: pageViewsResult.data || [],
        actions: actionsResult.data || [],
      };
    } catch (error) {
      console.error('Error fetching session details:', error);
      return null;
    }
  }

  static async getAnalyticsOverview() {
    try {
      const [sessionsResult, pageViewsResult, actionsResult] = await Promise.all([
        supabase.from('user_sessions').select('*', { count: 'exact', head: true }),
        supabase.from('page_views').select('*', { count: 'exact', head: true }),
        supabase.from('user_actions').select('*', { count: 'exact', head: true }),
      ]);

      const { data: sessions } = await supabase
        .from('user_sessions')
        .select('total_time_spent, is_anonymous');

      const totalTimeSpent = sessions?.reduce((sum, s) => sum + (s.total_time_spent || 0), 0) || 0;
      const avgSessionDuration = sessions?.length ? totalTimeSpent / sessions.length : 0;
      const anonymousCount = sessions?.filter(s => s.is_anonymous).length || 0;
      const loggedInCount = sessions?.filter(s => !s.is_anonymous).length || 0;

      return {
        totalSessions: sessionsResult.count || 0,
        totalPageViews: pageViewsResult.count || 0,
        totalActions: actionsResult.count || 0,
        anonymousUsers: anonymousCount,
        loggedInUsers: loggedInCount,
        avgSessionDuration: Math.round(avgSessionDuration),
      };
    } catch (error) {
      console.error('Error fetching analytics overview:', error);
      return null;
    }
  }

  static async getMostVisitedPages(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('page_views')
        .select('page_path, page_title')
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Count page visits
      const pageCounts = data?.reduce((acc: any, view) => {
        const key = view.page_path;
        if (!acc[key]) {
          acc[key] = { path: view.page_path, title: view.page_title, count: 0 };
        }
        acc[key].count++;
        return acc;
      }, {});

      return Object.values(pageCounts || {})
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching most visited pages:', error);
      return [];
    }
  }

  static async getMostCommonActions(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('user_actions')
        .select('action_type')
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      // Count actions
      const actionCounts = data?.reduce((acc: any, action) => {
        const key = action.action_type;
        if (!acc[key]) {
          acc[key] = { type: action.action_type, count: 0 };
        }
        acc[key].count++;
        return acc;
      }, {});

      return Object.values(actionCounts || {})
        .sort((a: any, b: any) => b.count - a.count)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching most common actions:', error);
      return [];
    }
  }
}
