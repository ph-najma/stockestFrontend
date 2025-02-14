import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IResponseModel,
  ISessionDetails,
} from '../../../interfaces/userInterface';
@Component({
  selector: 'app-instructor-home',
  imports: [CommonModule],
  templateUrl: './instructor-home.component.html',
  styleUrl: './instructor-home.component.css',
})
export class InstructorHomeComponent {
  courses: ISessionDetails[] = [];
  isCourse: Boolean = true;

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
}
