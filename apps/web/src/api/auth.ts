import { fetchClient } from './client';

export interface User {
  _id: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  login: (data: any) => fetchClient<AuthResponse>('/auth/login', { data }),
  register: (data: any) => fetchClient<AuthResponse>('/auth/register', { data }),
  me: () => fetchClient<{ user: User }>('/auth/me'),
  logout: () => fetchClient<any>('/auth/logout', { method: 'POST' }),
  forgotPassword: (data: { email: string }) => fetchClient<any>('/auth/forgot-password', { data }),
  resetPassword: (data: { token: string, newPassword: string }) => fetchClient<any>('/auth/reset-password', { data }),
  verifyEmail: (data: { token: string }) => fetchClient<any>('/auth/verify-email', { data }),
};
