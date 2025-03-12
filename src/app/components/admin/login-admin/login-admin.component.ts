import { Component, OnDestroy } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from '../../reusable/login-form/login-form.component';
import {
  IResponseModel,
  ILoginFormData,
  ILoginResponse,
} from '../../../interfaces/interface';
import { Subscription } from 'rxjs';
import { RightSideLoginComponent } from '../../reusable/right-side-login/right-side-login.component';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-login-admin',
  imports: [ReactiveFormsModule, LoginFormComponent, RightSideLoginComponent],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css',
})
export class LoginAdminComponent implements OnDestroy {
  loading: boolean = false;
  error: string | null = null;
  successMessage: string | null = null;
  imageUrl: string = environment.logo_URL;
  private subscription = new Subscription();

  constructor(private apiService: AdminApiService, private router: Router) {}

  onSubmit(adminData: ILoginFormData) {
    this.error = null;
    this.successMessage = null;
    this.loading = true;

    const loginSubscription = this.apiService.loginAdmin(adminData).subscribe(
      (response: IResponseModel<ILoginResponse>) => {
        if (response.data) {
          sessionStorage.setItem('token', response.data.token);
          this.loading = false;
          this.successMessage = 'Successfully logged in';
          this.router.navigate(['/adminHome']);
        }
      },
      (error) => {
        this.loading = false;
        this.error = 'Something went wrong. Please try again later.';
      }
    );
    this.subscription.add(loginSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
