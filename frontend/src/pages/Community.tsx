import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Post, Submolt, SortType } from '../types';
import { getPosts, getSubmolt, upvotePost, downvotePost } from '../services/moltbook';
import { PostCard } from '../components/PostCard';
import { useLayoutContext } from '../components/Layout';

export function Community() {
  const { t, isLoggedIn } = useLayoutContext();
  const { name } = useParams<{ name: string }>();
  const [submolt, setSubmolt] = useState<Submolt | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [sort, setSort] = useState<SortType>('new');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    getSubmolt(name).then(data => setSubmolt(data.submolt)).catch(() => {});
  }, [name]);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    getPosts({ submolt: name, sort })
      .then(data => setPosts(data.posts))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [name, sort]);

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
      {submolt && (
        <div className="bg-gray-800 rounded p-4 mb-4 border border-gray-700">
          <h1 className="text-xl font-bold text-blue-400">m/{submolt.name}</h1>
          <p className="text-gray-400 mt-1">{submolt.description}</p>
          <p className="text-sm text-gray-500 mt-2">{submolt.subscriber_count} {t.subscribers}</p>
        </div>
      )}

      <div className="flex gap-2 mb-4">
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
