export type Role = 'admin' | 'member';

export interface User {
  username: string;
  password: string;
  role: Role;
}

export interface SessionUser {
  username: string;
  role: Role;
}

export interface Visit {
  username: string;
  page: string;
  time: string; // ISO date string
}