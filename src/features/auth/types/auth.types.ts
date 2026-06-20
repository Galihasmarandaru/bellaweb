export interface AuthUser {
  id: string;
  username: string;
  name: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
