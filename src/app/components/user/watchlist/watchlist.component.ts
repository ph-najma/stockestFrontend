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
import { environment } from '../../../../enviornments/enviornment';

@Component({
  selector: 'app-watchlist',
  imports: [CommonModule, UserHeaderComponent, FontAwesomeModule, RouterModule],
  templateUrl: './watchlist.component.html',
  styleUrl: './watchlist.component.css',
})
export class WatchlistComponent implements OnInit, OnDestroy {
  stocks: IStock[] = [];
  private socket!: Socket;
  private subscriptions = new Subscription();

  constructor(
    private apiService: ApiService,
    private socketService: WebsocketService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchWatchlist();
    this.initializeSocketConnection();
  }

  fetchWatchlist(): void {
    const watchlistSubscription = this.apiService.getWatchlist().subscribe({
      next: (response: IResponseModel<IStock[]>) => {
        this.stocks = response.data.filter(
          (stock: IStock) => stock.id && stock.symbol
        );
      },
      error: (err) => {
        console.error('Error fetching watchlist:', err);
        this.alertService.showAlert('Error fetching watchlist');
      },
    });
    this.subscriptions.add(watchlistSubscription);
  }

  initializeSocketConnection(): void {
    this.socket = io(environment.apiUrl);
    this.socket.on('stockUpdate', (updatedStocks: IStock[]) => {
      updatedStocks.forEach((updatedStock) => {
        const stockIndex = this.stocks.findIndex(
          (stock) => stock.symbol === updatedStock.symbol
        );
        if (stockIndex !== -1) {
          this.stocks[stockIndex] = {
            ...this.stocks[stockIndex],
            ...updatedStock,
          };
        }
      });
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.subscriptions.unsubscribe();
  }
}
