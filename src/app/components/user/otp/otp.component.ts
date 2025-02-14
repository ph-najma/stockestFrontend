import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-otp',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './otp.component.html',
    styleUrl: './otp.component.css'
})
export class OtpComponent implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  loading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  email: string = '';
  remainingTime: number = 300;
  timer: any;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]],
    });

    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
    });

    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  onSubmit() {
    if (this.otpForm.invalid) {
      return;
    }
    this.loading = true;

    const verifyOtpSubscription = this.apiService
      .verifyOtp({ otp: this.otpForm.value.otp })
      .subscribe(
        (response) => {
          this.loading = false;
          this.successMessage = 'OTP verified! You are successfully signed up.';
          this.router.navigate(['/home']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Invalid OTP. Please try again.';
        }
      );
    this.subscription.add(verifyOtpSubscription);
  }

  resendOtp() {
    this.loading = true;
    const resendOTPSubscription = this.apiService
      .resendOtp({ email: this.email })
      .subscribe(
        (response) => {
          this.loading = false;
          this.successMessage = 'New OTP sent to your email!';
          this.remainingTime = 300;
          this.startTimer();
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to resend OTP. Please try again.';
        }
      );
    this.subscription.add(resendOTPSubscription);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.subscription.unsubscribe();
  }
}
