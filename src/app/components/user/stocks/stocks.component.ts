import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from '../search/search.component';
import { Router } from '@angular/router';
import { WebsocketService } from '../../../services/websocket.service';
import { Subscription, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AlertService } from '../../../services/alert.service';
import { takeUntil } from 'rxjs/operators';
import {
  IResponseModel,
  IWatchlist,
  IUser,
  IStock,
  IOrder,
  IPortfolioItem,
  Iportfolio,
} from '../../../interfaces/userInterface';
import { AlertModalComponent } from '../../reusable/alert-modal/alert-modal.component';

@Component({
  selector: 'app-stocks',
  imports: [
    CommonModule,
    UserHeaderComponent,
    FormsModule,

    AlertModalComponent,
  ],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css',
})
export class StocksComponent implements OnInit, OnDestroy {
  private socket!: Socket;
  private unsubscribe$ = new Subject<void>();
  stocks: IStock[] = [];
  isSellModalOpen = false;
  isBuyModalOpen = false;
  selectedStock: any = null;
  quantityToSell: number = 1;
  quantityToBuy: number = 1;
  buyPrice: number = 0;
  sellPrice: number = 0;
  orderType: 'MARKET' | 'LIMIT' | 'STOP' = 'MARKET';
  userPortfolio: Iportfolio[] = [];
  userBalance: number = 0;
  isIntraday: boolean = false;
  currentUser: IUser | null = null;

  private subscriptions = new Subscription();
  limits: {
    maxBuyLimit: number;
    maxSellLimit: number;
    timeframeInHours: number;
  } = {
    maxBuyLimit: 1000,
    maxSellLimit: 500,
    timeframeInHours: 24,
  };
  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService,
    private webSocketService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.initializeSocketConnection();
    this.loadInitialData();
  }
  initializeSocketConnection(): void {
    this.webSocketService
      .afterFetchUpdate()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((stocks) => {
        console.log('Stock update received:', stocks);
        this.stocks = stocks;
      });
  }
  loadInitialData(): void {
    this.apiService
      .getInitialData()
      .then(({ stocks, user }) => {
        this.stocks = stocks;
        if (user) {
          this.userBalance = user.balance;
          this.userPortfolio = user.portfolio as unknown as Iportfolio[];
          this.currentUser = user;
        }
      })
      .catch((error) =>
        this.alertService.showAlert('Error loading initial data')
      );
  }

  // private async loadInitialData(): Promise<void> {
  //   try {
  //     // Fetch Istocks, user data, and limits concurrently
  //     const [IstocksResponse, userResponse] = await Promise.all([
  //       this.apiService.getIStocks().toPromise(),
  //       this.apiService.getUserProfile().toPromise(),
  //       // this.apiService.getLimits().toPromise(),
  //     ]);

  //     // Assign fetched data to component properties
  //     this.Istocks = IstocksResponse?.data || [];
  //     this.userBalance = userResponse?.data.balance || 0;
  //     this.userPortfolio = userResponse?.data.portfolio || [];
  //     this.currentUser = userResponse?.data || null;
  //     // this.limits = limitsResponse || this.limits;

  //     // if (limitsResponse) {
  //     //   this.limits = limitsResponse || this.limits;
  //     // } else {
  //     //   console.warn('Limits response is undefined.');
  //     // }
  //   } catch (error) {
  //     throw new Error('Failed to load initial data');
  //   }
  // }

  openSellModal(stock: IStock): void {
    this.selectedStock = stock;
    this.isSellModalOpen = true;
    this.sellPrice = stock.price;
    this.quantityToSell = 1;
  }

  closeSellModal(): void {
    this.isSellModalOpen = false;
    this.selectedStock = null;
  }

  sellStock(): void {
    if (this.quantityToSell > 0 && this.selectedStock) {
      if (this.quantityToSell > this.limits.maxSellLimit) {
        this.alertService.showAlert(
          `You cannot sell more than ${this.limits.maxSellLimit} units at a time.`
        );
        return;
      }

      const IstockInPortfolio = this.userPortfolio.find(
        (item) => item.stockId.symbol === this.selectedStock?.symbol
      );

      if (
        !IstockInPortfolio ||
        IstockInPortfolio.quantity < this.quantityToSell
      ) {
        this.alertService.showAlert('Not enough Istock to sell');
        return;
      }

      const orderData: IOrder = {
        stock: this.selectedStock.originalId,
        type: 'SELL',
        orderType: this.orderType,
        quantity: this.quantityToSell,
        price: this.sellPrice,
        status: 'PENDING',
      };

      this.apiService
        .placeOrder(orderData)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          () => {
            this.alertService.showAlert('Sell order placed successfully.');
            this.closeSellModal();
          },
          (error) => this.alertService.showAlert('Error placing sell order.')
        );
    }
  }

  async updatePortfolioAfterSell(IstockInPortfolio: Iportfolio): Promise<void> {
    const updatedPortfolio = this.userPortfolio
      .map((item) => {
        if (item.stockId.symbol === this.selectedStock.symbol) {
          if (item.quantity === this.quantityToSell) {
            return null;
          } else {
            item.quantity -= this.quantityToSell;
          }
        }
        return item;
      })
      .filter((item) => item !== null);

    const updatedPortfoliosubscription = this.apiService
      .updateUserPortfolio(updatedPortfolio)
      .subscribe({
        next: (data) => {},
        error: (err) => {
          console.error('Error updating portfolio:', err);
        },
      });
    this.subscriptions.add(updatedPortfoliosubscription);
  }

  openBuyModal(stock: IStock): void {
    this.selectedStock = stock;
    this.isBuyModalOpen = true;
    this.buyPrice = stock.price;
  }
  changeStatus() {
    this.isIntraday = true;
  }

  closeBuyModal(): void {
    this.isBuyModalOpen = false;
    this.selectedStock = null;
    this.quantityToBuy = 1;
    this.buyPrice = 0;
    this.isIntraday = false;
  }
  buyStock(): void {
    if (this.quantityToBuy > 0 && this.selectedStock) {
      const totalCost = this.buyPrice * this.quantityToBuy;

      if (this.quantityToBuy > this.limits.maxBuyLimit) {
        this.alertService.showAlert(
          `You cannot buy more than ${this.limits.maxBuyLimit} units at a time.`
        );
        return;
      }

      if (this.isIntraday) {
        const leverage = 5;
        const requiredMargin = totalCost / leverage;

        if (this.userBalance < requiredMargin) {
          this.alertService.showAlert(
            `Insufficient margin. Required: $${requiredMargin.toFixed(
              2
            )}, Available: $${this.userBalance.toFixed(2)}`
          );
          return;
        }
      } else if (this.userBalance < totalCost) {
        this.alertService.showAlert('Insufficient balance to buy Istock.');
        return;
      }

      const orderData: IOrder = {
        stock: this.selectedStock.originalId,
        type: 'BUY',
        orderType: this.orderType,
        quantity: this.quantityToBuy,
        price: this.buyPrice,
        status: 'PENDING',
        isIntraday: this.isIntraday,
      };

      const placeOrderSubscription = this.apiService
        .placeOrder(orderData)
        .subscribe({
          next: () => {
            this.closeBuyModal();

            this.alertService.showAlert('Order placed successfully.');
          },
          error: (err) => {
            console.error('Error buying Istock:', err);
          },
        });
      this.subscriptions.add(placeOrderSubscription);
    }
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.subscriptions.unsubscribe();
  }
  dropdownStates = new Map();

  toggleDropdown(Istock: IStock) {
    const currentState = this.dropdownStates.get(Istock.symbol) || false;
    this.dropdownStates.set(Istock.symbol, !currentState);
  }

  isDropdownOpen(Istock: IStock): boolean {
    return this.dropdownStates.get(Istock.symbol) || false;
  }

  addToStockList(stock: IStock) {
    this.selectedStock = stock;
    console.log(this.selectedStock.originalId);
    const watchlist: IWatchlist = {
      user: this.currentUser,
      stocks: [
        {
          stockId: this.selectedStock.symbol,
          addedAt: new Date(),
        },
      ],
      name: 'My Watchlist',
      createdAt: new Date(),
    };
    const IstockSymbols = stock.symbol;

    this.apiService.addToWatchlist(watchlist).subscribe({
      next: () => {
        this.alertService.showAlert(
          `${IstockSymbols} has been added to your Istock list.`
        );
      },
    });

    this.dropdownStates.set(IstockSymbols, false);
  }
  tradingview(Istock: IStock) {
    const symbol = Istock.symbol;
    this.router.navigate(['/tradingview'], { queryParams: { symbol: symbol } });
  }
  trackByStock(index: number, Istock: IStock): string {
    return Istock.symbol; // or any unique identifier
  }
}
