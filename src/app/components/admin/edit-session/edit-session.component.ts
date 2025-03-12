import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { AdminApiService } from '../../../services/admin-api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../../services/alert.service';
import { Subscription } from 'rxjs';
import { SessionFormComponent } from '../../reusable/session-form/session-form.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ISessionFormData } from '../../../interfaces/interface';

@Component({
  selector: 'app-edit-session',
  imports: [
    SessionFormComponent,
    SidebarComponent,
    RouterModule,
    CommonModule,
    HeaderComponent,
  ],
  templateUrl: './edit-session.component.html',
  styleUrl: './edit-session.component.css',
})
export class EditSessionComponent implements OnInit, OnDestroy {
  sessionData: ISessionFormData | undefined = undefined;
  sessionId: string = '';
  private subscription = new Subscription();

  constructor(
    private apiService: AdminApiService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.sessionId = this.route.snapshot.paramMap.get('sessionId') || '';
    if (this.sessionId) {
      this.fetchData(this.sessionId);
    }
  }

  fetchData(sessionId: string) {
    const getSessionSubcription = this.apiService
      .getSessionById(sessionId)
      .subscribe((response) => {
        this.sessionData = response.data;
      });
    this.subscription.add(getSessionSubcription);
  }

  handleEdit(data: ISessionFormData) {
    const updateSessionSubscription = this.apiService
      .updateSession(this.sessionId, data)
      .subscribe((data) => {
        this.alertService.showAlert('updated successfully');
      });
    this.subscription.add(updateSessionSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
