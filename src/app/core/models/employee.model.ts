export type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave' | 'Onboarding';

export interface Employee {
  id: string; // Internal ID for routing
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  basicSalary: number;
  status: EmployeeStatus | string;
  group: string;
  description: Date; // The assessment explicitly requested datetime for description
}

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}
