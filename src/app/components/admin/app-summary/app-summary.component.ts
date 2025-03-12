import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { AdminApiService } from '../../../services/admin-api.service';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { IResponseModel } from '../../../interfaces/interface';

@Component({
  selector: 'app-app-summary',
  imports: [
    SidebarComponent,
    RouterModule,
    HeaderComponent,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './app-summary.component.html',
  styleUrl: './app-summary.component.css',
})
export class AppSummaryComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  constructor(private apiService: AdminApiService) {}
  feeStructure = {
    standardCommissionRate: 1,
    flatTransactionFee: 5.0,
    volumeDiscounts: [{ minVolume: 100, maxVolume: 500, discountRate: 0.02 }],
  };

  promotions = [
    {
      id: 1,
      name: 'New Trader Discount',
      type: 'Percentage Reduction',
      discountValue: 20,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  ];
  // Fee collection summary data
  feeSummary = {
    totalFeesCollected: 12345.67,
    periodStart: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    periodEnd: new Date(),
  };

  ngOnInit(): void {
    this.getFees();
  }
  getFees() {
    const getTotalFessSubscription = this.apiService.getTotalFees().subscribe({
      next: (response: IResponseModel<number>) => {
        this.feeSummary.totalFeesCollected = response.data;
      },
    });
    this.subscription.add(getTotalFessSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  generateReport() {}
  addPromotion() {}
}
