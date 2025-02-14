import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  menuItems = [
    { icon: 'home', label: 'Dashboard', path: '/' },
    { icon: 'users', label: 'Users', path: '/userList' },
    { icon: 'chart-line', label: 'Stocks', path: '/list' },
    {
      icon: 'shopping-cart',
      label: 'Order Management',
      path: '/ordermanagement',
    },
    { icon: 'receipt', label: 'Transactions', path: '/allTransactions' },
    { icon: 'wallet', label: 'Transaction Fees', path: '/transactions' },
    { icon: 'cogs', label: 'Set Limits', path: '/limit' },
    { icon: 'gift', label: 'Set Promotions', path: '/promotions' },
    { icon: 'play', label: 'Create Session', path: '/createSession' },
    { icon: 'list', label: 'Session', path: '/sessions' },
  ];
}
