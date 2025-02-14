import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { IOrder } from '../../../interfaces/userInterface';

@Component({
  selector: 'app-order-management',
  imports: [HeaderComponent, SidebarComponent, RouterModule, CommonModule],
  templateUrl: './order-management.component.html',
  styleUrl: './order-management.component.css',
})
export class OrderManagementComponent implements OnInit, OnDestroy {
  orders: IOrder[] = [];
  filteredOrders: IOrder[] = [];
  currentFilter: string = 'PENDING';
  private subscription = new Subscription();

  constructor(private apiService: AdminApiService) {}
  ngOnInit(): void {
    this.fetchOrders();
  }
  fetchOrders(): void {
    const getOrderSubscription = this.apiService.getOrders().subscribe(
      (response) => {
        this.orders = response.data;
        this.filterOrders(this.currentFilter);
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
    this.subscription.add(getOrderSubscription);
  }
  filterOrders(status: string): void {
    this.currentFilter = status;
    this.filteredOrders = this.orders.filter(
      (order) => order.status === this.currentFilter
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
