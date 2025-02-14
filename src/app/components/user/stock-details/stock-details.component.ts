import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { ApiService } from '../../../services/api.service';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IStock } from '../../../interfaces/userInterface';

@Component({
  selector: 'app-stock-details',
  imports: [CommonModule, RouterModule, UserHeaderComponent, DatePipe],
  templateUrl: './stock-details.component.html',
  styleUrl: './stock-details.component.css',
})
export class StockDetailsComponent implements OnInit, OnDestroy {
  stocks: IStock[] = [];
  symbol: string = '';
  constructor(private apiService: ApiService, private route: ActivatedRoute) {}
  private subscription = new Subscription();
  ngOnInit(): void {
    this.symbol = this.route.snapshot.paramMap.get('symbol')!;
    this.fetchdata();
  }
  fetchdata() {
    const historicalDataSubscription = this.apiService
      .getHistroical(this.symbol)
      .subscribe((response) => {
        this.stocks = response.data;
      });
    this.subscription.add(historicalDataSubscription);
  }

  get isPositiveChange(): boolean {
    return this.stocks.length > 0 && this.stocks[0].change >= 0;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
