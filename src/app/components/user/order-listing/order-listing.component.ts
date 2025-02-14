import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Subscription } from 'rxjs';
import {
  IOrder,
  IOrderResponseData,
  IResponseModel,
} from '../../../interfaces/userInterface';

@Component({
  selector: 'app-order-listing',
  imports: [FormsModule, CommonModule, DatePipe, UserHeaderComponent],
  templateUrl: './order-listing.component.html',
  styleUrl: './order-listing.component.css',
})
export class OrderListingComponent implements OnInit, OnDestroy {
  orderData: IOrder[] = [];
  completedOrdersCount: number = 0;
  pendingOrdersCount: number = 0;
  failedOrdersCount: number = 0;
  currentPage: number = 1;
  totalOrders: number = 0;
  totalPages: number = 1;
  limit: number = 10;
  private subcription = new Subscription();
  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchOrderDetails(this.currentPage);
  }

  fetchOrderDetails(page: number): void {
    const OrderDetailsSubscription = this.apiService
      .getOrderByUserId(page, this.limit)
      .subscribe({
        next: (response: IResponseModel<IOrderResponseData>) => {
          this.orderData = response.data.orders;
          this.totalOrders = response.data.totalOrders;
          this.totalPages = response.data.totalPages;
          this.calculateOrderCounts();
        },
        error: (error) => {
          console.error('Error fetching orders:', error);
        },
      });
    this.subcription.add(OrderDetailsSubscription);
  }
  calculateOrderCounts() {
    this.completedOrdersCount = this.orderData.filter(
      (order) => order.status === 'COMPLETED'
    ).length;
    this.pendingOrdersCount = this.orderData.filter(
      (order) => order.status === 'PENDING'
    ).length;
    this.failedOrdersCount = this.orderData.filter(
      (order) => order.status === 'FAILED'
    ).length;
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchOrderDetails(page);
    }
  }
  ngOnDestroy(): void {
    this.subcription.unsubscribe();
  }
}
