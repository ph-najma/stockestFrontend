import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Subscription } from 'rxjs';
import { IUser } from '../../../interfaces/userInterface';
import { AdminApiService } from '../../../services/admin-api.service';
import { Router } from '@angular/router';
import { AlertService } from '../../../services/alert.service';
import { ListingTableComponent } from '../../reusable/listing-table/listing-table.component';
import { AlertModalComponent } from '../../reusable/alert-modal/alert-modal.component';

@Component({
  selector: 'app-user-list',
  imports: [
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    ListingTableComponent,
    AlertModalComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users: IUser[] = [];
  currentPage: number = 1;
  totalUsers: number = 0;
  totalPages: number = 1;
  limit: number = 10;
  columns: any[] = [];
  private subscription = new Subscription();
  constructor(
    private apiService: AdminApiService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
    this.fetchUsers(this.currentPage);
  }

  initializeColumns() {
    this.columns = [
      { header: 'Email', key: 'email', sortable: true },
      { header: 'Registration Date', key: 'createdAt', sortable: true },
      {
        header: 'Account Status',
        key: 'is_Blocked',
        sortable: false,
        custom: (row: IUser) =>
          row.is_Blocked
            ? { class: 'text-red-500', text: 'Blocked' }
            : { class: 'text-green-500', text: 'Active' },
      },
      {
        header: 'Actions',
        key: 'actions',
        custom: (row: IUser) => `
          <button (click)="disableUser('${row._id}', ${row.is_Blocked})"
            class="bg-blue-700 text-white py-1 px-2 rounded-md hover:bg-blue-800">
            ${row.is_Blocked ? 'Enable' : 'Disable'}
          </button>
          <button (click)="viewPortfolio('${row._id}')"
            class="bg-blue-700 text-white py-1 px-2 rounded-md hover:bg-blue-800">
            View Portfolio
          </button>
        `,
      },
    ];
  }

  fetchUsers(page: number) {
    const userListSubscription = this.apiService
      .userList(page, this.limit)
      .subscribe(
        (response) => {
          this.users = response.data.usersData;
          this.totalUsers = response.data.totalUsers;
          this.totalPages = response.data.totalPages;
        },
        (error) => {
          console.error('Error fetching users ', error);
        }
      );
    this.subscription.add(userListSubscription);
  }

  disableUser(userId: string, is_Blocked: boolean) {
    const disableUseSubscription = this.apiService
      .disableUser(userId)
      .subscribe({
        next: () => {
          this.alertService.showAlert(
            `User ${is_Blocked ? 'enabled' : 'disabled'} successfully`
          );
          const userIndex = this.users.findIndex((user) => user._id == userId);
          if (userIndex !== -1) {
            this.users[userIndex].is_Blocked = !is_Blocked;
          }
        },
        error: (err) => {
          console.error(
            `Error ${is_Blocked ? 'enabling' : 'disabling'} user:`,
            err
          );
          alert(`Failed to ${is_Blocked ? 'enable' : 'disable'} the user.`);
        },
      });
    this.subscription.add(disableUseSubscription);
  }

  viewPortfolio(userId: string) {
    this.router.navigate(['portfolioAdmin', userId]);
  }

  // goToPage(page: number): void {
  //   if (page >= 1 && page <= this.totalPages) {
  //     this.currentPage = page;
  //     this.fetchUsers(page);
  //   }
  // }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.fetchUsers(page);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
