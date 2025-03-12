import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
interface Notification {
  message: string;
  type: string;
  timestamp: Date;
}
@Component({
  selector: 'app-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  ngOnInit(): void {
    this.notifications = [
      {
        message:
          'You sold 10 shares of AAPL at $198.45. Amount credited: $1974.50',
        type: 'TRADE_SUCCESS',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        message:
          'You sold 5 shares of TSLA at $242.10. Amount credited: $1200.50',
        type: 'TRADE_SUCCESS',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        message:
          'You sold 15 shares of MSFT at $420.75. Amount credited: $6301.25',
        type: 'TRADE_SUCCESS',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
    ];

    // Simulate new notification after 5 seconds
    setTimeout(() => {
      const newNotification: Notification = {
        message:
          'You sold 8 shares of NVDA at $950.20. Amount credited: $7561.60',
        type: 'TRADE_SUCCESS',
        timestamp: new Date(),
      };
      this.notifications.unshift(newNotification);
    }, 5000);
  }

  formatTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    if (diff < 1000 * 60) {
      return 'Just now';
    } else if (diff < 1000 * 60 * 60) {
      return `${Math.floor(diff / (1000 * 60))}m ago`;
    } else if (diff < 1000 * 60 * 60 * 24) {
      return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    } else {
      return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
    }
  }
}
