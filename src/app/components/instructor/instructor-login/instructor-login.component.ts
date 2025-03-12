import { Component, OnDestroy } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Subscription } from 'rxjs';
import { LoginFormComponent } from '../../reusable/login-form/login-form.component';
import { RightSideLoginComponent } from '../../reusable/right-side-login/right-side-login.component';
import { Router } from '@angular/router';
import {
  ILoginFormData,
  IUserResponseModel,
} from '../../../interfaces/interface';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-instructor-login',
  imports: [LoginFormComponent, RightSideLoginComponent],
  templateUrl: './instructor-login.component.html',
  styleUrl: './instructor-login.component.css',
})
export class InstructorLoginComponent implements OnDestroy {
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  isInstructorLogin: boolean = true;
  private subscription = new Subscription();
  imageUrl: string = environment.logo_URL;
  constructor(private apiService: ApiService, private router: Router) {}

  onSubmit(userData: ILoginFormData) {
    this.error = null;
    this.successMessage = null;
    this.loading = true;

    const loginSubscription = this.apiService.login(userData).subscribe(
      (response: IUserResponseModel) => {
        if (response.data.token && response.data.user.is_instructor) {
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('role', 'instructor');
          this.loading = false;
          this.successMessage = 'Successfully logged in';
          this.router.navigate(['/dashboard']);
        } else {
          this.loading = false;
          this.error = 'Invalid response from server.';
        }
      },
      (error) => {
        this.loading = false;
        this.error = 'Something went wrong. Please try again later.';
        console.error('Login error:', error);
      }
    );
    this.subscription.add(loginSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
