import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserHeaderComponent } from '../user-header/user-header.component';
import {
  IStock,
  IPortfolioItem,
  IPortfolioResponseModel,
  IPortfolioSummaryUpdate,
} from '../../../interfaces/interface';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-portfolio',
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css',
})
export class PortfolioComponent implements OnInit, OnDestroy {
  portfolio: IPortfolioItem[] = [];
  summary = {
    totalPortfolioValue: 0,
    overallProfit: 0,
    todaysProfit: 0,
  };
  private subscription = new Subscription();
  selectedStock: IStock | null = null;

  constructor(private apiService: ApiService, private socket: Socket) {}

  ngOnInit(): void {
    this.fetchPortfolio();
    this.socket.on(
      'portfolioSummaryUpdate',
      (data: IPortfolioSummaryUpdate) => {
        this.updatePortfolioSummary(data);
      }
    );
  }

  fetchPortfolio(): void {
    const portfolioSubscription = this.apiService.getPortfolio().subscribe(
      (response: IPortfolioResponseModel) => {
        if (response.data) {
          this.portfolio = response.data.portfolio.map((item: any) => {
            const portfolioItem = item._doc;
            return {
              stock: portfolioItem.stockId,
              quantity: portfolioItem.quantity,
              currentValue: item.currentValue,
              overallProfit: item.overallProfit,
              todaysProfit: item.todaysProfit,
            };
          });

          this.summary.totalPortfolioValue = response.data.totalPortfolioValue;
          this.summary.overallProfit = response.data.overallProfit;
          this.summary.todaysProfit = response.data.todaysProfit;
        }
      },
      (error) => {
        console.error('Error fetching portfolio data:', error);
      }
    );
    this.subscription.add(portfolioSubscription);
  }
  updatePortfolioSummary(data: IPortfolioSummaryUpdate): void {
    this.summary.totalPortfolioValue = data.totalPortfolioValue;
    this.summary.overallProfit = data.overallProfit;
    this.summary.todaysProfit = data.todaysProfit;
  }

  selectStock(stock: IStock): void {
    this.selectedStock = stock;
  }

  closeStockDetails(): void {
    this.selectedStock = null;
  }
  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.subscription.unsubscribe();
  }
}
