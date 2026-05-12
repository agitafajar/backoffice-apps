import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeStatus } from '../../../core/models/employee.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-badge.component.html',
  styleUrl: './status-badge.component.scss',
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: EmployeeStatus;
}
