import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faUsers,
  faClock,
  faVideo,
  faPhone,
  faBars,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-instructor-header',
  imports: [FontAwesomeModule, CommonModule, RouterModule],
  templateUrl: './instructor-header.component.html',
  styleUrl: './instructor-header.component.css',
})
export class InstructorHeaderComponent {
  faUsers = faUsers;
  faClock = faClock;
  faVideo = faVideo;
  faPhone = faPhone;
  faBars = faBars;
  faXmark = faXmark;
  isMobileMenuOpen = false;
  navItems = [
    { icon: 'home', label: 'dashboard', active: false },
    { icon: 'book', label: 'Sessions', active: true },
  ];
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
