import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { IResponseModel, IStock } from '../../../interfaces/userInterface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WebsocketService } from '../../../services/websocket.service';
import {
  faStar,
  faArrowUp,
  faArrowDown,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { RouterModule } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { AlertService } from '../../../services/alert.service';
import { Subscription } from 'rxjs';
import { SearchComponent } from '../search/search.component';
import { environment } from '../../../../environments/environment';

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
      console.log('Watchlist response:', res);
      this.stocks = res.data.stocks;
      this.watchlistSymbols = res.data.stocks.map(
        (stockItem) => stockItem.symbol
      );

      // Send watchlist symbols to the WebSocket server
      this.websocketService.emit('subscribeWatchlist', this.watchlistSymbols);

      // Listen for live stock updates
      this.subscribeToStockUpdates();
    });
  }
  subscribeToStockUpdates() {
    this.subscription = this.websocketService
      .listen<IStock[]>('WatchlistStockUpdate') // 👈 Explicitly define type
      .subscribe((updatedStocks) => {
        console.log('📈 Live Watchlist Data:', updatedStocks);
        this.stocks = updatedStocks;
        this.cdr.detectChanges(); // Ensure UI updates
      });
  }

  trackStock(index: number, stock: IStock) {
    return stock.symbol;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
  }
}
