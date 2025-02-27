import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FilterComponent } from '../filter/filter.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ConfirmationComponent } from '../../reusable/confirmation/confirmation.component';
import { Subscription } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { IOrder, IResponseModel } from '../../../interfaces/userInterface';
import { RouterModule } from '@angular/router';
import { IFilter } from '../../../interfaces/userInterface';
@Component({
  selector: 'app-market-orders',
  imports: [
    SidebarComponent,
    HeaderComponent,
    CommonModule,
    FormsModule,
    ConfirmationComponent,
    RouterModule,
    FilterComponent,
  ],
  templateUrl: './market-orders.component.html',
  styleUrl: './market-orders.component.css',
})
export class MarketOrdersComponent {
  marketOrders: IOrder[] = [];
  allOrders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  filters: IFilter = {
    status: 'all',
    user: '',
    dateRange: '',
  };
  showModal = false;
  selectedOrderId: string | undefined = undefined;
  private subscriptions = new Subscription();

  constructor(
    private apiService: AdminApiService,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }
  sanitizeInput(input: string): string {
    return input.replace(/[<>\/'";]/g, '').trim();
  }

  fetchOrders(): void {
    const marketOrderSubscription = this.apiService
      .getMarketOrders({})
      .subscribe(
        (response: IResponseModel<IOrder[]>) => {
          this.allOrders = response.data;
          this.filteredOrders = [...this.allOrders];
          this.marketOrders = [...this.allOrders];
        },
        (error) => {
          console.error('Error fetching market orders', error);
        }
      );
    this.subscriptions.add(marketOrderSubscription);
  }

  applyFilters(): void {
    this.filters.user = this.sanitizeInput(this.filters.user);
    this.marketOrders = this.allOrders.filter((order) => {
      const matchesStatus =
        this.filters.status === 'all' || order.status === this.filters.status;
      const matchesUser =
        !this.filters.user ||
        order.user?.name
          .toLowerCase()
          .includes(this.filters.user.toLowerCase());
      const matchesDateRange =
        !this.filters.dateRange ||
        (order.createdAt &&
          new Date(order.createdAt).toLocaleDateString() ===
            new Date(this.filters.dateRange).toLocaleDateString());
      return matchesStatus && matchesUser && matchesDateRange;
    });
  }

  confirmCancel(orderId: string | undefined): void {
    this.selectedOrderId = orderId;
    this.showModal = true;
  }

  handleConfirm(): void {
    if (this.selectedOrderId) {
      const cancelOrderSubscription = this.apiService
        .cancelOrder(this.selectedOrderId)
        .subscribe(() => {
          const orderIndex = this.marketOrders.findIndex(
            (order) => order._id === this.selectedOrderId
          );
          if (orderIndex !== -1) {
            this.marketOrders = [
              ...this.marketOrders.slice(0, orderIndex),
              { ...this.marketOrders[orderIndex], status: 'FAILED' },
              ...this.marketOrders.slice(orderIndex + 1),
            ];
            this.cdRef.detectChanges();
          }
          this.selectedOrderId = undefined;
        });
      this.subscriptions.add(cancelOrderSubscription);
    }
    this.showModal = false;
  }

  handleCancel(): void {
    this.selectedOrderId = undefined;
    this.showModal = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
