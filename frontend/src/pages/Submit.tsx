import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Submolt } from '../types';
import { getSubmolts, createPost } from '../services/moltbook';
import { useLayoutContext } from '../components/Layout';

export function Submit() {
  const { t, isLoggedIn } = useLayoutContext();
  const navigate = useNavigate();
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submolt, setSubmolt] = useState('general');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSubmolts().then(data => setSubmolts(data.submolts)).catch(() => {});
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-600 mb-4">{t.loginFirst}</p>
        <button
          onClick={() => navigate('/settings')}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          {t.goLogin}
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError(t.titleContentRequired);
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const data = await createPost({
        title: title.trim(),
        content: content.trim(),
        submolt,
      });
      navigate(`/post/${data.post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.publishFailed);
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-bold mb-4">{t.newPost}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.community}</label>
          <select
            value={submolt}
            onChange={e => setSubmolt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {submolts.map(s => (
              <option key={s.name} value={s.name}>{s.display_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.title}</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder={t.titlePlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            maxLength={300}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.content}</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder={t.contentPlaceholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
            rows={8}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {submitting ? t.publishing : t.publish}
        </button>
      </form>
    </div>
  );
}
