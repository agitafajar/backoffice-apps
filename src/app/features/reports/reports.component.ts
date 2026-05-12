import { Component, computed, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { FilterSelectComponent, type SelectOption } from '../../shared/components/filter-select/filter-select.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    PageHeaderComponent,
    StatCardComponent,
    FilterSelectComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('growthChart') growthChart!: ElementRef<HTMLCanvasElement>;
  private resizeHandler = () => this.drawChart();

  readonly stats = [
    { icon: 'groups', label: 'Total Employees', value: '105', trend: '↑ 12 this month', trendUp: true, iconBg: '#EFF6FF', iconColor: '#3B82F6' },
    { icon: 'person_add', label: 'New Hires', value: '8', trend: '↑ 2 this month', trendUp: true, iconBg: '#F0FDF4', iconColor: '#22C55E' },
    { icon: 'event_note', label: 'On Leave', value: '15', trend: '↓ 3 this month', trendUp: false, iconBg: '#FFF7ED', iconColor: '#F97316' },
    { icon: 'attach_money', label: 'Payroll This Month', value: '$45,230', trend: '↑ 8% from last month', trendUp: true, iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  ];

  readonly dateOptions: SelectOption[] = [
    { value: 'may-2024', label: 'May 1, 2024 - May 31, 2024' },
  ];

  readonly deptOptions: SelectOption[] = [
    { value: '', label: 'All Departments' },
  ];

  readonly typeOptions: SelectOption[] = [
    { value: '', label: 'All Report Types' },
  ];

  readonly popularReports = [
    { title: 'Employee Directory', desc: 'Complete list of employees and their details.', icon: 'people', colorClass: 'blue' },
    { title: 'Payroll Summary', desc: 'Payroll overview including earnings and deductions.', icon: 'request_quote', colorClass: 'green' },
    { title: 'Attendance Report', desc: 'Employee attendance and absence summary.', icon: 'event', colorClass: 'orange' },
    { title: 'Department Summary', desc: 'Overview of employees by department.', icon: 'pie_chart', colorClass: 'purple' },
    { title: 'Performance Report', desc: 'Employee performance and review summary.', icon: 'trending_up', colorClass: 'pink' }
  ];

  readonly departmentData = [
    { name: 'Engineering', count: 38, percent: 36.2, color: '#3B82F6' },
    { name: 'Human Resources', count: 22, percent: 21.0, color: '#F97316' },
    { name: 'Marketing', count: 18, percent: 17.1, color: '#10B981' },
    { name: 'Sales', count: 15, percent: 14.3, color: '#6B7280' },
    { name: 'Finance', count: 12, percent: 11.4, color: '#6366F1' }
  ];

  readonly donutArcs = computed(() => {
    const total = 105;
    const arcs: { path: string; color: string }[] = [];
    let cumulative = 0;

    this.departmentData.forEach(dept => {
      const startAngle = (cumulative / total) * 360 - 90;
      cumulative += dept.count;
      const endAngle = (cumulative / total) * 360 - 90;

      let start = this.polarToCartesian(80, 80, 65, endAngle - 3);
      const end = this.polarToCartesian(80, 80, 65, startAngle);
      const largeArc = (endAngle - 3) - startAngle > 180 ? 1 : 0;

      arcs.push({
        path: `M ${start.x} ${start.y} A 65 65 0 ${largeArc} 0 ${end.x} ${end.y}`,
        color: dept.color
      });
    });

    return arcs;
  });

  private polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  ngAfterViewInit() {
    this.drawChart();
    window.addEventListener('resize', this.resizeHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeHandler);
  }

  private drawChart() {
    if (!this.growthChart) return;
    const canvas = this.growthChart.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = [50, 65, 80, 95, 110, 118, 120, 123, 128, 132, 134];
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    ctx.beginPath();
    [0, 50, 100, 150].forEach(val => {
      const y = height - padding - (val / 150) * (height - padding * 2);
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
    });
    ctx.stroke();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '12px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    [0, 50, 100, 150].forEach(val => {
      const y = height - padding - (val / 150) * (height - padding * 2);
      ctx.fillText(val.toString(), padding - 10, y);
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const xStep = (width - padding * 2) / 11;

    months.forEach((month, i) => {
      const x = padding + i * xStep;
      ctx.fillText(month, x, height - padding + 10);
    });

    if (data.length === 0) return;

    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    ctx.beginPath();
    ctx.moveTo(padding, height - padding);

    const points: {x: number, y: number}[] = [];
    data.forEach((val, i) => {
      const x = padding + i * xStep;
      const y = height - padding - (val / 150) * (height - padding * 2);
      points.push({x, y});
      ctx.lineTo(x, y);
    });

    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
}
