import { Component, inject, OnInit, signal, computed, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { EmployeeService } from '../../core/services/employee.service';

interface StatCard {
  icon: string;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  color: string; // bg color class
  iconColor: string;
}

interface UpcomingEvent {
  month: string;
  day: string;
  title: string;
  time: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    PageHeaderComponent,
    StatusBadgeComponent,
    AvatarComponent,
    DatePipe,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements AfterViewInit {
  private readonly employeeService = inject(EmployeeService);

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  // Stats
  readonly stats = computed<StatCard[]>(() => {
    const employees = this.employeeService.employees();
    const active = employees.filter(e => e.status === 'Active').length;
    const onboarding = employees.filter(e => e.status === 'Onboarding').length;
    const onLeave = employees.filter(e => e.status === 'On Leave').length;
    const totalSalary = employees.reduce((sum, e) => sum + e.basicSalary, 0);

    return [
      {
        icon: 'groups',
        label: 'Total Employees',
        value: employees.length.toString(),
        trend: `↑ ${onboarding} this month`,
        trendUp: true,
        color: '#EBF5FF',
        iconColor: '#3B82F6'
      },
      {
        icon: 'person_add',
        label: 'New Hires',
        value: onboarding.toString(),
        trend: `↑ ${Math.floor(onboarding / 2)} this month`,
        trendUp: true,
        color: '#F0FDF4',
        iconColor: '#22C55E'
      },
      {
        icon: 'event_busy',
        label: 'On Leave',
        value: onLeave.toString(),
        trend: `↓ ${Math.max(1, Math.floor(onLeave / 3))} this month`,
        trendUp: false,
        color: '#FFF7ED',
        iconColor: '#F97316'
      },
      {
        icon: 'payments',
        label: 'Payroll This Month',
        value: this.formatShortRupiah(totalSalary),
        trend: '↑ 8% from last month',
        trendUp: true,
        color: '#F5F3FF',
        iconColor: '#8B5CF6'
      }
    ];
  });

  // Department distribution
  readonly departments = computed(() => {
    const employees = this.employeeService.employees();
    const groupMap = new Map<string, number>();
    employees.forEach(e => {
      groupMap.set(e.group, (groupMap.get(e.group) || 0) + 1);
    });

    const total = employees.length;
    const sorted = [...groupMap.entries()].sort((a, b) => b[1] - a[1]);
    const colors = ['#3B82F6', '#22C55E', '#F97316', '#EAB308', '#8B5CF6', '#EC4899', '#06B6D4', '#6366F1', '#14B8A6', '#F43F5E'];

    return sorted.map(([name, count], i) => ({
      name,
      count,
      percentage: ((count / total) * 100).toFixed(1),
      color: colors[i % colors.length]
    }));
  });

  // Recent employees (latest 5)
  readonly recentEmployees = computed(() => {
    return this.employeeService.employees().slice(0, 5);
  });

  // Chart data (monthly mock)
  readonly monthlyData = [45, 52, 58, 62, 68, 75, 80, 88, 95, 102, 110, 118];
  readonly months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Upcoming events
  readonly events: UpcomingEvent[] = [
    { month: 'AUG', day: '30', title: 'Monthly Payroll Processing', time: '09:00 AM - 12:00 PM', color: '#3B82F6' },
    { month: 'SEP', day: '05', title: 'Performance Review Meeting', time: '10:00 AM - 12:00 PM', color: '#22C55E' },
    { month: 'SEP', day: '10', title: 'Employee Training Session', time: '02:00 PM - 04:00 PM', color: '#F97316' },
  ];

  ngAfterViewInit() {
    this.drawChart();
  }

  formatShortRupiah(amount: number): string {
    if (amount >= 1_000_000_000) {
      return 'Rp ' + (amount / 1_000_000_000).toFixed(1) + 'B';
    }
    if (amount >= 1_000_000) {
      return 'Rp ' + (amount / 1_000_000).toFixed(0) + 'M';
    }
    return 'Rp ' + amount.toLocaleString('id-ID');
  }

  private drawChart() {
    const canvas = this.chartCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxVal = Math.max(...this.monthlyData) + 20;
    const minVal = 0;

    // Grid lines
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    const gridSteps = [0, 50, 100, 150];
    gridSteps.forEach(val => {
      const y = padding.top + chartH - (val / maxVal) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Y labels
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    });

    // X labels
    ctx.fillStyle = '#94A3B8';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    this.months.forEach((m, i) => {
      const x = padding.left + (i / (this.months.length - 1)) * chartW;
      ctx.fillText(m, x, h - 8);
    });

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    ctx.beginPath();
    this.monthlyData.forEach((val, i) => {
      const x = padding.left + (i / (this.monthlyData.length - 1)) * chartW;
      const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    // Close for fill
    const lastX = padding.left + chartW;
    const firstX = padding.left;
    ctx.lineTo(lastX, padding.top + chartH);
    ctx.lineTo(firstX, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    this.monthlyData.forEach((val, i) => {
      const x = padding.left + (i / (this.monthlyData.length - 1)) * chartW;
      const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots
    this.monthlyData.forEach((val, i) => {
      const x = padding.left + (i / (this.monthlyData.length - 1)) * chartW;
      const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // For donut chart in template — computed SVG arcs
  readonly donutArcs = computed(() => {
    const depts = this.departments();
    const total = depts.reduce((s, d) => s + d.count, 0);
    const arcs: { path: string; color: string }[] = [];

    let cumulative = 0;
    depts.forEach(dept => {
      const startAngle = (cumulative / total) * 360 - 90;
      cumulative += dept.count;
      const endAngle = (cumulative / total) * 360 - 90;

      const start = this.polarToCartesian(80, 80, 65, endAngle);
      const end = this.polarToCartesian(80, 80, 65, startAngle);
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;

      arcs.push({
        path: `M ${start.x} ${start.y} A 65 65 0 ${largeArc} 0 ${end.x} ${end.y}`,
        color: dept.color
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
