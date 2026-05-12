import {
  Component,
  inject,
  effect,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { AvatarComponent } from '../../../shared/components/avatar/avatar.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FilterInputComponent } from '../../../shared/components/filter-input/filter-input.component';
import { FilterSelectComponent, type SelectOption } from '../../../shared/components/filter-select/filter-select.component';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSnackBarModule,
    FormsModule,
    StatusBadgeComponent,
    AvatarComponent,
    PageHeaderComponent,
    FilterInputComponent,
    FilterSelectComponent,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements AfterViewInit {
  public readonly employeeService = inject(EmployeeService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = [
    'username',
    'name',
    'email',
    'basicSalary',
    'status',
    'group',
    'actions',
  ];
  dataSource = new MatTableDataSource<Employee>([]);

  readonly statusOptions: SelectOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Onboarding', label: 'Onboarding' },
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    effect(() => {

      this.dataSource.data = this.employeeService.filteredEmployees();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    if (this.employeeService.currentPageIndex() > 0) {
      this.paginator.pageIndex = this.employeeService.currentPageIndex();
    }

    this.paginator.page.subscribe((e) => {
      this.employeeService.currentPageIndex.set(e.pageIndex);
    });

    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe((sortState) => {
      this.employeeService.currentSort.set({
        active: sortState.active,
        direction: sortState.direction,
      });
    });

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'name':
          return item.firstName + ' ' + item.lastName;
        default:
          return (item as any)[property];
      }
    };
  }

  onSearchUser(value: string): void {
    this.employeeService.currentSearchUsername.set(value);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchGroup(value: string): void {
    this.employeeService.currentSearchGroup.set(value);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onStatusFilter(value: string): void {
    this.employeeService.currentStatusFilter.set(value as any);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilters(): void {
    this.employeeService.currentSearchUsername.set('');
    this.employeeService.currentSearchGroup.set('');
    this.employeeService.currentStatusFilter.set('');
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editEmployee(employee: Employee): void {
    this.snackBar.open(
      `Editing ${employee.firstName} ${employee.lastName}`,
      'Close',
      {
        duration: 3000,
        panelClass: ['snackbar-warning'],
      },
    );
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.username}?`)) {
      this.employeeService.deleteEmployee(employee.id);
      this.snackBar.open(`${employee.firstName} has been deleted`, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    }
  }

  formatRupiah(amount: number): string {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    return `Rp. ${formatted}`;
  }
}
