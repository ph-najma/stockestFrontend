import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionFormComponent } from '../../reusable/session-form/session-form.component';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AlertService } from '../../../services/alert.service';
import { AdminApiService } from '../../../services/admin-api.service';
import { Subscription } from 'rxjs';
import { ISessionFormData } from '../../../interfaces/interface';
import { AlertModalComponent } from '../../reusable/alert-modal/alert-modal.component';
@Component({
  selector: 'app-create-session',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SessionFormComponent,
    HeaderComponent,
    SidebarComponent,
    AlertModalComponent,
  ],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.css',
})
export class CreateSessionComponent implements OnDestroy {
  private subscription = new Subscription();
  constructor(
    private apiservice: AdminApiService,
    private alertService: AlertService
  ) {}
  handleCreate(data: ISessionFormData) {
    const createSessionSubscription = this.apiservice
      .createSession(data)
      .subscribe((data) => {
        this.alertService.showAlert('created successfully');
      });
    this.subscription.add(createSessionSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
