import { useState } from 'react';
import { UserSession } from '../../services/analyticsService';
import { User, UserX } from 'lucide-react';

interface UserManagementTableProps {
  users: UserSession[];
  onViewDetails: (sessionId: string) => void;
}

export default function UserManagementTable({ users, onViewDetails }: UserManagementTableProps) {
  const [sortBy, setSortBy] = useState<'lastVisit' | 'totalVisits' | 'firstVisit'>('lastVisit');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const sortedUsers = [...users].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'lastVisit':
        comparison = new Date(a.last_visit).getTime() - new Date(b.last_visit).getTime();
        break;
      case 'firstVisit':
        comparison = new Date(a.first_visit).getTime() - new Date(b.first_visit).getTime();
        break;
      case 'totalVisits':
        comparison = a.total_visits - b.total_visits;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">All Users</h2>
        <p className="text-sm text-gray-600 mt-1">Manage and view user activity</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                onClick={() => {
                  if (sortBy === 'firstVisit') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('firstVisit');
                    setSortOrder('desc');
                  }
                }}
              >
                First Visit {sortBy === 'firstVisit' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                onClick={() => {
                  if (sortBy === 'lastVisit') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('lastVisit');
                    setSortOrder('desc');
                  }
                }}
              >
                Last Visit {sortBy === 'lastVisit' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:text-gray-900"
                onClick={() => {
                  if (sortBy === 'totalVisits') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('totalVisits');
                    setSortOrder('desc');
                  }
                }}
              >
                Total Visits {sortBy === 'totalVisits' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedUsers.map((user) => (
              <tr key={user.session_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {user.user_photo ? (
                        <img
                          src={user.user_photo}
                          alt={user.user_name || 'User'}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          user.is_anonymous ? 'bg-gray-200' : 'bg-blue-100'
                        }`}>
                          {user.is_anonymous ? (
                            <UserX className="h-5 w-5 text-gray-600" />
                          ) : (
                            <User className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.user_name || 'Anonymous'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.user_email || ''}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_anonymous 
                      ? 'bg-gray-100 text-gray-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.is_anonymous ? 'Anonymous' : 'Logged In'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateTime(user.first_visit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateTime(user.last_visit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {user.total_visits}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onViewDetails(user.session_id)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}
