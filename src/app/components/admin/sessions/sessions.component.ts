import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ListingTableComponent } from '../../reusable/listing-table/listing-table.component';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import {
  IResponseModel,
  ISessionDetails,
} from '../../../interfaces/userInterface';
@Component({
  selector: 'app-sessions',
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    ListingTableComponent,
  ],
  templateUrl: './sessions.component.html',
  styleUrl: './sessions.component.css',
})
export class SessionsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  sessions: ISessionDetails[] = [];

  columns = [
    { key: 'instructor_name', header: 'Instructor', width: '15%' },
    { key: 'specialization', header: 'Specialization', width: '15%' },
    { key: 'hourly_rate', header: 'Hourly Rate ($)', width: '10%' },
    { key: 'start_time', header: 'Start Time', width: '15%' },
    { key: 'end_time', header: 'End Time', width: '15%' },
    {
      key: 'status',
      header: 'Status',
      width: '10%',
      custom: this.formatStatus,
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '15%',
      buttons: [
        {
          label: 'Edit',
          cssClass: 'text-blue-500 hover:text-blue-700 font-medium',
          action: (row: ISessionDetails) => this.editSession(row),
        },
        {
          label: 'Delete',
          cssClass: 'ml-4 text-red-500 hover:text-red-700 font-medium',
          action: (row: ISessionDetails) => this.deleteSession(row),
        },
      ],
    },
  ];

  constructor(
    private apiService: AdminApiService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const getSessionSubscription = this.apiService
      .getSession()
      .subscribe((response: IResponseModel<ISessionDetails[]>) => {
        this.sessions = response.data;
      });
    this.subscription.add(getSessionSubscription);
  }

  editSession(session: ISessionDetails) {
    this.router.navigate(['/editSession', session.id]);
  }

  deleteSession(session: ISessionDetails) {
    const newStatus = 'CANCELED';
    const cancelSessionSubscription = this.apiService
      .cancelSession(session.id, newStatus)
      .subscribe(() => {
        this.alertService.showAlert('Session canceled successfully');
        this.fetchData();
      });
    this.subscription.add(cancelSessionSubscription);
  }

  formatStatus(row: ISessionDetails) {
    const statusClasses = {
      COMPLETED: 'bg-green-100 text-green-700',
      CANCELED: 'bg-red-100 text-red-600',
      SCHEDULED: 'bg-gray-100 text-gray-500',
    };
    return {
      class: `${
        statusClasses[row.status]
      } px-3 py-1 rounded-full text-xs font-semibold`,
      text: row.status,
    };
  }

  renderActions(row: ISessionDetails) {
    return {
      class: '',
      text: `
        <button class="text-blue-500 hover:text-blue-700 font-medium" (click)="editSession(row)">Edit</button>
        <button class="ml-4 text-red-500 hover:text-red-700 font-medium" (click)="deleteSession(row)">Delete</button>
      `,
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
