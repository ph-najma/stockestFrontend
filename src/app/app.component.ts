import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VideoCallComponent } from './components/user/video-call/video-call.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}
