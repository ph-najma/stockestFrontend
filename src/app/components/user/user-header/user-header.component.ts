import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router, RouterModule } from '@angular/router';
@Component({
    selector: 'app-user-header',
    imports: [CommonModule, RouterModule],
    templateUrl: './user-header.component.html',
    styleUrl: './user-header.component.css'
})
export class UserHeaderComponent {
  dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    const profileSection = document.querySelector('.relative');
    if (profileSection && !profileSection.contains(target)) {
      this.dropdownOpen = false;
    }
  }
  constructor(private apiService: ApiService, private router: Router) {}
  logout() {
    sessionStorage.removeItem('token'); // Remove token
    this.apiService.logout(); // Call the logout method from ApiService
    this.router.navigate(['/login']); // Redirect to login page
  }
  profile() {
    this.router.navigate(['/userProfile']);
  }
  market() {
    this.router.navigate(['/stocks']);
  }
}
