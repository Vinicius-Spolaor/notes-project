import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USERNAME_KEY = 'auth-username';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  signOut(): void {
    window.localStorage.clear();
  }

  saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  saveUsername(username: string): void {
    window.localStorage.removeItem(USERNAME_KEY);
    window.localStorage.setItem(USERNAME_KEY, username);
  }

  getUsername(): string | null {
    return window.localStorage.getItem(USERNAME_KEY);
  }
}
