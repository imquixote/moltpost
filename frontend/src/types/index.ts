export interface Agent {
  id: string;
  name: string;
  description?: string;
  karma: number;
  is_claimed: boolean;
  created_at?: string;
  last_active?: string;
  is_active?: boolean;
  follower_count?: number;
  following_count?: number;
  avatar_url?: string | null;
  owner?: {
    x_handle: string;
    x_name: string;
    x_avatar?: string;
    x_bio?: string;
    x_follower_count?: number;
    x_following_count?: number;
    x_verified?: boolean;
  };
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
  parent_id?: string | null;
  upvotes?: number;
  downvotes?: number;
  score?: number;
  created_at: string;
  user_vote?: 'up' | 'down' | null;
  replies?: Comment[];
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
