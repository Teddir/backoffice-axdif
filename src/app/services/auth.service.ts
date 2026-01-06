import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  companyName: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  countryCode?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'axdif_user';
  private readonly IS_LOGGED_IN_KEY = 'axdif_is_logged_in';
  private platformId = inject(PLATFORM_ID);

  private getStorage(): Storage | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage;
    }
    return null;
  }

  register(user: User, password: string): void {
    const storage = this.getStorage();
    if (storage) {
      const userData = { ...user, password };
      storage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
  }

  login(email: string, password: string): boolean {
    const storage = this.getStorage();
    if (!storage) return false;

    const userData = storage.getItem(this.USER_KEY);
    if (userData) {
      const user = JSON.parse(userData);
      if (user.email === email && user.password === password) {
        storage.setItem(this.IS_LOGGED_IN_KEY, 'true');
        return true;
      }
    }
    return false;
  }

  logout(): void {
    const storage = this.getStorage();
    if (storage) {
      storage.removeItem(this.IS_LOGGED_IN_KEY);
    }
  }

  isLoggedIn(): boolean {
    const storage = this.getStorage();
    if (!storage) return false;
    
    const isLoggedIn = storage.getItem(this.IS_LOGGED_IN_KEY) === 'true';
    const userData = storage.getItem(this.USER_KEY);
    
    return isLoggedIn && !!userData;
  }

  getCurrentUser(): User | null {
    const storage = this.getStorage();
    if (!storage) return null;

    const userData = storage.getItem(this.USER_KEY);
    if (userData) {
      const user = JSON.parse(userData);
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}

