import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-right-side-login',
  imports: [],
  templateUrl: './right-side-login.component.html',
  styleUrl: './right-side-login.component.css',
})
export class RightSideLoginComponent {
  imageUrl: string = environment.logo_URL;
}
