import { Injectable, signal, computed } from '@angular/core';
import {
  Employee,
  EmployeeStatus,
  EmployeeFilters,
} from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  // ── State ─────────────────────────────────────────────────
  private readonly _employees = signal<Employee[]>(MOCK_EMPLOYEES);
  private readonly _filters = signal<EmployeeFilters>({
    search: '',
    department: '',
    status: '',
  });
  private readonly _currentPage = signal(1);
  private readonly _pageSize = signal(4);

  // ── Computed (derived state) ──────────────────────────────
  readonly employees = this._employees.asReadonly();

  readonly filteredEmployees = computed(() => {
    const list = this._employees();
    const f = this._filters();
    return list.filter((e) => {
      const matchSearch =
        !f.search ||
        `${e.firstName} ${e.lastName} ${e.email} ${e.jobTitle}`
          .toLowerCase()
          .includes(f.search.toLowerCase());
      const matchDept = !f.department || e.department === f.department;
      const matchStatus = !f.status || e.status === f.status;
      return matchSearch && matchDept && matchStatus;
    });
  });

  readonly paginatedEmployees = computed(() => {
    const all = this.filteredEmployees();
    const page = this._currentPage();
    const size = this._pageSize();
    const start = (page - 1) * size;
    return all.slice(start, start + size);
  });

  readonly totalFiltered = computed(() => this.filteredEmployees().length);
  readonly currentPage = this._currentPage.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly totalPages = computed(() =>
    Math.ceil(this.filteredEmployees().length / this._pageSize())
  );

  readonly departments = computed(() => {
    const depts = new Set(this._employees().map((e) => e.department));
    return Array.from(depts).sort();
  });

  // ── Actions ───────────────────────────────────────────────
  updateFilters(partial: Partial<EmployeeFilters>): void {
    this._filters.update((f) => ({ ...f, ...partial }));
    this._currentPage.set(1);
  }

  setPage(page: number): void {
    this._currentPage.set(page);
  }

  setPageSize(size: number): void {
    this._pageSize.set(size);
    this._currentPage.set(1);
  }

  getById(id: string): Employee | undefined {
    return this._employees().find((e) => e.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id' | 'employeeId'>): void {
    const id = crypto.randomUUID();
    const empId = `EMP-${new Date().getFullYear()}-${String(this._employees().length + 1).padStart(3, '0')}`;
    this._employees.update((list) => [
      ...list,
      { ...employee, id, employeeId: empId } as Employee,
    ]);
  }
}

// ── Mock Data ───────────────────────────────────────────────
const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP-2023-084',
    firstName: 'Sarah',
    lastName: 'Jenkins',
    email: 's.jenkins@hrnexus.co',
    phone: '+1 (555) 123-4567',
    avatarUrl: '',
    department: 'Design & Product',
    jobTitle: 'Product Designer',
    employmentType: 'Full-Time',
    startDate: '2021-10-12',
    status: 'Active',
    location: 'San Francisco, CA',
    timezone: 'Pacific Time (PT)',
    floor: 'Floor 4',
    desk: 'Desk 42B',
    annualBaseSalary: 145000,
    payFrequency: 'Bi-weekly',
    lastSalaryUpdate: '2023-01-01',
    managerId: '5',
    managerName: 'Michael Chang',
    managerTitle: 'Director of Product Design',
    employmentHistory: [
      {
        title: 'Senior UX Designer',
        startDate: 'Jan 2023',
        endDate: undefined,
        duration: '10 mos',
        description:
          'Promoted to Senior role. Leading the redesign of the core analytics dashboard and mentoring junior designers.',
        isCurrent: true,
      },
      {
        title: 'UX Designer',
        startDate: 'Oct 2021',
        endDate: 'Dec 2022',
        duration: '1 yr 3 mos',
        description:
          'Joined the product design team. Responsible for wireframing and prototyping new user flows for the mobile application.',
        isCurrent: false,
      },
    ],
  },
  {
    id: '2',
    employeeId: 'EMP-2022-041',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    email: 'm.rodriguez@hrnexus.co',
    phone: '+1 (555) 234-5678',
    avatarUrl: '',
    department: 'Engineering',
    jobTitle: 'Senior Developer',
    employmentType: 'Full-Time',
    startDate: '2022-03-15',
    status: 'Active',
    location: 'Austin, TX',
    annualBaseSalary: 165000,
    payFrequency: 'Bi-weekly',
    employmentHistory: [],
  },
  {
    id: '3',
    employeeId: 'EMP-2023-112',
    firstName: 'David',
    lastName: 'Kim',
    email: 'd.kim@hrnexus.co',
    phone: '+1 (555) 345-6789',
    avatarUrl: '',
    department: 'Marketing',
    jobTitle: 'Marketing Specialist',
    employmentType: 'Full-Time',
    startDate: '2023-06-01',
    status: 'Onboarding',
    location: 'New York, NY',
    annualBaseSalary: 85000,
    payFrequency: 'Monthly',
    employmentHistory: [],
  },
  {
    id: '4',
    employeeId: 'EMP-2021-027',
    firstName: 'Elena',
    lastName: 'Lawson',
    email: 'e.lawson@hrnexus.co',
    phone: '+1 (555) 456-7890',
    avatarUrl: '',
    department: 'Sales',
    jobTitle: 'Account Executive',
    employmentType: 'Full-Time',
    startDate: '2021-05-20',
    status: 'Leave',
    location: 'Chicago, IL',
    annualBaseSalary: 95000,
    payFrequency: 'Bi-weekly',
    employmentHistory: [],
  },
];
