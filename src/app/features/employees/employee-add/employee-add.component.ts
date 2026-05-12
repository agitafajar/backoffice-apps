import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    PageHeaderComponent,
  ],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.scss',
})
export class EmployeeAddComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly employeeService = inject(EmployeeService);
  private readonly snackBar = inject(MatSnackBar);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    dateOfBirth: [''],
    department: ['', Validators.required],
    jobTitle: ['', Validators.required],
    startDate: ['', Validators.required],
    employmentType: ['Full-Time'],
    annualBaseSalary: [null as number | null],
    payFrequency: ['Monthly'],
  });

  onSubmit(): void {
    if (this.form.valid) {
      const v = this.form.getRawValue();
      this.employeeService.addEmployee({
        firstName: v.firstName!,
        lastName: v.lastName!,
        email: v.email!,
        phone: v.phone || '',
        dateOfBirth: v.dateOfBirth || '',
        department: v.department!,
        jobTitle: v.jobTitle!,
        startDate: v.startDate!,
        employmentType: v.employmentType as any,
        status: 'Onboarding',
        annualBaseSalary: v.annualBaseSalary ?? undefined,
        payFrequency: v.payFrequency as any,
        avatarUrl: '',
        employmentHistory: [],
      });

      this.snackBar.open(
        `✅ ${v.firstName} ${v.lastName} has been successfully added to the directory.`,
        '✕',
        { duration: 4000, panelClass: ['success-snackbar'] }
      );

      this.router.navigate(['/employees']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
