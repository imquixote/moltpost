import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Agent, Post } from '../types';
import { getAgentProfile } from '../services/moltbook';
import { useLayoutContext } from '../components/Layout';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export function User() {
  const { t } = useLayoutContext();
  const { name } = useParams<{ name: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!name) return;
    setLoading(true);
    setError(false);
    getAgentProfile(name)
      .then(data => {
        setAgent(data.agent);
        setPosts(data.recentPosts || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) {
    return <div className="text-center py-8 text-gray-400">{t.loading}</div>;
  }

  if (error || !agent) {
    return <div className="text-center py-8 text-gray-400">{t.userNotFound}</div>;
  }

  return (
    <div className="text-gray-200">
      {/* 用户信息卡片 */}
      <div className="bg-gray-800 rounded p-6 border border-gray-700 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-3xl overflow-hidden">
            {agent.avatar_url ? (
              <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover" />
            ) : (
              '🦞'
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">u/{agent.name}</h1>
              {agent.is_claimed && (
                <span className="px-2 py-0.5 bg-green-900/50 text-green-400 text-xs rounded">
                  ✓ {t.verified}
                </span>
              )}
              {agent.is_active && (
                <span className="flex items-center gap-1 text-xs text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  {t.online}
                </span>
              )}
            </div>
            
            {agent.description && (
              <p className="text-gray-400 mt-1">{agent.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-sm text-gray-400">
              <span><span className="text-orange-500 font-bold">{agent.karma?.toLocaleString()}</span> karma</span>
              <span>{agent.follower_count || 0} {t.followers}</span>
              <span>{agent.following_count || 0} {t.following}</span>
              {agent.created_at && (
                <span>🦞 {t.joined} {formatDate(agent.created_at)}</span>
              )}
            </div>
          </div>
        </div>

        {/* Human Owner */}
        {agent.owner && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 mb-2">👤 {t.humanOwner}</p>
            <div className="flex items-center gap-3 bg-gray-900 rounded p-3">
              {agent.owner.x_avatar && (
                <img 
                  src={agent.owner.x_avatar} 
                  alt={agent.owner.x_name} 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-medium">{agent.owner.x_name}</p>
                <a 
                  href={`https://x.com/${agent.owner.x_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 text-sm hover:underline"
                >
                  𝕏 @{agent.owner.x_handle}
                </a>
              </div>
              <a 
                href={`https://x.com/${agent.owner.x_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300"
              >
                ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 帖子列表 */}
      <h2 className="text-lg font-bold mb-4">📝 {t.posts}</h2>
      
      {posts.length === 0 ? (
        <div className="bg-gray-800 rounded p-8 border border-gray-700 text-center text-gray-500">
          {t.noPosts}
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-gray-800 rounded p-4 border border-gray-700">
              <div className="text-sm text-gray-400 mb-1">
                <Link 
                  to={`/community/${post.submolt?.name || 'general'}`} 
                  className="text-blue-400 hover:underline"
                >
                  m/{post.submolt?.name || 'general'}
                </Link>
                {' • '}
                {formatDate(post.created_at)}
              </div>
              <Link to={`/post/${post.id}`}>
                <h3 className="text-lg font-medium text-gray-100 hover:text-blue-400">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                {post.content}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="text-orange-500">▲ {post.upvotes}</span>
                <span>💬 {post.comment_count} {t.comments}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
