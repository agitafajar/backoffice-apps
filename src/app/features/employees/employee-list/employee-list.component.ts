import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    MatTooltipModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    AvatarComponent,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  readonly employeeService = inject(EmployeeService);

  searchQuery = '';
  selectedDepartment = '';
  selectedStatus = '';

  get paginationStart(): number {
    const page = this.employeeService.currentPage();
    const size = this.employeeService.pageSize();
    return (page - 1) * size + 1;
  }

  get paginationEnd(): number {
    const page = this.employeeService.currentPage();
    const size = this.employeeService.pageSize();
    return Math.min(page * size, this.employeeService.totalFiltered());
  }

  get pages(): number[] {
    const total = this.employeeService.totalPages();
    const current = this.employeeService.currentPage();
    const pages: number[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1); // dots
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push(-1); // dots
      pages.push(total);
    }
    return pages;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.employeeService.updateFilters({ search: query });
  }

  onDepartmentChange(dept: string): void {
    this.selectedDepartment = dept;
    this.employeeService.updateFilters({ department: dept });
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    this.employeeService.updateFilters({ status: status as any });
  }
}
