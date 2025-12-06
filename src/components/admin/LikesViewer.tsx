import { useState, useEffect } from 'react';
import { Heart, User, UserX, Calendar, Monitor } from 'lucide-react';
import { getAllLikes, getLikeStats } from '../../services/likesService';

interface Like {
  id: string;
  session_id: string;
  user_id: string | null;
  user_name: string | null;
  user_email: string | null;
  is_anonymous: boolean;
  liked_at: string;
  device_info: any;
}

export default function LikesViewer() {
  const [likes, setLikes] = useState<Like[]>([]);
  const [stats, setStats] = useState({ total: 0, authenticated: 0, anonymous: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    setLoading(true);
    try {
      const [likesData, statsData] = await Promise.all([
        getAllLikes(),
        getLikeStats(),
      ]);
      setLikes(likesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    // Ensure the timestamp is treated as UTC by appending 'Z' if not present
    const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
    const date = new Date(utcString);
    
    // Format: Dec 6, 2025, 4:30 PM (in Indian timezone)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getBrowserInfo = (deviceInfo: any): string => {
    if (!deviceInfo?.userAgent) return 'Unknown';
    const ua = deviceInfo.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <p className="text-pink-100 text-sm font-medium">Total Likes</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <User className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.authenticated}</span>
          </div>
          <p className="text-indigo-100 text-sm font-medium">Logged In Users</p>
        </div>

        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <UserX className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.anonymous}</span>
          </div>
          <p className="text-gray-100 text-sm font-medium">Anonymous Users</p>
        </div>
      </div>

      {/* Likes List */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-pink-100 rounded-xl">
            <Heart className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent Likes</h2>
            <p className="text-gray-500 text-sm">People who liked your website</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading likes...</p>
          </div>
        ) : likes.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No likes yet. Keep sharing your website!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {likes.map((like) => (
              <div
                key={like.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-pink-300 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* User Icon */}
                    <div className={`p-2 rounded-lg ${
                      like.is_anonymous ? 'bg-gray-200' : 'bg-indigo-100'
                    }`}>
                      {like.is_anonymous ? (
                        <UserX className="w-5 h-5 text-gray-600" />
                      ) : (
                        <User className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {like.user_name || 'Anonymous User'}
                      </h4>
                      {like.user_email && (
                        <p className="text-sm text-gray-600 truncate">{like.user_email}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(like.liked_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          {getBrowserInfo(like.device_info)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Like Badge */}
                  <div className="ml-4">
                    <Heart className="w-6 h-6 fill-pink-500 text-pink-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
