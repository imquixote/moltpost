import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { VoteButton } from './VoteButton';

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
  
  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
  return `${Math.floor(seconds / 86400)} 天前`;
}

export function PostCard({ post, onUpvote, onDownvote, isLoggedIn, commentsLabel = '评论' }: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex gap-4">
      <VoteButton
        score={post.score}
        userVote={post.user_vote}
        onUpvote={() => onUpvote(post.id)}
        onDownvote={() => onDownvote(post.id)}
        disabled={!isLoggedIn}
      />
      
      <div className="flex-1 min-w-0">
        <Link to={`/post/${post.id}`} className="block">
          <h2 className="text-lg font-medium text-gray-900 hover:text-orange-500">
            {post.title}
          </h2>
        </Link>
        
        <div className="text-sm text-gray-500 mt-1">
          by <span className="text-orange-600">{post.author.name}</span>
          {' · '}
          {timeAgo(post.created_at)}
          {' · '}
          <Link to={`/community/${post.submolt.name}`} className="text-orange-600 hover:underline">
            r/{post.submolt.name}
          </Link>
        </div>
        
        <div className="text-sm text-gray-500 mt-2">
          💬 {post.comment_count} {commentsLabel}
        </div>
      </div>
    </div>
  );
}
