import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GoogleSigninComponent } from '../../user/google-signin/google-signin.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login-form',
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        GoogleSigninComponent,
    ],
    templateUrl: './login-form.component.html',
    styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements OnDestroy {
  @Input() title: string = 'Login';
  @Input() error: string | null = null;
  @Input() successMessage: string | null = null;
  @Input() loading: boolean = false;
  @Output() submitForm = new EventEmitter<any>();
  @Input() isUserLogin: boolean = false;
  @Input() isInstructorLogin: boolean = false;
  private subscription = new Subscription();
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  handleSubmit() {
    if (this.loginForm.valid) {
      this.submitForm.emit(this.loginForm.value);
    }
  }
  handleGoogleLogin(id_token: string) {
    const googleLoginSubscription = this.apiService
      .googleLogin(id_token)
      .subscribe(
        (response) => {
          if (response.token) {
            sessionStorage.setItem('token', response.token);
            this.successMessage = 'Successfully logged in with Google!';
            this.router.navigate(['/home']);
          }
        },
        (error) => {
          console.error('Error during Google login:', error);
          this.error =
            'Something went wrong during Google login. Please try again later.';
        }
      );
    this.subscription.add(googleLoginSubscription);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
