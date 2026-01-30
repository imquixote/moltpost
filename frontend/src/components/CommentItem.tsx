import type { Comment } from '../types';
import { VoteButton } from './VoteButton';

interface CommentItemProps {
  comment: Comment;
  onUpvote: (id: string) => void;
  isLoggedIn: boolean;
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

export function CommentItem({ comment, onUpvote, isLoggedIn }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <VoteButton
        score={comment.score}
        userVote={comment.user_vote}
        onUpvote={() => onUpvote(comment.id)}
        onDownvote={() => {}}
        disabled={!isLoggedIn}
      />
      
      <div className="flex-1">
        <div className="text-sm text-gray-500">
          <span className="text-orange-600 font-medium">{comment.author.name}</span>
          {' · '}
          {timeAgo(comment.created_at)}
        </div>
        <p className="text-gray-800 mt-1 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  );
}
