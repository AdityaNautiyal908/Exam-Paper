import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalyticsService } from '../../services/analyticsService';
import { Users, Eye, MousePointerClick, Clock, UserCheck, UserX, ArrowLeft } from 'lucide-react';

interface AnalyticsOverview {
  totalSessions: number;
  totalPageViews: number;
  totalActions: number;
  anonymousUsers: number;
  loggedInUsers: number;
  avgSessionDuration: number;
}

export default function AnalyticsDashboard() {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'anonymous' | 'logged-in'>('all');
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [filter]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewData, sessionsData] = await Promise.all([
        AnalyticsService.getAnalyticsOverview(),
        AnalyticsService.getAllSessions({
          isAnonymous: filter === 'anonymous' ? true : filter === 'logged-in' ? false : undefined,
          limit: 50,
        }),
      ]);

      setOverview(overviewData);
      setSessions(sessionsData.data || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionDetails = async (sessionId: string) => {
    const details = await AnalyticsService.getSessionDetails(sessionId);
    setSessionDetails(details);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    // Ensure the timestamp is treated as UTC by appending 'Z' if not present
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcString);
    
    // Format: 12/05/2025, 3:46:33 PM (in local timezone)
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  if (loading && !overview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Admin</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Total Sessions</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.totalSessions}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Eye className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Page Views</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.totalPageViews}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <MousePointerClick className="w-4 h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Actions</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.totalActions}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <UserX className="w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Anonymous</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.anonymousUsers}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <UserCheck className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Logged In</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.loggedInUsers}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Avg Duration</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{formatDuration(overview.avgSessionDuration)}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setFilter('anonymous')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'anonymous'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Anonymous Only
          </button>
          <button
            onClick={() => setFilter('logged-in')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'logged-in'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Logged In Only
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr
                  key={session.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedSession(session);
                    loadSessionDetails(session.session_id);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {session.user_photo ? (
                        <img
                          src={session.user_photo}
                          alt={session.user_name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {session.user_name || 'Anonymous'}
                        </div>
                        {session.user_email && (
                          <div className="text-xs text-gray-500">{session.user_email}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        session.is_anonymous
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {session.is_anonymous ? 'Anonymous' : 'Logged In'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(session.first_visit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(session.last_visit)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {session.total_visits}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(session.total_time_spent || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No sessions found for the selected filter.
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && sessionDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setSelectedSession(null);
            setSessionDetails(null);
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Session Details</h2>
              <p className="text-sm text-gray-500 mt-1">
                Session ID: {selectedSession.session_id}
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* User Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSession.user_name || 'Anonymous'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSession.user_email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Total Visits:</span>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedSession.total_visits}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Total Time:</span>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDuration(selectedSession.total_time_spent || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Page Views */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Page Views</h3>
                <div className="space-y-2">
                  {sessionDetails.pageViews.map((view: any) => (
                    <div
                      key={view.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{view.page_path}</p>
                        <p className="text-xs text-gray-500">{formatDate(view.timestamp)}</p>
                      </div>
                      <span className="text-sm text-gray-600">
                        {formatDuration(view.time_spent)}
                      </span>
                    </div>
                  ))}
                  {sessionDetails.pageViews.length === 0 && (
                    <p className="text-sm text-gray-500">No page views recorded</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Actions</h3>
                <div className="space-y-2">
                  {sessionDetails.actions.map((action: any) => (
                    <div
                      key={action.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.action_type}</p>
                        <p className="text-xs text-gray-500">{formatDate(action.timestamp)}</p>
                      </div>
                      {action.action_data && (
                        <span className="text-xs text-gray-600">
                          {JSON.stringify(action.action_data)}
                        </span>
                      )}
                    </div>
                  ))}
                  {sessionDetails.actions.length === 0 && (
                    <p className="text-sm text-gray-500">No actions recorded</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelectedSession(null);
                  setSessionDetails(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
