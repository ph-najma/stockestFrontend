import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserHeaderComponent } from '../user-header/user-header.component';
import {
  ITrade,
  ITradeData,
  ITradeDetail,
} from '../../../interfaces/userInterface';

@Component({
  selector: 'app-trade-diary',
  imports: [
    CommonModule,
    NgClass,
    MatCardModule,
    MatButtonModule,
    UserHeaderComponent,
    MatIconModule,
    CalendarModule,
    FormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './trade-diary.component.html',
  styleUrl: './trade-diary.component.css',
})
export class TradeDiaryComponent implements OnInit, OnDestroy {
  selectedDate: Date = new Date();
  selectedView = 'daily';
  showTradeDetails = false;
  selectedTrade: ITrade | null = null;
  tradeData: ITradeData = {
    winRate: 0,
    averageWin: 0,
    averageLoss: 0,
    overallPL: 0,
    netPL: 0,
    totalTrades: 0,
    charges: 0,
    brokerage: 0,
    trades: [],
  };
  currentDate = new Date();
  private subscriptions = new Subscription();
  constructor(private apiService: ApiService) {}

  setSelectedView(view: string) {
    this.selectedView = view;
  }
  ngOnInit(): void {
    // this.nitializeTradeData();
    this.fetchdata();
  }
  fetchdata() {
    const selectedDateStr = this.selectedDate.toISOString().split('T')[0]; // Format the selected date as 'YYYY-MM-DD'

    const tradeDiarySubscription = this.apiService
      .getTradeDiary()
      .subscribe((response: { data: ITradeData }) => {
        if (response.data && response.data.trades) {
          this.tradeData = response.data;
          this.filterTradesByDate(selectedDateStr);
        }
      });
    this.subscriptions.add(tradeDiarySubscription);
  }
  filterTradesByDate(selectedDateStr: string) {
    const selectedTradeData = this.tradeData.trades.filter(
      (trade: ITrade) => trade.date === selectedDateStr
    );
    if (selectedTradeData.length > 0) {
      this.selectedTrade = selectedTradeData[0]; // Set the selected trade
      this.showTradeDetails = true;
    } else {
      this.selectedTrade = null; // No trade data for this day
      this.showTradeDetails = false;
    }
  }
  onDayClick(day: number) {
    const selectedDateStr = `${this.selectedDate.getFullYear()}-${
      this.selectedDate.getMonth() + 1
    }-${day}`;
    this.selectedDate = new Date(selectedDateStr);
    this.fetchdata();
  }

  getTradeSummary(field: string) {
    const selectedDateStr = this.selectedDate.toISOString().split('T')[0];

    const selectedTradeData = this.tradeData.trades.filter(
      (trade: ITrade) => trade.date === selectedDateStr
    );

    if (selectedTradeData.length > 0) {
      this.selectedTrade = selectedTradeData[0];
      this.showTradeDetails = true;
    } else {
      this.selectedTrade = null;
      this.showTradeDetails = false;
    }
  }

  prevMonth() {
    this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);
  }

  nextMonth() {
    this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);
  }

  getMonthYear(date: Date): string {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  getDaysInMonth(date: Date) {
    const numDays = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    let days = Array(numDays)
      .fill(null)
      .map((_, idx) => idx + 1);
    return days;
  }

  handleTradeClick(trade: any) {
    this.selectedTrade = trade;
    this.showTradeDetails = true;
  }

  setShowTradeDetails(show: boolean) {
    this.showTradeDetails = show;
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe;
  }
}
