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
} from '../../../interfaces/interface';

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
  selectedDay: number | null = null;
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
    console.log(this.selectedDate);
    const selectedDateStr = this.selectedDate.toISOString().split('T')[0]; // Format the selected date as 'YYYY-MM-DD'

    const tradeDiarySubscription = this.apiService
      .getTradeDiary()
      .subscribe((response: { data: ITradeData }) => {
        if (response.data && response.data.trades) {
          this.tradeData = response.data;
          console.log('API Response:', response.data);
          this.filterTradesByDate(selectedDateStr);
        } else {
          console.log('No trade data available for:', selectedDateStr);
          this.tradeData = { ...this.tradeData, trades: [] }; // Reset trades if no data
          this.selectedTrade = null;
          this.showTradeDetails = false;
        }
      });
    this.subscriptions.add(tradeDiarySubscription);
  }
  filterTradesByDate(selectedDateStr: string) {
    console.log('Filtering trades for:', selectedDateStr);

    const selectedTradeData = this.tradeData.trades.filter((trade: ITrade) => {
      const tradeDate = new Date(trade.date).toISOString().split('T')[0]; // Convert trade date to YYYY-MM-DD
      return tradeDate === selectedDateStr;
    });

    if (selectedTradeData.length > 0) {
      this.selectedTrade = selectedTradeData[0];
      console.log('Selected Trade Summary:', this.selectedTrade);
      this.showTradeDetails = true;
    } else {
      this.selectedTrade = null;
      this.showTradeDetails = false;
    }
  }

  onDayClick(day: number) {
    const month = this.selectedDate.getMonth() + 1; // Ensure months are 2-digit
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    const selectedDateStr = `${this.selectedDate.getFullYear()}-${formattedMonth}-${formattedDay}`;
    if (day !== null) {
      this.selectedDay = day;
    }
    this.selectedDate = new Date(selectedDateStr);
    this.fetchdata();
  }

  getTradeSummary(field: string) {
    console.log('Getting summary for:', field, this.tradeData);
    const selectedDateStr = this.selectedDate.toISOString().split('T')[0];

    const selectedTradeData = this.tradeData.trades.filter(
      (trade: ITrade) => trade.date === selectedDateStr
    );

    if (selectedTradeData.length > 0) {
      this.selectedTrade = selectedTradeData[0];
      console;
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
