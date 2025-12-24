
export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Artwork {
  id: string;
  userId: string;
  username: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  critique?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
