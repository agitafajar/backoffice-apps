import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { FilterSelectComponent, type SelectOption } from '../../shared/components/filter-select/filter-select.component';

interface PayrollRun {
  period: string;
  payDate: string;
  employees: number;
  gross: string;
  deductions: string;
  net: string;
  status: string;
}

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    StatusBadgeComponent,
    PageHeaderComponent,
    StatCardComponent,
    FilterSelectComponent,
  ],
  templateUrl: './payroll.component.html',
  styleUrl: './payroll.component.scss',
})
export class PayrollComponent {

  readonly periodOptions: SelectOption[] = [
    { value: 'may-2024', label: 'May 2024' },
  ];

  readonly deptOptions: SelectOption[] = [
    { value: '', label: 'All Departments' },
  ];

  readonly typeOptions: SelectOption[] = [
    { value: '', label: 'All Employment Types' },
  ];

  readonly stats = [
    { icon: 'account_balance_wallet', label: 'Total Payroll This Month', value: 'Rp. 1.245.750.000', trend: '↑ 8.45% from last month', trendUp: true, iconBg: '#EFF6FF', iconColor: '#3B82F6' },
    { icon: 'groups', label: 'Total Employees Paid', value: '105', trend: 'Active employees', trendUp: true, iconBg: '#F0FDF4', iconColor: '#22C55E' },
    { icon: 'request_quote', label: 'Average Salary', value: 'Rp. 11.864.286', trend: 'Per employee', trendUp: true, iconBg: '#FFF7ED', iconColor: '#F97316' },
    { icon: 'percent', label: 'Total Deductions', value: 'Rp. 156.230.000', trend: '12.54% of gross payroll', trendUp: true, iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  ];

  readonly recentRuns: PayrollRun[] = [
    { period: 'May 2024', payDate: 'May 31, 2024', employees: 105, gross: 'Rp. 1.245.750.000', deductions: 'Rp. 156.230.000', net: 'Rp. 1.089.520.000', status: 'Completed' },
    { period: 'April 2024', payDate: 'Apr 30, 2024', employees: 102, gross: 'Rp. 1.148.620.000', deductions: 'Rp. 142.450.000', net: 'Rp. 1.006.170.000', status: 'Completed' },
    { period: 'March 2024', payDate: 'Mar 31, 2024', employees: 100, gross: 'Rp. 1.093.450.000', deductions: 'Rp. 135.780.000', net: 'Rp. 957.670.000', status: 'Completed' },
    { period: 'February 2024', payDate: 'Feb 29, 2024', employees: 98, gross: 'Rp. 1.024.890.000', deductions: 'Rp. 128.540.000', net: 'Rp. 896.350.000', status: 'Completed' },
  ];

  readonly donutArcs = computed(() => {
    const data = [
      { color: '#3B82F6', percent: 73.3 },
      { color: '#22C55E', percent: 16.0 },
      { color: '#EC4899', percent: 6.3 },
      { color: '#14B8A6', percent: 4.4 }
    ];

    const arcs: { path: string; color: string }[] = [];
    let cumulative = 0;

    data.forEach(item => {
      const startAngle = (cumulative / 100) * 360 - 90;
      cumulative += item.percent;
      const endAngle = (cumulative / 100) * 360 - 90;

      let start = this.polarToCartesian(80, 80, 65, endAngle - 2);
      const end = this.polarToCartesian(80, 80, 65, startAngle);

      const largeArc = (endAngle - 2) - startAngle > 180 ? 1 : 0;

      arcs.push({
        path: `M ${start.x} ${start.y} A 65 65 0 ${largeArc} 0 ${end.x} ${end.y}`,
        color: item.color
      });
    });

    return arcs;
  });

  private polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  }
}
