import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import {
  IOrder,
  IResponseModel,
  ITransaction,
  IorderAndIIransaction,
} from '../../../interfaces/interface';
@Component({
  selector: 'app-view-details',
  imports: [SidebarComponent, HeaderComponent, RouterModule, CommonModule],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.css',
})
export class ViewDetailsComponent implements OnInit, OnDestroy {
  orderDetails: IOrder | null = null;
  transactions: ITransaction[] = [];
  private susbcription = new Subscription();
  constructor(
    private route: ActivatedRoute,
    private apiService: AdminApiService
  ) {}
  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.getOrderDetails(orderId);
    }
  }
  getOrderDetails(orderId: string): void {
    const OrderSubscription = this.apiService
      .getOrderById(orderId)
      .subscribe((res: IResponseModel<IorderAndIIransaction>) => {
        if (res.data.order) {
          this.orderDetails = res.data.order;
        }
        this.transactions = res.data.transaction;
      });
    this.susbcription.add(OrderSubscription);
  }
  ngOnDestroy(): void {
    this.susbcription.unsubscribe();
  }
}
