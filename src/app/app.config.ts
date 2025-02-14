import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SocketIoConfig, Socket } from 'ngx-socket-io';
import { LucideAngularModule } from 'lucide-angular';
import { routes } from './app.routes';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faStar,
  faArrowUp,
  faArrowDown,
  faEllipsisVertical,
} from '@fortawesome/free-solid-svg-icons';
import { tokenInterceptor } from './token.interceptor';
library.add(faStar, faArrowUp, faArrowDown, faEllipsisVertical);
const socketConfig: SocketIoConfig = {
  url: 'http://localhost:5000',
  options: {},
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    LucideAngularModule,
    FontAwesomeModule,
    { provide: Socket, useFactory: () => new Socket(socketConfig) },
  ],
};
