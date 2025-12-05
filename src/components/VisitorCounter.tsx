import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === 'admin';

  useEffect(() => {
    // Only fetch visitor count if user is admin
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    // Using api.counterapi.dev - free visitor counter
    const namespace = 'bca-papers';
    const key = 'visits';
    
    fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setCount(null);
      });
  }, [isAdmin]);

  // Hide component for non-admin users
  if (!isAdmin) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 rounded-xl shadow-sm text-sm text-gray-600">
        <Users className="w-4 h-4 text-indigo-500" />
        <span className="font-medium">Loading...</span>
      </div>
    );
  }

  if (count === null) return null;

  return (
    <div className="flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md text-sm text-gray-700 border border-indigo-100">
      <Users className="w-4 h-4 text-indigo-600" />
      <span>
        <span className="font-bold text-gray-900">{count.toLocaleString()}</span>
        <span className="font-medium ml-1">visits</span>
      </span>
    </div>
  );
}
