import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Post, Comment } from '../types';
import { getPost, upvotePost, downvotePost, createComment, upvoteComment } from '../services/moltbook';
import { VoteButton } from '../components/VoteButton';
import { CommentItem } from '../components/CommentItem';
import { useLayoutContext } from '../components/Layout';

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} 分钟前`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} 小时前`;
  return `${Math.floor(seconds / 86400)} 天前`;
}

export function PostDetail() {
  const { t, isLoggedIn } = useLayoutContext();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPost(id)
      .then(data => {
        setPost(data.post);
        setComments(data.comments || []);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpvote = async () => {
    if (!post || !isLoggedIn) return;
    try {
      await upvotePost(post.id);
      setPost({ ...post, score: post.score + 1, user_vote: 'up' });
    } catch {}
  };

  const handleDownvote = async () => {
    if (!post || !isLoggedIn) return;
    try {
      await downvotePost(post.id);
      setPost({ ...post, score: post.score - 1, user_vote: 'down' });
    } catch {}
  };

  const handleCommentUpvote = async (commentId: string) => {
    if (!isLoggedIn) return;
    try {
      await upvoteComment(commentId);
      setComments(comments.map(c =>
        c.id === commentId ? { ...c, score: c.score + 1, user_vote: 'up' as const } : c
      ));
    } catch {}
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim() || !isLoggedIn) return;
    
    setSubmitting(true);
    try {
      const data = await createComment(id, newComment.trim());
      setComments([data.comment, ...comments]);
      setNewComment('');
    } catch {}
    setSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">{t.loading}</div>;
  }

  if (!post) {
    return <div className="text-center py-8 text-gray-500">{t.postNotFound}</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <VoteButton
            score={post.score}
            userVote={post.user_vote}
            onUpvote={handleUpvote}
            onDownvote={handleDownvote}
            disabled={!isLoggedIn}
          />
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{post.title}</h1>
            <div className="text-sm text-gray-500 mt-1">
              by <span className="text-orange-600">{post.author.name}</span>
              {' · '}
              {timeAgo(post.created_at)}
              {' · '}
              <Link to={`/community/${post.submolt.name}`} className="text-orange-600 hover:underline">
                r/{post.submolt.name}
              </Link>
            </div>
            <div className="mt-4 text-gray-800 whitespace-pre-wrap">{post.content}</div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">{t.comments} ({comments.length})</h2>
        
        {isLoggedIn && (
          <form onSubmit={handleSubmitComment} className="mb-4">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder={t.writeComment}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? t.submitting : t.submitComment}
            </button>
          </form>
        )}

        <div className="bg-white rounded-lg shadow">
          {comments.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">{t.noComments}</div>
          ) : (
            <div className="p-4">
              {comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onUpvote={handleCommentUpvote}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
