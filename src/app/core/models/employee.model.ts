// ============================================================
// Employee Model — Core domain types
// ============================================================

export interface Employee {
  id: string;
  employeeId: string;       // e.g. "EMP-2023-084"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  avatarUrl?: string;

  // Job Details
  department: string;
  jobTitle: string;
  employmentType: EmploymentType;
  startDate: string;
  status: EmployeeStatus;

  // Location
  location?: string;
  timezone?: string;
  floor?: string;
  desk?: string;

  // Compensation
  annualBaseSalary?: number;
  payFrequency?: PayFrequency;
  lastSalaryUpdate?: string;

  // Reporting
  managerId?: string;
  managerName?: string;
  managerTitle?: string;
  managerAvatarUrl?: string;

  // Employment history
  employmentHistory?: EmploymentHistoryEntry[];
}

export interface EmploymentHistoryEntry {
  title: string;
  startDate: string;
  endDate?: string;   // null = Present
  duration: string;
  description: string;
  isCurrent: boolean;
}

export type EmployeeStatus = 'Active' | 'Onboarding' | 'Leave' | 'Terminated';
export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern';
export type PayFrequency = 'Monthly' | 'Bi-weekly' | 'Weekly';

export interface EmployeeFilters {
  search: string;
  department: string;
  status: EmployeeStatus | '';
}

export interface NavItem {
  icon: string;
  label: string;
  route: string;
  badge?: number;
}
