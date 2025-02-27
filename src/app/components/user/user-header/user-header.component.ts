import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { IStock, IResponseModel } from '../../../interfaces/userInterface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-user-header',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css',
})
export class UserHeaderComponent {
  searchQuery: string = '';
  suggestions: IStock[] = [];
  loading: boolean = false;
  private searchSubject: Subject<string> = new Subject();
  isMenuOpen: boolean = false;
  notificationCount: number = 3;
  isDropdownOpen: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {} // Example notification count
  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.loading = true;
          return this.apiService.searchStocks(query);
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
    this.handleClear();
  }

  handleClear(): void {
    this.searchQuery = '';
    this.suggestions = [];
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    sessionStorage.removeItem('token');
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}
