import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Fake authentication state (default to true for demo purposes, 
  // but in a real app would check localStorage/sessionStorage/tokens)
  private _isAuthenticated = signal<boolean>(true);
  
  // Expose readonly signal
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(private router: Router) {
    // Check local storage on initialization
    const storedAuth = localStorage.getItem('hr_nexus_auth');
    if (storedAuth !== null) {
      this._isAuthenticated.set(storedAuth === 'true');
    }
  }

  login(): void {
    // Simulate successful login
    this._isAuthenticated.set(true);
    localStorage.setItem('hr_nexus_auth', 'true');
    this.router.navigate(['/employees']);
  }

  logout(): void {
    // Clear state and navigate to login
    this._isAuthenticated.set(false);
    localStorage.removeItem('hr_nexus_auth');
    this.router.navigate(['/login']);
  }
}
