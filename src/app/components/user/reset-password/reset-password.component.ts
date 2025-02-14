import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
    selector: 'app-reset-password',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetPasswordForm!: FormGroup;
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  email: string | null = '';
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private apiservice: ApiService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.email = this.auth.getEmail();

    this.resetPasswordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]], // Validators added for OTP
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) return;

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const { otp, newPassword } = this.resetPasswordForm.value;

    const resetPasswordSubscription = this.apiservice
      .resetPassword({
        email: this.email,
        otp,
        newPassword,
      })
      .subscribe(
        (response) => {
          this.successMessage = 'Your password has been successfully reset!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        (error) => {
          this.errorMessage = 'Invalid OTP or password reset failed';
        }
      );
    this.subscription.add(resetPasswordSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
