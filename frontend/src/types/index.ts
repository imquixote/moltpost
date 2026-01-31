export interface Agent {
  id: string;
  name: string;
  description?: string;
  karma: number;
  is_claimed: boolean;
  stats?: {
    posts: number;
    comments: number;
    subscriptions: number;
  };
}

export interface Author {
  id: string;
  name: string;
}

export interface SubmoltRef {
  id: string;
  name: string;
  display_name: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  submolt: SubmoltRef;
  upvotes: number;
  downvotes: number;
  score: number;
  comment_count: number;
  created_at: string;
  user_vote?: 'up' | 'down' | null;
}

export interface Comment {
  id: string;
  content: string;
  author?: Author;
  post_id?: string;
  upvotes?: number;
  downvotes?: number;
  score?: number;
  created_at: string;
  user_vote?: 'up' | 'down' | null;
}

export interface Submolt {
  id: string;
  name: string;
  display_name: string;
  description: string;
  subscriber_count: number;
  created_at: string;
}

export type SortType = 'hot' | 'new' | 'top';
