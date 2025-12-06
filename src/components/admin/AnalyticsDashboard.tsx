import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalyticsService } from '../../services/analyticsService';
import { Users, Eye, MousePointerClick, Clock, UserCheck, UserX, ArrowLeft, PieChart as PieChartIcon, Heart } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import LikesViewer from './LikesViewer';
import { getLikeStats } from '../../services/likesService';
import ScrollProgressBar from '../ScrollProgressBar';
import UserManagementTable from './UserManagementTable';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

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
  const [likeStats, setLikeStats] = useState({ total: 0, authenticated: 0, anonymous: 0 });
  
  useEffect(() => {
    loadAnalytics();
  }, [filter]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewData, sessionsData, likeStatsData] = await Promise.all([
        AnalyticsService.getAnalyticsOverview(),
        AnalyticsService.getAllSessions({
          isAnonymous: filter === 'anonymous' ? true : filter === 'logged-in' ? false : undefined,
          limit: 50,
        }),
        getLikeStats()
      ]);

      setOverview(overviewData);
      setSessions(sessionsData?.data || []);
      setLikeStats(likeStatsData);
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
    <>
      <ScrollProgressBar />
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
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Total Sessions</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.totalSessions}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Eye className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Page Views</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.totalPageViews}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <MousePointerClick className="w-4 h-4 md:w-5 md:h-5 text-purple-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Actions</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.totalActions}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <UserX className="w-4 h-4 md:w-5 md:h-5 text-gray-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Anonymous</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.anonymousUsers}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <UserCheck className="w-4 h-4 md:w-5 md:h-5 text-indigo-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Logged In</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{overview.loggedInUsers}</div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200">
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-600 flex-shrink-0" />
              <span className="text-xs md:text-sm text-gray-600 leading-tight">Avg Duration</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-gray-900">{formatDuration(overview.avgSessionDuration)}</div>
          </div>
        </div>
      )}


      {/* User Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-800">User Distribution</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 md:h-80">
            {overview && (
              <Pie 
                data={{
                  labels: ['Anonymous Users', 'Logged In Users'],
                  datasets: [{
                    data: [overview.anonymousUsers, overview.loggedInUsers],
                    backgroundColor: [
                      'rgba(99, 102, 241, 0.7)',
                      'rgba(79, 70, 229, 0.7)',
                    ],
                    borderColor: [
                      'rgba(99, 102, 241, 1)',
                      'rgba(79, 70, 229, 1)',
                    ],
                    borderWidth: 1,
                    hoverOffset: 10,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw as number || 0;
                          const data = context.dataset.data as number[];
                          const total = data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                }}
              />
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">User Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span className="text-sm text-gray-600">Anonymous Users</span>
                  </div>
                  <span className="text-sm font-medium">{overview?.anonymousUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                    <span className="text-sm text-gray-600">Logged In Users</span>
                  </div>
                  <span className="text-sm font-medium">{overview?.loggedInUsers || 0}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Users</span>
                    <span className="text-sm font-semibold">
                      {(overview?.anonymousUsers || 0) + (overview?.loggedInUsers || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-xs text-indigo-700">
                This chart shows the distribution between anonymous and logged-in users. Hover over the chart segments to see percentages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Like Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-semibold text-gray-800">Like Distribution</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-64 md:h-80">
            {overview && (
              <Pie 
                data={{
                  labels: ['Users Who Liked', 'Users Who Didn\'t Like'],
                  datasets: [{
                    data: [
                      likeStats.total,
                      Math.max(0, (overview.anonymousUsers + overview.loggedInUsers) - likeStats.total)
                    ],
                    backgroundColor: [
                      'rgba(236, 72, 153, 0.7)',  // Pink for liked
                      'rgba(156, 163, 175, 0.7)',  // Gray for didn't like
                    ],
                    borderColor: [
                      'rgba(236, 72, 153, 1)',
                      'rgba(156, 163, 175, 1)',
                    ],
                    borderWidth: 1,
                    hoverOffset: 10,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle',
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.raw as number || 0;
                          const data = context.dataset.data as number[];
                          const total = data.reduce((a: number, b: number) => a + b, 0);
                          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
                }}
              />
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Like Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span className="text-sm text-gray-600">Users Who Liked</span>
                  </div>
                  <span className="text-sm font-medium">{likeStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-sm text-gray-600">Users Who Didn't Like</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.max(0, (overview?.anonymousUsers || 0) + (overview?.loggedInUsers || 0) - likeStats.total)}
                  </span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Users</span>
                    <span className="text-sm font-semibold">
                      {(overview?.anonymousUsers || 0) + (overview?.loggedInUsers || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-pink-50 p-3 rounded-lg">
              <p className="text-xs text-pink-700">
                This chart shows how many users liked your website. Hover over the chart segments to see percentages.
              </p>
            </div>
          </div>
        </div>
      </div>

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
                <div className="space-y-3">
                  {sessionDetails.actions.map((action: any) => {
                    let actionData;
                    try {
                      actionData = typeof action.action_data === 'string' 
                        ? JSON.parse(action.action_data) 
                        : action.action_data || {};
                    } catch (e) {
                      actionData = { raw: action.action_data };
                    }

                    const getActionIcon = () => {
                      switch (action.action_type) {
                        case 'download_paper':
                          return (
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <img 
                                src="/logos/paper.png" 
                                alt="Download Paper" 
                                className="h-5 w-5 object-contain"
                              />
                            </div>
                          );
                        case 'download_note':
                          return (
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <img 
                                src="/logos/note.png" 
                                alt="Download Note" 
                                className="h-5 w-5 object-contain"
                              />
                            </div>
                          );
                        case 'view_paper':
                          return (
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          );
                        default:
                          return (
                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          );
                      }
                    };

                    const renderActionData = () => {
                      if (!actionData || Object.keys(actionData).length === 0) return null;
                      
                      return (
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                          {Object.entries(actionData).map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="font-medium text-gray-700 w-24 flex-shrink-0">
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className="text-gray-900 break-all">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    };

                    return (
                      <div
                        key={action.id}
                        className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start gap-3">
                          {getActionIcon()}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900 capitalize">
                                {action.action_type.replace(/_/g, ' ')}
                              </h4>
                              <span className="text-xs text-gray-500">
                                {formatDate(action.timestamp)}
                              </span>
                            </div>
                            {renderActionData()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {sessionDetails.actions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p>No actions recorded for this session</p>
                    </div>
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

      {/* User Management Table */}
      <div className="mt-8">
        <UserManagementTable 
          users={sessions}
          onViewDetails={(sessionId) => {
            setSelectedSession(sessionId);
            loadSessionDetails(sessionId);
          }}
        />
      </div>

      {/* Likes Section */}
      <div className="mt-8">
        <LikesViewer />
      </div>
    </div>
    </>
  );
}
