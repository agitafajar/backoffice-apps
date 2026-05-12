export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave' | 'Onboarding';

export interface Employee {
  id: string; 
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: EmployeeStatus | string;
  group: string;
  description: Date; 
}

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}
