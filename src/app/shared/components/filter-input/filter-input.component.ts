import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-input',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './filter-input.component.html',
  styleUrl: './filter-input.component.scss',
})
export class FilterInputComponent {
  @Input() icon = 'search';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() minWidth = '180px';
  @Input() showSuffix = false;
  @Input() suffixIcon = 'expand_more';
  @Output() valueChange = new EventEmitter<string>();
  @Output() inputEvent = new EventEmitter<Event>();

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.valueChange.emit(val);
    this.inputEvent.emit(event);
  }
}
