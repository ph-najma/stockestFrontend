import { Component, OnInit, OnDestroy } from '@angular/core';
import { PortfolioHoldingsComponent } from '../portfolio-holdings/portfolio-holdings.component';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  IPortfolioResponse,
  IPortfolioItem,
  IPortfolioResponseModel,
} from '../../../interfaces/userInterface';
import { AdminApiService } from '../../../services/admin-api.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-user-portfolio',
  imports: [
    PortfolioHoldingsComponent,
    CommonModule,
    FormsModule,
    UpperCasePipe,
    HeaderComponent,
    RouterModule,
    SidebarComponent,
  ],
  templateUrl: './user-portfolio.component.html',
  styleUrl: './user-portfolio.component.css',
})
export class UserPortfolioComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  userPortfolioData: IPortfolioResponse | null = null;
  totalPortfolioValue: number = 0;
  private subscription = new Subscription();
  constructor(
    private apiService: AdminApiService,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
    });
  }
  ngOnInit(): void {
    this.fetchPortfolio();
  }

  fetchPortfolio(): void {
    if (this.userId) {
      const portfolioSubscription = this.apiService
        .getUserPortfolio(this.userId)
        .subscribe({
          next: (response: IPortfolioResponseModel) => {
            console.log(response);
            this.userPortfolioData = response.data;
            if (this.userPortfolioData) {
              this.userPortfolioData.portfolio =
                this.userPortfolioData.portfolio || [];
              this.userPortfolioData.portfolio.forEach(
                (holding: IPortfolioItem) => {
                  holding.currentValue = holding.quantity * holding.stock.price;
                }
              );
              this.totalPortfolioValue =
                this.userPortfolioData.portfolio.reduce(
                  (total: number, holding: IPortfolioItem) =>
                    total + (holding.currentValue || 0),
                  0
                );
              this.subscription.add(portfolioSubscription);
            }
          },
          error: (err: any) => {
            console.error('Error fetching portfolio data:', err);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  activeView: string = 'holdings';

  setActiveView(view: string) {
    this.activeView = view;
  }
}
