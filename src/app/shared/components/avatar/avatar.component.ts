import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() name = '';
  @Input() size = 40;

  private readonly colors = [
    '#1565C0', '#5D87FF', '#7C3AED', '#0891B2',
    '#059669', '#D97706', '#DC2626', '#DB2777',
  ];

  get initials(): string {
    const parts = this.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return parts[0]?.[0] ?? '?';
  }

  get bgColor(): string {
    let hash = 0;
    for (const char of this.name) {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    }
    return this.colors[Math.abs(hash) % this.colors.length];
  }
}
