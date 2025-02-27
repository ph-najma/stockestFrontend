import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { ApiService } from '../../../services/api.service';
import { Subscription } from 'rxjs';
import {
  ITransaction,
  IResponseModel,
} from '../../../interfaces/userInterface';
@Component({
  selector: 'app-transaction',
  imports: [UserHeaderComponent, CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent {
  transactionData: ITransaction[] = [];
  limit: number = 10;
  totalPages: number = 1;
  currentPage: number = 1;
  private subscriptions = new Subscription();
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchTransactions(this.currentPage);
  }

  fetchTransactions(page: number): void {
    const transactionSubscription = this.apiService
      .getTransactions(page, this.limit)
      .subscribe({
        next: (response: IResponseModel<ITransaction[]>) => {
          if (response.data) {
            this.transactionData = response.data;
          }
        },
      });
    this.subscriptions.add(transactionSubscription);
  }

  columnVisibility: Record<
    'id' | 'companyName' | 'shares' | 'total' | 'status',
    boolean
  > = {
    id: false,
    companyName: true,
    shares: true,
    total: true,
    status: true,
  };

  isColumnDropdownOpen = false;

  toggleColumnDropdown(): void {
    this.isColumnDropdownOpen = !this.isColumnDropdownOpen;
  }

  getColumnKeys(): Array<keyof typeof this.columnVisibility> {
    return Object.keys(this.columnVisibility) as Array<
      keyof typeof this.columnVisibility
    >;
  }

  toggleColumnVisibility(column: keyof typeof this.columnVisibility): void {
    this.columnVisibility[column] = !this.columnVisibility[column];
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchTransactions(page);
    }
  }
}
