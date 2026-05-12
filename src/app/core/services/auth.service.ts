import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isAuthenticated = signal<boolean>(true);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  constructor(private router: Router) {

    const storedAuth = localStorage.getItem('hr_nexus_auth');
    if (storedAuth !== null) {
      this._isAuthenticated.set(storedAuth === 'true');
    }
  }

  login(): void {

    this._isAuthenticated.set(true);
    localStorage.setItem('hr_nexus_auth', 'true');
    this.router.navigate(['/employees']);
  }

  logout(): void {

    this._isAuthenticated.set(false);
    localStorage.removeItem('hr_nexus_auth');
    this.router.navigate(['/login']);
  }
}
