import { Component, inject, effect, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';

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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule,
    FormsModule,
    StatusBadgeComponent,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent implements AfterViewInit {
  public readonly employeeService = inject(EmployeeService);
  private snackBar = inject(MatSnackBar);

  displayedColumns: string[] = ['username', 'name', 'basicSalary', 'status', 'group', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    effect(() => {
      // Bind computed signal to data source
      this.dataSource.data = this.employeeService.filteredEmployees();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
    // Set initial page from service if preserving state
    if (this.employeeService.currentPageIndex() > 0) {
      this.paginator.pageIndex = this.employeeService.currentPageIndex();
    }
    
    this.paginator.page.subscribe(e => {
      this.employeeService.currentPageIndex.set(e.pageIndex);
    });

    this.dataSource.sort = this.sort;
    this.sort.sortChange.subscribe(sortState => {
      this.employeeService.currentSort.set({
        active: sortState.active,
        direction: sortState.direction
      });
      // The dataSource's native sort handles the actual sorting visually for current page, 
      // but to be safe with full data sets we update the service signal.
      // Wait, since we are using MatTableDataSource and it has its own sorting, 
      // we can let it handle it. We just preserve state.
    });

    // Custom sorting logic for MatTableDataSource
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'name': return item.firstName + ' ' + item.lastName;
        default: return (item as any)[property];
      }
    };
  }

  onSearchUser(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.employeeService.currentSearchUsername.set(value);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onSearchGroup(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
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

  editEmployee(employee: Employee): void {
    this.snackBar.open(`Editing ${employee.firstName} ${employee.lastName}`, 'Close', {
      duration: 3000,
      panelClass: ['snackbar-warning'] // Yellow notification
    });
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`Are you sure you want to delete ${employee.username}?`)) {
      this.employeeService.deleteEmployee(employee.id);
      this.snackBar.open(`${employee.firstName} has been deleted`, 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'] // Red notification
      });
    }
  }

  formatRupiah(amount: number): string {
    const formatted = new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
    return `Rp. ${formatted}`;
  }
}
