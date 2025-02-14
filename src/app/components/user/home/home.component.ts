import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import {
  IPortfolioItem,
  IPortfolioResponseModel,
} from '../../../interfaces/userInterface';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { SearchComponent } from '../search/search.component';
import { Socket } from 'ngx-socket-io';
import { CommonModule, NgClass } from '@angular/common';
import { AddMoneyComponent } from '../add-money/add-money.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    UserHeaderComponent,
    CommonModule,
    AddMoneyComponent,
    SearchComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  portfolio: IPortfolioItem[] = [];
  summary = {
    totalPortfolioValue: 0,
    overallProfit: 0,
    todaysProfit: 0,
  };
  private subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private router: Router,
    private socket: Socket
  ) {}
  ngOnInit(): void {
    this.fetchPortfolio();
    this.socket.on('portfolioSummaryUpdate', (data: any) => {
      console.log('connected socket');
      this.updatePortfolioSummary(data);
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  fetchPortfolio(): void {
    const portfolioSubscription = this.apiService.getPortfolio().subscribe(
      (response: IPortfolioResponseModel) => {
        if (response.data) {
          this.portfolio = response.data?.portfolio.map((item: any) => {
            const portfolioItem = item._doc;
            return {
              stock: portfolioItem.stockId,
              quantity: portfolioItem.quantity,
              currentValue: item.currentValue,
              overallProfit: item.overallProfit,
              todaysProfit: item.todaysProfit,
            };
          });

          // Update the summary
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
  updatePortfolioSummary(data: any): void {
    this.summary.totalPortfolioValue = data.totalPortfolioValue;
    this.summary.overallProfit = data.overallProfit;
    this.summary.todaysProfit = data.todaysProfit;
    console.log('Live portfolio summary updated:', this.summary);
  }

  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
  profile() {
    this.router.navigate(['/userProfile']);
  }
  addMoneySidebar() {
    this.router.navigate(['/addmoney']);
  }
  isAddMoneyOpen = false;

  toggleAddMoneySidebar() {
    this.isAddMoneyOpen = !this.isAddMoneyOpen;
  }
}
