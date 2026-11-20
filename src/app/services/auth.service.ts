import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Role, SessionUser, User } from '../models/model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'users';
  private readonly SESSION_KEY = 'currentUser';

  constructor(private router: Router) {
    this.seedUsers();
  }

  // Create the 3 default users only once
  private seedUsers(): void {
    if (localStorage.getItem(this.USERS_KEY)) return;
    const users: User[] = [
      { username: 'user1@localhost', password: 'user1@12345678', role: 'member' },
      { username: 'user2@localhost', password: 'user2@12345678', role: 'member' },
      { username: 'admin1@localhost', password: 'admin1@87651234', role: 'admin' },
    ];
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  login(username: string, password: string): boolean {
    const user = this.getUsers().find(
      u => u.username === username && u.password === password
    );
    if (!user) return false;

    const session: SessionUser = { username: user.username, role: user.role };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this.router.navigate(['/home']); // redirect after success
    return true;
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this.router.navigate(['/login']);
  }

  get currentUser(): SessionUser | null {
    const data = localStorage.getItem(this.SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  hasRole(role: Role): boolean {
    return this.currentUser?.role === role;
  }
}