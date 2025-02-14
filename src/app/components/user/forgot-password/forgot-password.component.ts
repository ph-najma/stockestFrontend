import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnDestroy, OnInit {
  forgotPasswordForm!: FormGroup;
  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private apiservice: ApiService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.successMessage = null;
    this.errorMessage = null;

    const email = this.forgotPasswordForm.value.email;
    this.auth.setEmail(email);

    const forgotPasswordSubscription = this.apiservice
      .forgotPassword({ email })
      .subscribe(
        (response) => {
          this.successMessage = 'An OTP has been sent to your email.';
          setTimeout(() => {
            this.router.navigate(['/resetPassword']);
          });
        },
        (error) => {
          this.errorMessage = 'Something went wrong. Please try again.';
        }
      );

    this.subscription.add(forgotPasswordSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
