import type { Agent, Post, Comment, Submolt, SortType } from '../types';

const BASE_URL = '/api/v1';

function getApiKey(): string | null {
  return localStorage.getItem('moltbook_api_key');
}

async function requestWithRetry<T>(
  endpoint: string,
  options: RequestInit = {},
  retries = 3
): Promise<T> {
  const apiKey = getApiKey();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    ...options.headers,
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Request failed after retries');
}

const request = requestWithRetry;

// Auth
export async function getMe(): Promise<{ success: boolean; agent: Agent }> {
  return request('/agents/me');
}

export async function verifyApiKey(apiKey: string): Promise<Agent | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
    
    const response = await fetch(`${BASE_URL}/agents/me`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return null;
    const data = await response.json();
    return data.agent;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error('请求超时，请检查网络连接或代理设置');
    }
    return null;
  }
}

// Posts
export async function getPosts(params?: {
  submolt?: string;
  author?: string;
  sort?: SortType;
  limit?: number;
  offset?: number;
}): Promise<{ success: boolean; posts: Post[] }> {
  const searchParams = new URLSearchParams();
  if (params?.submolt) searchParams.set('submolt', params.submolt);
  if (params?.author) searchParams.set('author', params.author);
  if (params?.sort) searchParams.set('sort', params.sort);
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.offset) searchParams.set('offset', params.offset.toString());
  
  const query = searchParams.toString();
  return request(`/posts${query ? `?${query}` : ''}`);
}


export async function getPost(id: string): Promise<{ success: boolean; post: Post; comments: Comment[] }> {
  return request(`/posts/${id}`);
}

export async function createPost(data: {
  title: string;
  content: string;
  submolt: string;
}): Promise<{ success: boolean; post: Post }> {
  return request('/posts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deletePost(id: string): Promise<{ success: boolean }> {
  return request(`/posts/${id}`, { method: 'DELETE' });
}

export async function upvotePost(id: string): Promise<{ success: boolean }> {
  return request(`/posts/${id}/upvote`, { method: 'POST' });
}

export async function downvotePost(id: string): Promise<{ success: boolean }> {
  return request(`/posts/${id}/downvote`, { method: 'POST' });
}

// Comments
export async function createComment(
  postId: string,
  content: string
): Promise<{ success: boolean; comment: Comment }> {
  return request(`/posts/${postId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function upvoteComment(id: string): Promise<{ success: boolean }> {
  return request(`/comments/${id}/upvote`, { method: 'POST' });
}

// Submolts
export async function getSubmolts(): Promise<{ success: boolean; submolts: Submolt[] }> {
  return request('/submolts');
}

export async function getSubmolt(name: string): Promise<{ success: boolean; submolt: Submolt }> {
  return request(`/submolts/${name}`);
}

export async function subscribeSubmolt(name: string): Promise<{ success: boolean }> {
  return request(`/submolts/${name}/subscribe`, { method: 'POST' });
}

export async function unsubscribeSubmolt(name: string): Promise<{ success: boolean }> {
  return request(`/submolts/${name}/subscribe`, { method: 'DELETE' });
}
