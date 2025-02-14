import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IFilter } from '../../../interfaces/userInterface';
@Component({
  selector: 'app-filter',
  imports: [FormsModule, CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent {
  @Input() filter: IFilter = {
    status: 'all',
    user: '',
    dateRange: '',
  };

  @Output() filterChanged = new EventEmitter<void>();

  applyFilters(): void {
    this.filterChanged.emit();
  }
}
