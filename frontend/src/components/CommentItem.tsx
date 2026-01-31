import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Comment } from '../types';

interface CommentItemProps {
  comment: Comment;
  onUpvote: (id: string) => void;
  onReply: (parentId: string, content: string) => Promise<void>;
  isLoggedIn: boolean;
  depth?: number;
  t: {
    reply: string;
    cancel: string;
    submitting: string;
  };
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

export function CommentItem({ comment, onUpvote, onReply, isLoggedIn, depth = 0, t }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const authorName = comment.author?.name || 'Anonymous';
  const score = comment.score ?? (comment.upvotes ?? 0) - (comment.downvotes ?? 0);
  const hasReplies = comment.replies && comment.replies.length > 0;

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);
    } catch (err) {
      console.error('Failed to submit reply:', err);
    }
    setSubmitting(false);
  };

  return (
    <div className={depth > 0 ? 'ml-6 border-l-2 border-gray-700 pl-4' : ''}>
      <div className="py-3">
        {/* 用户名和时间 */}
        <div className="text-sm mb-1">
          <Link to={`/user/${authorName}`} className="text-blue-400 hover:underline">
            u/{authorName}
          </Link>
          <span className="text-gray-500"> • {timeAgo(comment.created_at)}</span>
        </div>
        
        {/* 评论内容 */}
        <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
        
        {/* 操作栏 */}
        <div className="flex items-center gap-4 mt-2 text-sm">
          {/* 投票 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onUpvote(comment.id)}
              disabled={!isLoggedIn}
              className={`hover:text-orange-500 disabled:opacity-50 ${
                comment.user_vote === 'up' ? 'text-orange-500' : 'text-gray-500'
              }`}
            >
              ▲
            </button>
            <span className={`${
              score > 0 ? 'text-orange-500' : 
              score < 0 ? 'text-blue-500' : 'text-gray-500'
            }`}>
              {score}
            </span>
            <span className="text-gray-500">▼</span>
          </div>
          
          {/* 回复按钮 */}
          {isLoggedIn && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-gray-500 hover:text-blue-400"
            >
              {t.reply}
            </button>
          )}
        </div>

        {/* 回复表单 */}
        {showReplyForm && (
          <div className="mt-3">
            <textarea
              value={replyContent}
              onChange={e => setReplyContent(e.target.value)}
              placeholder={`Reply to ${authorName}...`}
              className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-gray-200 placeholder-gray-500 resize-none text-sm"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSubmitReply}
                disabled={submitting || !replyContent.trim()}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? t.submitting : t.reply}
              </button>
              <button
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyContent('');
                }}
                className="px-3 py-1 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 递归渲染子评论 */}
      {hasReplies && (
        <div>
          {comment.replies!.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onUpvote={onUpvote}
              onReply={onReply}
              isLoggedIn={isLoggedIn}
              depth={depth + 1}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  );
}
