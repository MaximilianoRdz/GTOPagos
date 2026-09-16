export interface UserProfile {
  id?: number;
  email?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  salary?: number;
  created_at?: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
}
