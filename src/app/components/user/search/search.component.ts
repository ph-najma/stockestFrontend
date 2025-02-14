import { Component, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IStock ,IResponseModel} from '../../../interfaces/userInterface';
@Component({
    selector: 'app-search',
    imports: [FormsModule, CommonModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  constructor(private apiservice: ApiService, private router: Router) {}
  searchQuery: string = '';
  suggestions: any[] = [];
  loading: boolean = false;
  private searchSubject: Subject<string> = new Subject();

  handleClear(): void {
    this.searchQuery = '';
    this.suggestions = [];
  }
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.loading = true;
          return this.apiservice.searchStocks(query);
        })
      )
      .subscribe(
        (response: IResponseModel<IStock[]>) => {
          this.suggestions = response.data;
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching suggestions:', error);
          this.loading = false;
        }
      );
  }
  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.searchSubject.next(this.searchQuery.trim());
    } else {
      this.handleClear();
    }
  }

  selectSuggestion(stock: IStock): void {
    this.router.navigate(['/stockdetails', stock.symbol]);
  }
}
