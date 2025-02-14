import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';

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
  ngOnInit() {
    console.log('Columns:', this.columns);
    console.log('Data:', this.data);
  }
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
