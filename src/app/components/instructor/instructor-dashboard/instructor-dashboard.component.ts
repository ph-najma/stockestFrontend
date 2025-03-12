import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faCheckCircle,
  faDollarSign,
  faCalendar,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { InstructorHeaderComponent } from '../instructor-header/instructor-header.component';
import { ApiService } from '../../../services/api.service';
import { ISessionDetails } from '../../../interfaces/interface';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [FontAwesomeModule, CommonModule, InstructorHeaderComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.css',
})
export class InstructorDashboardComponent implements OnInit {
  faUsers = faUsers;
  faCheckCircle = faCheckCircle;
  faDollarSign = faDollarSign;
  faCalendar = faCalendar;
  faWifi = faWifi;
  sessions: ISessionDetails[] = [];
  totalSessions: number = 0;
  completedSessions: number = 0;
  upcomingSessions: ISessionDetails[] = [];
  averageRate: number = 0;
  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.apiService.getAssignedCourses().subscribe((response) => {
      console.log(response);
      this.sessions = response.data;
      console.log(this.sessions);
      this.totalSessions = this.sessions.length;
      this.completedSessions = this.sessions.filter(
        (s) => s.status === 'COMPLETED'
      ).length;
      this.upcomingSessions = this.sessions.filter(
        (s) => s.status === 'SCHEDULED' && new Date(s.start_time) > new Date()
      );
      this.averageRate =
        this.sessions.reduce((acc, curr) => acc + curr.hourly_rate, 0) /
        this.sessions.length;
    });
  }
}
