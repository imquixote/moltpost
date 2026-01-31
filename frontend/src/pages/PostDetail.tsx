import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Post, Comment } from '../types';
import { getPost, upvotePost, downvotePost, createComment, upvoteComment } from '../services/moltbook';
import { useLayoutContext } from '../components/Layout';
import { CommentItem } from '../components/CommentItem';

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

// 从平铺的评论列表构建嵌套树形结构
function buildCommentTree(comments: Comment[]): Comment[] {
  const commentMap = new Map<string, Comment>();
  const rootComments: Comment[] = [];
  
  // 首先创建所有评论的映射，并初始化 replies 数组
  comments.forEach(comment => {
    commentMap.set(comment.id, { ...comment, replies: [] });
  });
  
  // 然后构建树形结构
  comments.forEach(comment => {
    const commentWithReplies = commentMap.get(comment.id)!;
    if (comment.parent_id && commentMap.has(comment.parent_id)) {
      // 有父评论，添加到父评论的 replies 中
      const parent = commentMap.get(comment.parent_id)!;
      parent.replies = parent.replies || [];
      parent.replies.push(commentWithReplies);
    } else {
      // 没有父评论或父评论不存在，作为顶级评论
      rootComments.push(commentWithReplies);
    }
  });
  
  return rootComments;
}

// 递归计算评论总数（包括所有嵌套回复）
function countAllComments(comments: Comment[]): number {
  let count = 0;
  for (const comment of comments) {
    count += 1;
    if (comment.replies && comment.replies.length > 0) {
      count += countAllComments(comment.replies);
    }
  }
  return count;
}

// 递归更新评论（用于投票等操作）
function updateCommentInTree(comments: Comment[], id: string, updater: (c: Comment) => Comment): Comment[] {
  return comments.map(comment => {
    if (comment.id === id) {
      return updater(comment);
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: updateCommentInTree(comment.replies, id, updater)
      };
    }
    return comment;
  });
}

// 递归添加回复到指定评论
function addReplyToComment(comments: Comment[], parentId: string, newReply: Comment): Comment[] {
  return comments.map(comment => {
    if (comment.id === parentId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), newReply]
      };
    }
    if (comment.replies && comment.replies.length > 0) {
      return {
        ...comment,
        replies: addReplyToComment(comment.replies, parentId, newReply)
      };
    }
    return comment;
  });
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
        
        const comments = data.comments || [];
        
        // 检查第一个评论是否有非空的 replies 数组
        const hasNestedReplies = comments.some(c => c.replies && c.replies.length > 0);
        
        let nestedComments: Comment[];
        if (hasNestedReplies) {
          // API 返回的已经是嵌套结构，只取顶级评论
          nestedComments = comments.filter(c => !c.parent_id);
        } else {
          // 平铺结构，需要构建嵌套
          nestedComments = buildCommentTree(comments);
        }
        
        // 按时间正序排列顶级评论（最早的在前面，和 Moltbook 一致）
        const sortedComments = nestedComments.sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
      const updater = (c: Comment) => ({ ...c, score: (c.score ?? 0) + 1, user_vote: 'up' as const });
      setAllComments(updateCommentInTree(allComments, commentId, updater));
      setDisplayedComments(updateCommentInTree(displayedComments, commentId, updater));
    } catch {}
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!id || !isLoggedIn) return;
    
    const data = await createComment(id, content, parentId);
    if (data?.comment) {
      const newReply = { ...data.comment, replies: [] };
      setAllComments(addReplyToComment(allComments, parentId, newReply));
      setDisplayedComments(addReplyToComment(displayedComments, parentId, newReply));
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.trim() || !isLoggedIn) return;
    
    setSubmitting(true);
    try {
      const data = await createComment(id, newComment.trim());
      if (data?.comment) {
        const newCommentWithReplies = { ...data.comment, replies: [] };
        setAllComments([newCommentWithReplies, ...allComments]);
        setDisplayedComments([newCommentWithReplies, ...displayedComments]);
        setNewComment('');
      }
    } catch (err) {
      console.error('Failed to submit comment:', err);
    }
    setSubmitting(false);
  };

  const totalComments = countAllComments(allComments);

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
              <Link to={`/user/${post.author.name}`} className="text-blue-400 hover:underline">
                u/{post.author.name}
              </Link>
              {' '}
              {timeAgo(post.created_at)}
            </div>
            <h1 className="text-xl font-bold text-gray-100 mt-1">{post.title}</h1>
            <p className="text-gray-300 mt-3 whitespace-pre-wrap">{post.content}</p>
            <div className="text-sm text-gray-500 mt-3">
              💬 {post.comment_count} {t.comments}
            </div>
          </div>
        </div>
      </div>

      {/* 评论区 */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4">{t.comments} ({totalComments})</h2>
        
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
                  <CommentItem
                    comment={comment}
                    onUpvote={handleCommentUpvote}
                    onReply={handleReply}
                    isLoggedIn={isLoggedIn}
                    t={{ reply: t.reply, cancel: t.cancel, submitting: t.submitting }}
                  />
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
