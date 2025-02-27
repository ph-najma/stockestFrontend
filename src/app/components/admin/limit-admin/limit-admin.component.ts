import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';

import { CommonModule } from '@angular/common';
import { ILimit } from '../../../interfaces/userInterface';
@Component({
  selector: 'app-limit-admin',
  imports: [
    FormsModule,
    HeaderComponent,
    RouterModule,
    SidebarComponent,
    CommonModule,
  ],
  templateUrl: './limit-admin.component.html',
  styleUrl: './limit-admin.component.css',
})
export class LimitAdminComponent implements OnInit, OnDestroy {
  limit = {
    maxBuyLimit: 1000,
    maxSellLimit: 500,
    timeframeInHours: 24,
  };

  errors = {
    maxBuyLimit: '',
    maxSellLimit: '',
    timeframeInHours: '',
  };

  private subscription = new Subscription();
  isChanged = false;
  saveStatus: 'idle' | 'success' | 'error' = 'idle';
  isDialogOpen = false;

  constructor(private apiService: AdminApiService) {}

  ngOnInit(): void {
    this.fetchLimits();
  }

  validateField(fieldName: string, value: number): string {
    if (value <= 0) {
      return `${fieldName} must be greater than 0.`;
    }
    return '';
  }

  validateLimits(): boolean {
    this.errors.maxBuyLimit = this.validateField(
      'Maximum Buy Limit',
      this.limit.maxBuyLimit
    );
    this.errors.maxSellLimit = this.validateField(
      'Maximum Sell Limit',
      this.limit.maxSellLimit
    );
    this.errors.timeframeInHours = this.validateField(
      'Timeframe (Hours)',
      this.limit.timeframeInHours
    );

    return (
      !this.errors.maxBuyLimit &&
      !this.errors.maxSellLimit &&
      !this.errors.timeframeInHours
    );
  }

  handleInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;

    this.limit = {
      ...this.limit,
      [name]: Number(value),
    };

    this.isChanged = true;
    this.validateLimits();
  }

  handleSaveLimits(): void {
    if (!this.validateLimits()) {
      this.saveStatus = 'error';
      this.isDialogOpen = true;
      return;
    }

    const newLimitSubscription = this.apiService
      .saveLimits(this.limit)
      .subscribe({
        next: (response) => {
          this.limit = response.data;
          this.saveStatus = 'success';
          this.isChanged = false;
          this.isDialogOpen = true;
        },
        error: () => {
          this.saveStatus = 'error';
          this.isDialogOpen = true;
        },
      });
    this.subscription.add(newLimitSubscription);
  }

  fetchLimits(): void {
    const limitSubscription = this.apiService.getLimits().subscribe({
      next: (response) => {
        this.limit = response.data;
      },
      error: (err) => {
        console.error('Failed to fetch limits:', err);
        this.saveStatus = 'error';
      },
    });
    this.subscription.add(limitSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
