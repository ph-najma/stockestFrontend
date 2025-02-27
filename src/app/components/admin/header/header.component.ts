import { Component, HostListener } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  dropdownOpen: boolean = false;
  imageUrl: string =
    'https://stockest-user-profile.s3.ap-south-1.amazonaws.com/logos/logo.png';
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    const profileSection = document.querySelector('.relative');
    if (profileSection && !profileSection.contains(target)) {
      this.dropdownOpen = false;
    }
  }
  constructor(private apiService: ApiService, private router: Router) {}
  logout() {
    this.apiService.logout();
    this.router.navigate(['/adminLogin']);
  }
}
