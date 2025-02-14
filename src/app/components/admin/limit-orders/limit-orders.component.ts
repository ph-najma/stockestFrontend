import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmationComponent } from '../../reusable/confirmation/confirmation.component';
import { Subscription } from 'rxjs';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { IOrder } from '../../../interfaces/userInterface';
import { AdminApiService } from '../../../services/admin-api.service';
import { FilterComponent } from '../filter/filter.component';
import { IResponseModel } from '../../../interfaces/userInterface';
import { IFilter } from '../../../interfaces/userInterface';
@Component({
  selector: 'app-limit-orders',
  imports: [
    HeaderComponent,
    SidebarComponent,
    RouterModule,
    FormsModule,
    ConfirmationComponent,
    CurrencyPipe,
    FilterComponent,
    CommonModule,
  ],
  templateUrl: './limit-orders.component.html',
  styleUrl: './limit-orders.component.css',
})
export class LimitOrdersComponent {
  orders: IOrder[] = [];
  allOrders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  filters: IFilter = {
    status: 'all',
    user: '',
    dateRange: '',
  };
  showModal = false;
  selectedOrderId: string | undefined = undefined;
  private subscription = new Subscription();
  ngOnInit(): void {
    this.fetchOrders();
  }

  constructor(
    private apiService: AdminApiService,
    private cdRef: ChangeDetectorRef
  ) {}
  fetchOrders(): void {
    const marketOrderSubscription = this.apiService
      .getLimitOrders({})
      .subscribe(
        (response: IResponseModel<IOrder[]>) => {
          this.allOrders = response.data;
          this.filteredOrders = [...this.allOrders];
          this.orders = [...this.allOrders];
        },
        (error) => {
          console.error('Error fetching market orders', error);
        }
      );
    this.subscription.add(marketOrderSubscription);
  }

  applyFilters(): void {
    this.orders = this.allOrders.filter((order) => {
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
          const orderIndex = this.orders.findIndex(
            (order) => order._id === this.selectedOrderId
          );
          if (orderIndex !== -1) {
            this.orders = [
              ...this.orders.slice(0, orderIndex),
              { ...this.orders[orderIndex], status: 'FAILED' },
              ...this.orders.slice(orderIndex + 1),
            ];
            this.cdRef.detectChanges();
          }
          this.selectedOrderId = undefined;
        });
      this.subscription.add(cancelOrderSubscription);
    }
    this.showModal = false;
  }
  handleCancel(): void {
    this.selectedOrderId = undefined;
    this.showModal = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
