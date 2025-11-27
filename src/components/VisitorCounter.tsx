import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Using countapi.xyz - free visitor counter
    const namespace = 'bca-papers-site';
    const key = 'visits';
    
    fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.value);
      })
      .catch(() => {
        // Fallback if API fails
        setCount(null);
      });
  }, []);

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

