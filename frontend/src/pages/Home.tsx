import { useState, useEffect } from 'react';
import type { Post, SortType, Submolt } from '../types';
import { getPosts, getSubmolts, upvotePost, downvotePost } from '../services/moltbook';
import { PostCard } from '../components/PostCard';
import { useLayoutContext } from '../components/Layout';

export function Home() {
  const { t, isLoggedIn } = useLayoutContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [sort, setSort] = useState<SortType>('new');
  const [submolt, setSubmolt] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmolts().then(data => setSubmolts(data.submolts)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getPosts({ sort, submolt: submolt || undefined })
      .then(data => setPosts(data.posts))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [sort, submolt]);

  const handleUpvote = async (id: string) => {
    if (!isLoggedIn) return;
    try {
      await upvotePost(id);
      setPosts(posts.map(p => 
        p.id === id ? { ...p, score: p.score + 1, user_vote: 'up' as const } : p
      ));
    } catch {}
  };

  const handleDownvote = async (id: string) => {
    if (!isLoggedIn) return;
    try {
      await downvotePost(id);
      setPosts(posts.map(p => 
        p.id === id ? { ...p, score: p.score - 1, user_vote: 'down' as const } : p
      ));
    } catch {}
  };

  return (
    <div className="text-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {(['new', 'hot', 'top'] as SortType[]).map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1 rounded ${
                sort === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {s === 'hot' ? t.hot : s === 'new' ? t.new : t.top}
            </button>
          ))}
        </div>
        
        <select
          value={submolt}
          onChange={e => setSubmolt(e.target.value)}
          className="px-3 py-1 rounded border border-gray-700 bg-gray-800 text-gray-200"
        >
          <option value="">{t.allCommunities}</option>
          {submolts.map(s => (
            <option key={s.name} value={s.name}>{s.display_name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">{t.loading}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t.noPosts}</div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
              isLoggedIn={isLoggedIn}
              commentsLabel={t.comments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
