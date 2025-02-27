import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket: Socket;
  constructor() {
    this.socket = io(environment.socketUrl, {
      auth: { token: sessionStorage.getItem('token') },
    });
  }

  requestPortfolioUpdate(userId: string): void {
    this.socket.emit('requestPortfolioUpdate', userId);
  }

  onPortfolioUpdate(callback: (portfolio: any) => void): void {
    this.socket.on('portfolioUpdate', callback);
  }

  onStockUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('stock-update', (data) => {
        observer.next(data);
      });

      return () => this.socket.off('stock-update');
    });
  }
  afterFetchUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('stockUpdate', (data) => {
        observer.next(data);
      });
      return () => this.socket.off('stockUpdate');
    });
  }
  onNotification(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('notification', (data) => {
        observer.next(data);
      });
    });
  }
  subscribeToWatchlist(watchlist: string[]): void {
    this.socket.emit('subscribeWatchlist', watchlist);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  listen<T>(event: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data: T) => subscriber.next(data));
    });
  }

  emitEvent(event: string, payload: any) {
    this.socket.emit(event, payload);
  }
}
