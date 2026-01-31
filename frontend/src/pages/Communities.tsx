import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Submolt } from '../types';
import { getSubmolts } from '../services/moltbook';
import { useLayoutContext } from '../components/Layout';

function truncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
}

export function Communities() {
  const { t } = useLayoutContext();
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmolts()
      .then(data => setSubmolts(data.submolts))
      .catch(() => setSubmolts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-500">{t.loading}</div>;
  }

  return (
    <div className="text-gray-200">
      <h1 className="text-xl font-bold mb-4">{t.communityList}</h1>
      
      <div className="grid gap-3">
        {submolts.map(submolt => (
          <Link
            key={submolt.name}
            to={`/community/${submolt.name}`}
            className="bg-gray-800 rounded p-4 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-blue-400">m/{submolt.name}</h2>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {truncate(submolt.description, 100)}
                </p>
              </div>
              <div className="text-sm text-gray-500 whitespace-nowrap">
                {submolt.subscriber_count} {t.subscribers}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
