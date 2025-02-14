import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PopUpService {
  private messageSource = new BehaviorSubject<string | null>(null);
  message$ = this.messageSource.asObservable();

  showMessage(message: string): void {
    this.messageSource.next(message);
  }

  clearMessage(): void {
    this.messageSource.next(null);
  }
}
