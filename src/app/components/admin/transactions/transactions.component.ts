import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { IResponseModel } from '../../../interfaces/userInterface';
import { Subscription } from 'rxjs';
import { ListingTableComponent } from '../../reusable/listing-table/listing-table.component';
import { TransStatsComponent } from '../trans-stats/trans-stats.component';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { ITransaction } from '../../../interfaces/userInterface';

@Component({
  selector: 'app-transactions',
  imports: [
    ListingTableComponent,
    TransStatsComponent,
    FormsModule,
    SidebarComponent,
    HeaderComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  transactions: ITransaction[] = [];
  transactionColumns = [
    { header: 'Transaction ID', key: '_id', width: '15%' },
    {
      header: 'Buyer',
      key: 'buyer.name',
      width: '15%',
      custom: (row: ITransaction) => ({
        text: row.buyer?.name || 'N/A', // Use optional chaining to avoid errors
        class: '',
      }),
    },
    {
      header: 'Seller',
      key: 'seller.name',
      width: '15%',
      custom: (row: ITransaction) => ({
        text: row.seller?.name || 'N/A', // Use optional chaining to avoid errors
        class: '',
      }),
    },
    {
      header: 'Stock',
      key: 'stock.symbol',
      width: '10%',
      custom: (row: ITransaction) => ({
        text: row.stock?.symbol || 'N/A', // Use optional chaining to avoid errors
        class: '',
      }),
    },
    { header: 'Quantity', key: 'quantity', width: '10%' },
    { header: 'Price', key: 'price', width: '10%' },

    {
      header: 'Date',
      key: 'date',
      width: '15%',
      custom: (row: ITransaction) => ({
        text: new Date(row.createdAt).toLocaleDateString(),
        class: '',
      }),
    },
    { header: 'Status', key: 'status', width: '10%' },
  ];

  constructor(private apiService: AdminApiService) {}

  ngOnInit(): void {
    this.fetchTransactions();
  }
  searchTerm: string = '';
  filters = { type: '', status: '', dateRange: { start: null, end: null } };

  fetchTransactions() {
    const getTransactionSubscription = this.apiService.getAllTrans().subscribe({
      next: (response: IResponseModel<ITransaction[]>) => {
        console.log(response);
        this.transactions = response.data;
      },
      error: (err) => {
        console.error('Error fetching transactions', err);
      },
    });
    this.subscription.add(getTransactionSubscription);
  }
  get transactionStats() {
    const processed = this.processedTransactions;
    return {
      total: processed.length,
      totalVolume: processed.reduce((sum, t) => sum + t.totalAmount, 0),
      buyTransactions: processed.filter(
        (t) => t.type?.trim().toLowerCase() === 'buy'
      ).length,
      sellTransactions: processed.filter(
        (t) => t.type?.trim().toLowerCase() === 'sell'
      ).length,
    };
  }

  get processedTransactions() {
    return this.transactions;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
