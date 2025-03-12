import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { IStock } from '../../../interfaces/interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WebsocketService } from '../../../services/websocket.service';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watchlist',
  imports: [CommonModule, UserHeaderComponent, FontAwesomeModule, RouterModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
})
export class WatchlistComponent implements OnInit, OnDestroy {
  stocks: IStock[] = [];
  watchlistSymbols: string[] = [];
  subscription!: Subscription;
  constructor(
    private apiService: ApiService,
    private websocketService: WebsocketService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.fetchWatchlist();
  }
  fetchWatchlist() {
    this.apiService.getWatchlist().subscribe((res) => {
      this.stocks = res.data.stocks;
      this.watchlistSymbols = res.data.stocks.map(
        (stockItem) => stockItem.symbol
      );

      this.websocketService.emit('subscribeWatchlist', this.watchlistSymbols);

      this.subscribeToStockUpdates();
    });
  }
  subscribeToStockUpdates() {
    this.subscription = this.websocketService
      .listen<IStock[]>('WatchlistStockUpdate')
      .subscribe((updatedStocks) => {
        console.log('📈 Live Watchlist Data:', updatedStocks);
        this.stocks = updatedStocks;
        this.cdr.detectChanges();
      });
  }

  trackStock(index: number, stock: IStock) {
    return stock.symbol;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
