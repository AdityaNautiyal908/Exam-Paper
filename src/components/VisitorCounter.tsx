import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft text-sm text-gray-600">
        <Users className="w-4 h-4 text-lavender-500" />
        <span>Loading...</span>
      </div>
    );
  }

  if (count === null) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft text-sm text-gray-600">
      <Users className="w-4 h-4 text-lavender-500" />
      <span>
        <span className="font-semibold text-gray-800">{count.toLocaleString()}</span> visits
      </span>
    </div>
  );
}
