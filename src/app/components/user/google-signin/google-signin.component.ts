import { Component, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GoogleLoginResponse } from '../../../interfaces/interface';

@Component({
  selector: 'app-google-signin',
  imports: [],
  templateUrl: './google-signin.component.html',
  styleUrl: './google-signin.component.css',
})
export class GoogleSigninComponent {
  @Output() onGoogleLogin = new EventEmitter<string>();

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }
  initializeGoogleSignIn() {
    window.google.accounts.id.initialize({
      client_id: environment.googleClientId,

      callback: (response: GoogleLoginResponse) => {
        this.onGoogleLogin.emit(response.credential);
      },
    });
    window.google.accounts.id.renderButton(
      document.getElementById('googleSignInBtn')!,
      { theme: 'outline', size: 'large' }
    );
  }
}
