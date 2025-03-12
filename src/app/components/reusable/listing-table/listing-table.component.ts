import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';

interface TableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  custom?: (row: T) => { text: string; class?: string } | undefined;
  buttons?: { label: string; cssClass: string; action: (row: T) => void }[];
  sortable?: boolean;
}

@Component({
  selector: 'app-listing-table',
  imports: [CommonModule],
  templateUrl: './listing-table.component.html',
  styleUrl: './listing-table.component.css',
})
export class ListingTableComponent implements OnInit {
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() customTemplates: { [key: string]: TemplateRef<any> } = {};
  @Output() pageChange = new EventEmitter<number>();
  ngOnInit() {}
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
