import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  IStock,
  ITransaction,
  ISymbolInfo,
  IBar,
} from '../../../interfaces/userInterface';
declare var TradingView: any;

@Component({
  selector: 'app-trading-view',
  imports: [],
  templateUrl: './trading-view.component.html',
  styleUrl: './trading-view.component.css',
})
export class TradingViewComponent {
  private socket: Socket;
  private chart: any;
  private stockData: IStock[] = [];
  private transactions: ITransaction[] = [];
  private subscription = new Subscription();
  constructor(private apiService: ApiService, private route: ActivatedRoute) {
    this.socket = io(environment.apiUrl, {
      transports: ['websocket', 'polling'],
    });
  }
  ngOnInit(): void {
    this.socket = io(environment.apiUrl, {
      transports: ['websocket', 'polling'],
    });
    // Check connection status
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id); // Ensure the client connects
    });

    // Listen for stock updates
    this.socket.on('stock-update', (update: IStock) => {
      console.log('Stock update received:', update); // Log updates from the server
      const bar = this.createBarFromUpdate(update);
      this.chart.updateData([bar]);
    });

    // Listen for transaction updates
    this.socket.on('transaction-update', (transaction: ITransaction) => {
      console.log('Transaction update received:', transaction);
      const transactionBar = this.createTransactionBar(transaction);
      this.chart.updateData([transactionBar]);
    });
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe((params) => {
      const symbol = params['symbol'] || 'AAPL';
      this.loadTradingViewWidget(symbol);
    });
  }

  private loadTradingViewWidget(symbol: string): void {
    // Fetch stock data
    const getStockDataSubscription = this.apiService
      .getStockData(symbol)
      .subscribe(
        (response) => {
          this.stockData = response;
          console.log(this.stockData);
          // Fetch transaction data
          const getTransactionsSubscription = this.apiService
            .getTransaction(symbol)
            .subscribe(
              (transactions: { data: ITransaction[] }) => {
                this.transactions = transactions.data;

                console.log(transactions);
                this.initializeTradingViewWidget(symbol);
              },
              (error: any) => {
                console.error('Error fetching transactions:', error);
              }
            );
          this.subscription.add(getTransactionsSubscription);
        },
        (error) => {
          console.error('Error fetching stock data:', error);
        }
      );
    this.subscription.add(getStockDataSubscription);
  }

  private initializeTradingViewWidget(symbol: string): void {
    this.chart = new TradingView.widget({
      container_id: 'tradingview-widget-container',
      symbol: symbol,
      interval: 'D',
      theme: 'light',
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      autosize: true,
      datafeed: {
        onReady: (
          cb: (config: { supported_resolutions: string[] }) => void
        ) => {
          setTimeout(() => cb({ supported_resolutions: ['D'] }), 0);
        },
        resolveSymbol: (
          symbolName: string,
          onSymbolResolvedCallback: (symbolInfo: ISymbolInfo) => void
        ) => {
          onSymbolResolvedCallback({
            name: symbolName,
            ticker: symbolName,
            type: 'stock',
            session: '0900-1600',
            timezone: 'America/New_York',
            supported_resolutions: ['D'],
            has_intraday: false,
            has_no_volume: false,
          });
          console.log('this is stcok data', this.stockData);
        },
        getBars: (
          symbolInfo: ISymbolInfo,
          resolution: string,
          rangeStartDate: number,
          rangeEndDate: number,
          onHistoryCallback: (bars: IBar[], meta: { noData: boolean }) => void
        ) => {
          console.log('getBars called with:', {
            symbolInfo,
            resolution,
            rangeStartDate,
            rangeEndDate,
          });
          console.log(this.stockData);
          const bars = this.mapDataToBars(this.stockData);
          console.log('Mapped bars:', this.mapDataToBars(this.stockData));

          console.log('Historical bars sent to the chart:', bars);

          onHistoryCallback(bars, { noData: bars.length === 0 });
        },
        subscribeBars: (
          symbolInfo: ISymbolInfo,
          resolution: string,
          onRealtimeCallback: (bar: IBar) => void
        ) => {
          this.handleRealtimeUpdates(onRealtimeCallback);
        },
        unsubscribeBars: () => {
          // Handle unsubscription logic if necessary
        },
      },
    });
  }

  private mapDataToBars(data: IStock[]): IBar[] {
    return data.map((item) => ({
      time: new Date(item.timestamp).getTime() / 1000, // UNIX timestamp
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));
  }

  private handleRealtimeUpdates(onRealtimeCallback: (bar: any) => void): void {
    // Listen to stock data updates via socket
    this.socket.on('stock-update', (update: IStock) => {
      console.log('Stock update received:', update);
      const bar = this.createBarFromUpdate(update);
      onRealtimeCallback(bar);
    });

    // Listen to transaction updates via socket
    this.socket.on('transaction-update', (transaction: ITransaction) => {
      console.log('Received transaction-update event:', transaction);
      const transactionBar = this.createTransactionBar(transaction);
      onRealtimeCallback(transactionBar);
    });
  }

  private createBarFromUpdate(update: IStock) {
    return {
      time: new Date(update.timestamp).getTime() / 1000,
      open: update.open,
      high: update.high,
      low: update.low,
      close: update.close,
      volume: update.volume,
    };
  }

  private createTransactionBar(transaction: ITransaction) {
    const bar = {
      time: new Date(transaction.createdAt).getTime() / 1000,
      open: transaction.price,
      high: transaction.price,
      low: transaction.price,
      close: transaction.price,
      volume: transaction.quantity,
    };

    return bar;
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.subscription.unsubscribe();
  }
}
