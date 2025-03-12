import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  faUsers,
  faClock,
  faVideo,
  faPhone,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IResponseModel, ISessionDetails } from '../../../interfaces/interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InstructorHeaderComponent } from '../instructor-header/instructor-header.component';
@Component({
  selector: 'app-instructor-sessions',
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    InstructorHeaderComponent,
  ],
  templateUrl: './instructor-sessions.component.html',
  styleUrl: './instructor-sessions.component.css',
})
export class InstructorSessionsComponent {
  faUsers = faUsers;
  faClock = faClock;
  faVideo = faVideo;
  faPhone = faPhone;
  faBars = faBars;
  faXmark = faXmark;
  isMobileMenuOpen = false;
  courses: ISessionDetails[] = [];
  isCourse: Boolean = true;
  imageUrl: string = environment.sessionImageUrl;

  assignedCourses: Set<string> = new Set();
  private subscription = new Subscription();
  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAssignedCourses();
  }

  makeCall() {
    this.router.navigate(['/videocall']);
  }

  fetchAssignedCourses() {
    const purchasedCoursesubscription = this.apiService
      .getAssignedCourses()
      .subscribe((response: IResponseModel<ISessionDetails[]>) => {
        this.courses = response.data;
      });
    this.subscription.add(purchasedCoursesubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  navItems = [
    { icon: 'home', label: 'Dashboard', active: false },
    { icon: 'book', label: 'Courses', active: true },
    { icon: 'calendar', label: 'Schedule', active: false },
    { icon: 'users', label: 'Students', active: false },
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
