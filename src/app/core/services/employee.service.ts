import { Injectable, signal, computed } from '@angular/core';
import { Employee, EmployeeStatus } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  // Main data store
  private readonly _employees = signal<Employee[]>(this.generateMockData(105));
  
  // Public readonly access to all employees
  readonly employees = this._employees.asReadonly();

  // Preserved state for list view
  public currentSearchUsername = signal<string>('');
  public currentSearchGroup = signal<string>('');
  public currentStatusFilter = signal<EmployeeStatus | ''>('');
  public currentPageIndex = signal<number>(0);
  public currentSort = signal<{active: string, direction: 'asc'|'desc'|''}>({ active: '', direction: '' });

  // Computed state for the data table
  readonly filteredEmployees = computed(() => {
    let result = this._employees();

    const searchUser = this.currentSearchUsername().toLowerCase().trim();
    if (searchUser) {
      result = result.filter(e => e.username.toLowerCase().includes(searchUser));
    }

    const searchGroup = this.currentSearchGroup().toLowerCase().trim();
    if (searchGroup) {
      result = result.filter(e => e.group.toLowerCase().includes(searchGroup));
    }

    const statusFilter = this.currentStatusFilter();
    if (statusFilter) {
      result = result.filter(e => e.status === statusFilter);
    }

    const sort = this.currentSort();
    if (sort.active && sort.direction) {
      result = [...result].sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'username': return this.compare(a.username, b.username, isAsc);
          case 'name': return this.compare(a.firstName + ' ' + a.lastName, b.firstName + ' ' + b.lastName, isAsc);
          case 'email': return this.compare(a.email, b.email, isAsc);
          case 'basicSalary': return this.compare(a.basicSalary, b.basicSalary, isAsc);
          case 'group': return this.compare(a.group, b.group, isAsc);
          case 'status': return this.compare(a.status, b.status, isAsc);
          default: return 0;
        }
      });
    }

    return result;
  });

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  getById(id: string): Employee | undefined {
    return this._employees().find(e => e.id === id);
  }

  addEmployee(employee: Omit<Employee, 'id'>): void {
    const newEmployee: Employee = {
      ...employee,
      id: crypto.randomUUID()
    };
    this._employees.update(emps => [newEmployee, ...emps]);
  }

  updateEmployee(id: string, updates: Partial<Employee>): void {
    this._employees.update(emps => 
      emps.map(emp => emp.id === id ? { ...emp, ...updates } : emp)
    );
  }

  deleteEmployee(id: string): void {
    this._employees.update(emps => emps.filter(e => e.id !== id));
  }

  private generateMockData(count: number): Employee[] {
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzales', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const groups = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Legal', 'Customer Success'];
    const statuses: EmployeeStatus[] = ['Active', 'Active', 'Active', 'Inactive', 'On Leave', 'Onboarding'];
    
    const employees: Employee[] = [];

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      employees.push({
        id: crypto.randomUUID(),
        username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@hrnexus.com`,
        birthDate: new Date(1970 + Math.floor(Math.random() * 30), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        basicSalary: 4000000 + Math.floor(Math.random() * 20000000), // Random IDR between 4jt and 24jt
        status: statuses[Math.floor(Math.random() * statuses.length)],
        group: groups[Math.floor(Math.random() * groups.length)],
        description: new Date() // Fulfilling the "datetime" type requirement for description
      });
    }

    return employees;
  }
}
