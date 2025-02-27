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
import {
  ISessionDetails,
  ISessionFormData,
} from '../../../interfaces/userInterface';

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

  // Format date for display
  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // Sample data for the earnings chart
  earningsData = [
    { month: 'Jan', earnings: 2400 },
    { month: 'Feb', earnings: 3600 },
    { month: 'Mar', earnings: 3200 },
    { month: 'Apr', earnings: 4500 },
  ];
}
