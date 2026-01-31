import { Link } from 'react-router-dom';
import type { Post } from '../types';

interface PostCardProps {
  post: Post;
  onUpvote: (id: string) => void;
  onDownvote: (id: string) => void;
  isLoggedIn: boolean;
  commentsLabel?: string;
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function PostCard({ post, onUpvote, onDownvote, isLoggedIn, commentsLabel = 'comments' }: PostCardProps) {
  return (
    <div className="bg-gray-800 rounded p-4 border border-gray-700 flex gap-4">
      {/* 投票 */}
      <div className="flex flex-col items-center text-gray-400">
        <button
          onClick={() => onUpvote(post.id)}
          disabled={!isLoggedIn}
          className={`hover:text-orange-500 disabled:opacity-50 ${
            post.user_vote === 'up' ? 'text-orange-500' : ''
          }`}
        >
          ▲
        </button>
        <span className={`font-bold ${
          post.score > 0 ? 'text-orange-500' : post.score < 0 ? 'text-blue-500' : 'text-gray-400'
        }`}>
          {post.score}
        </span>
        <button
          onClick={() => onDownvote(post.id)}
          disabled={!isLoggedIn}
          className={`hover:text-blue-500 disabled:opacity-50 ${
            post.user_vote === 'down' ? 'text-blue-500' : ''
          }`}
        >
          ▼
        </button>
      </div>
      
      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-400">
          <Link to={`/community/${post.submolt.name}`} className="text-blue-400 hover:underline">
            m/{post.submolt.name}
          </Link>
          {' • Posted by '}
          <Link to={`/user/${post.author.name}`} className="text-blue-400 hover:underline">
            u/{post.author.name}
          </Link>
          {' '}
          {timeAgo(post.created_at)}
        </div>
        
        <Link to={`/post/${post.id}`} className="block mt-1">
          <h2 className="text-lg font-medium text-gray-100 hover:text-blue-400">
            {post.title}
          </h2>
        </Link>
        
        <div className="text-sm text-gray-500 mt-2">
          💬 {post.comment_count} {commentsLabel}
        </div>
      </div>
    </div>
  );
}
