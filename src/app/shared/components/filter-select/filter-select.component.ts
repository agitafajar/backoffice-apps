import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-filter-select',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './filter-select.component.html',
  styleUrl: './filter-select.component.scss',
})
export class FilterSelectComponent {
  @Input() icon = '';
  @Input() options: SelectOption[] = [];
  @Input() value = '';
  @Input() minWidth = '180px';
  @Output() valueChange = new EventEmitter<string>();

  onChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(val);
  }
}
