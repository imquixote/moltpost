import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Post, Comment } from '../types';
import { getPost, upvotePost, downvotePost, createComment, upvoteComment } from '../services/moltbook';
import { useLayoutContext } from '../components/Layout';

const COMMENTS_PER_PAGE = 20;

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function PostDetail() {
  const { t, isLoggedIn } = useLayoutContext();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [displayedComments, setDisplayedComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getPost(id)
      .then(data => {
        setPost(data.post);
        const sortedComments = (data.comments || []).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setAllComments(sortedComments);
        setDisplayedComments(sortedComments.slice(0, COMMENTS_PER_PAGE));
        setHasMore(sortedComments.length > COMMENTS_PER_PAGE);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    
    setTimeout(() => {
      const currentLength = displayedComments.length;
      const nextComments = allComments.slice(currentLength, currentLength + COMMENTS_PER_PAGE);
      setDisplayedComments(prev => [...prev, ...nextComments]);
      setHasMore(currentLength + nextComments.length < allComments.length);
      setLoadingMore(false);
    }, 100);
  }, [loadingMore, hasMore, displayedComments.length, allComments]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMore]);

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
      const updateComment = (c: Comment) =>
        c.id === commentId ? { ...c, score: (c.score ?? 0) + 1, user_vote: 'up' as const } : c;
      setAllComments(allComments.map(updateComment));
      setDisplayedComments(displayedComments.map(updateComment));
    } catch {}
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim() || !isLoggedIn) return;
    
    setSubmitting(true);
    try {
      const data = await createComment(id, newComment.trim());
      if (data?.comment) {
        setAllComments([data.comment, ...allComments]);
        setDisplayedComments([data.comment, ...displayedComments]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
    setSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-400">{t.loading}</div>;
  }

  if (!post) {
    return <div className="text-center py-8 text-gray-400">{t.postNotFound}</div>;
  }

  return (
    <div className="text-gray-200">
      {/* 返回链接 */}
      <Link 
        to={`/community/${post.submolt.name}`} 
        className="text-blue-400 hover:underline mb-4 inline-block"
      >
        ← m/{post.submolt.name}
      </Link>

      {/* 帖子卡片 */}
      <div className="bg-gray-800 rounded p-4 border border-gray-700">
        <div className="flex gap-4">
          {/* 投票 */}
          <div className="flex flex-col items-center text-gray-400">
            <button
              onClick={handleUpvote}
              disabled={!isLoggedIn}
              className={`hover:text-orange-500 disabled:opacity-50 ${
                post.user_vote === 'up' ? 'text-orange-500' : ''
              }`}
            >
              ▲
            </button>
            <span className={`font-bold text-lg ${
              post.score > 0 ? 'text-orange-500' : post.score < 0 ? 'text-blue-500' : 'text-gray-400'
            }`}>
              {post.score}
            </span>
            <button
              onClick={handleDownvote}
              disabled={!isLoggedIn}
              className={`hover:text-blue-500 disabled:opacity-50 ${
                post.user_vote === 'down' ? 'text-blue-500' : ''
              }`}
            >
              ▼
            </button>
          </div>

          {/* 内容 */}
          <div className="flex-1">
            <div className="text-sm text-gray-400">
              <Link to={`/community/${post.submolt.name}`} className="text-blue-400 hover:underline">
                m/{post.submolt.name}
              </Link>
              {' • Posted by '}
              <span className="text-blue-400">u/{post.author.name}</span>
              {' '}
              {timeAgo(post.created_at)}
            </div>
            <h1 className="text-xl font-bold text-gray-100 mt-1">{post.title}</h1>
            <p className="text-gray-300 mt-3 whitespace-pre-wrap">{post.content}</p>
            <div className="text-sm text-gray-500 mt-3">
              💬 {post.comment_count} comments
            </div>
          </div>
        </div>
      </div>

      {/* 评论区 */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4">Comments ({allComments.length})</h2>
        
        {/* 评论输入框 */}
        {isLoggedIn && (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder={t.writeComment}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-200 placeholder-gray-500 resize-none"
              rows={3}
            />
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? t.submitting : t.submitComment}
            </button>
          </form>
        )}

        {/* 评论列表 */}
        <div className="bg-gray-800 rounded border border-gray-700">
          {displayedComments.length === 0 ? (
            <div className="p-4 text-gray-500 text-center">{t.noComments}</div>
          ) : (
            <div className="divide-y divide-gray-700">
              {displayedComments.map(comment => (
                <div key={comment.id} className="p-4">
                  {/* 用户名和时间 */}
                  <div className="text-sm mb-1">
                    <span className="text-blue-400">u/{comment.author?.name || 'Anonymous'}</span>
                    <span className="text-gray-500"> • {timeAgo(comment.created_at)}</span>
                  </div>
                  {/* 评论内容 */}
                  <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                  {/* 投票 */}
                  <div className="flex items-center gap-2 mt-2 text-sm">
                    <button
                      onClick={() => handleCommentUpvote(comment.id)}
                      disabled={!isLoggedIn}
                      className={`hover:text-orange-500 disabled:opacity-50 ${
                        comment.user_vote === 'up' ? 'text-orange-500' : 'text-gray-500'
                      }`}
                    >
                      ▲
                    </button>
                    <span className={`${
                      (comment.score ?? 0) > 0 ? 'text-orange-500' : 
                      (comment.score ?? 0) < 0 ? 'text-blue-500' : 'text-gray-500'
                    }`}>
                      {comment.score ?? 0}
                    </span>
                    <span className="text-gray-500">▼</span>
                  </div>
                </div>
              ))}
              
              {hasMore && (
                <div ref={loaderRef} className="py-4 text-center text-gray-500">
                  {loadingMore ? t.loading : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
