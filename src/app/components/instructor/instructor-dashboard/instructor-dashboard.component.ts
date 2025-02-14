import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faCheckCircle,
  faDollarSign,
  faCalendar,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import { InstructorHeaderComponent } from '../instructor-header/instructor-header.component';
interface ISession {
  student_id: string;
  instructor_name: string;
  instructorId: string;
  instructor_email: string;
  specialization: string;
  hourly_rate: number;
  start_time: Date;
  end_time: Date;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
  created_at: Date;
  updated_at: Date;
  connection_status: 'CONNECTED' | 'DISCONNECTED' | 'NOT CONNECTED';
}
@Component({
  selector: 'app-instructor-dashboard',
  imports: [FontAwesomeModule, CommonModule, InstructorHeaderComponent],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.css',
})
export class InstructorDashboardComponent {
  faUsers = faUsers;
  faCheckCircle = faCheckCircle;
  faDollarSign = faDollarSign;
  faCalendar = faCalendar;
  faWifi = faWifi;

  sessions: ISession[] = [
    {
      student_id: '1',
      instructor_name: 'John Doe',
      instructorId: '123',
      instructor_email: 'john@example.com',
      specialization: 'Mathematics',
      hourly_rate: 50,
      start_time: new Date('2025-02-06T10:00:00'),
      end_time: new Date('2025-02-06T11:00:00'),
      status: 'SCHEDULED',
      created_at: new Date(),
      updated_at: new Date(),
      connection_status: 'NOT CONNECTED',
    },
    // Add more sample sessions as needed
  ];

  // Calculate dashboard metrics
  totalSessions = this.sessions.length;
  completedSessions = this.sessions.filter((s) => s.status === 'COMPLETED')
    .length;
  upcomingSessions = this.sessions.filter(
    (s) => s.status === 'SCHEDULED' && new Date(s.start_time) > new Date()
  );
  averageRate =
    this.sessions.reduce((acc, curr) => acc + curr.hourly_rate, 0) /
    this.sessions.length;

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
