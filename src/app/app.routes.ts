import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  {
    path: 'login',
    loadComponent: () =>
      import('./core/layout/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
        title: 'Login - HR Nexus',
      },
    ],
  },

  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        title: 'Dashboard - HR Nexus',
      },
      {
        path: 'employees',
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './features/employees/employee-list/employee-list.component'
              ).then((m) => m.EmployeeListComponent),
            title: 'Employee Directory - HR Nexus',
          },
          {
            path: 'add',
            loadComponent: () =>
              import(
                './features/employees/employee-add/employee-add.component'
              ).then((m) => m.EmployeeAddComponent),
            title: 'Add New Employee - HR Nexus',
          },
          {
            path: ':id',
            loadComponent: () =>
              import(
                './features/employees/employee-profile/employee-profile.component'
              ).then((m) => m.EmployeeProfileComponent),
            title: 'Employee Profile - HR Nexus',
          },
        ],
      },
      {
        path: 'payroll',
        loadComponent: () =>
          import('./features/payroll/payroll.component').then(
            (m) => m.PayrollComponent
          ),
        title: 'Payroll - HR Nexus',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
        title: 'Reports - HR Nexus',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
        title: 'Settings - HR Nexus',
      },
      { path: '', redirectTo: 'employees', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: '' },
];
