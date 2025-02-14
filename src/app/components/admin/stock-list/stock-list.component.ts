import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { IStock, IResponseModel } from '../../../interfaces/userInterface';
import { ListingTableComponent } from '../../reusable/listing-table/listing-table.component';
import { WebsocketService } from '../../../services/websocket.service';

@Component({
  selector: 'app-stock-list',
  imports: [HeaderComponent, SidebarComponent, ListingTableComponent],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css',
})
export class StockListComponent {
  stocks: IStock[] = [];
  private subscription = new Subscription();

  tableColumns = [
    { header: 'Symbol', key: 'symbol', sortable: true },
    { header: 'Company Name', key: 'symbol' },
    { header: 'Price', key: 'price' },
    {
      header: 'Change',
      key: 'change',
      custom: (row: IStock) => ({
        text: row.change,
        class: row.change >= 0 ? 'text-green-700' : 'text-red-600',
      }),
    },
    { header: 'Status', key: 'status', custom: () => ({ text: 'active' }) },
  ];

  constructor(
    private apiService: ApiService,
    private webSocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchStocks();
    this.listenForLiveStocks();
  }

  fetchStocks(): void {
    const stocklistSubscription = this.apiService.getStocks().subscribe({
      next: (response: IResponseModel<IStock[]>) => {
        this.stocks = response.data;
      },
      error: (err) => {
        console.error('Error fetching stocks:', err);
      },
    });
    this.subscription.add(stocklistSubscription);
  }
  listenForLiveStocks() {
    const liveUpdatesSubscription = this.webSocketService
      .afterFetchUpdate()
      .subscribe({
        next: (updatedStock: IStock[]) => {
          console.log('updation happened');
          // this.updateStockList(updatedStock);
          this.stocks = [...updatedStock]; // Assigning new reference
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error receiving live updates:', err);
        },
      });
    this.subscription.add(liveUpdatesSubscription);
  }
  // updateStockList(updatedStock: IStock): void {
  //   const index = this.stocks.findIndex(
  //     (stock) => stock.symbol === updatedStock.symbol
  //   );
  //   if (index > -1) {
  //     this.stocks[index] = { ...this.stocks[index], ...updatedStock };
  //   } else {
  //     this.stocks.push(updatedStock);
  //   }
  //   this.cdr.detectChanges();
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
