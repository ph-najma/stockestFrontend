import { Injectable } from '@angular/core';
import { environment } from '../../enviornments/enviornment';
import { Router } from '@angular/router';
import { Observable, tap, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthHeadersService } from './auth-headers.service';
import {
  IResponseModel,
  ILoginResponse,
  ILoginFormData,
  IOrder,
  IPortfolioResponse,
  ISessionDetails,
  IPortfolioResponseModel,
  ISessionFormData,
  ITransaction,
  IorderAndIIransaction,
} from '../interfaces/userInterface';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  private apiUrl = environment.apiUrl;
  private userCache: { [page: number]: any } = {};
  constructor(
    private http: HttpClient,
    private router: Router,
    private authHeaders: AuthHeadersService
  ) {}
  loginAdmin(data: ILoginFormData): Observable<IResponseModel<ILoginResponse>> {
    return this.http
      .post<IResponseModel<ILoginResponse>>(`${this.apiUrl}/adminLogin`, data)
      .pipe(
        tap((response: any) => {
          localStorage.setItem('token', response.token);
        })
      );
  }
  userList(page: number, limit: number): Observable<any> {
    if (this.userCache[page]) {
      console.log(`Returning cached data for page ${page}`);
      return of(this.userCache[page]);
    }
    return this.http
      .get<any>(`${this.apiUrl}/userlist?page=${page}&limit=${limit}`, {
        headers: this.authHeaders.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          console.log(`Caching data for page ${page}`);
          this.userCache[page] = response;
        })
      );
  }
  disableUser(userId: string): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/disableUser/${userId}`,
      {},
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  getMarketOrders(filters: {
    status?: string;
    user?: string;
    dateRange?: string;
  }): Observable<IResponseModel<IOrder[]>> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.user) {
      params = params.set('user', filters.user);
    }
    if (filters.dateRange) {
      params = params.set('dateRange', filters.dateRange);
    }

    return this.http.get<IResponseModel<IOrder[]>>(
      `${this.apiUrl}/marketorders`,
      {
        params,
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getLimitOrders(filters: {
    status?: string;
    user?: string;
    dateRange?: string;
  }): Observable<IResponseModel<IOrder[]>> {
    let params = new HttpParams();

    if (filters.status) {
      params = params.set('status', filters.status);
    }
    if (filters.user) {
      params = params.set('user', filters.user);
    }
    if (filters.dateRange) {
      params = params.set('dateRange', filters.dateRange);
    }
    return this.http.get<IResponseModel<IOrder[]>>(
      `${this.apiUrl}/limitorders`,
      {
        params,
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  cancelOrder(orderId: string): Observable<IResponseModel<IOrder>> {
    return this.http.post<IResponseModel<IOrder>>(
      `${this.apiUrl}/changeStatus/${orderId}`,
      {},
      { headers: this.authHeaders.getAuthHeaders() }
    );
  }
  createSession(data: ISessionFormData) {
    return this.http.post(`${this.apiUrl}/createSession`, data, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  getSessionById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getSessionById/${id}`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  updateSession(sessionId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/updateSession/${sessionId}`, data, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  getUserPortfolio(userId: string | null): Observable<IPortfolioResponseModel> {
    return this.http.get<IPortfolioResponseModel>(
      `${this.apiUrl}/userPortfolio/${userId}`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  createPomotions(promotionData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/createPromotions`,
      promotionData,
      { headers: this.authHeaders.getAuthHeaders() }
    );
  }
  getSession(): Observable<IResponseModel<ISessionDetails[]>> {
    return this.http.get<IResponseModel<ISessionDetails[]>>(
      `${this.apiUrl}/getSessions`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  cancelSession(id: string, newStatus: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/cancelSession/${id}`,
      { status: newStatus },
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getAllTrans(): Observable<IResponseModel<ITransaction[]>> {
    return this.http.get<IResponseModel<ITransaction[]>>(
      `${this.apiUrl}/allTransactions`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getLimits(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/limit`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  saveLimits(limits: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateLimit`, limits, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  getOrderById(
    orderId: string
  ): Observable<IResponseModel<IorderAndIIransaction>> {
    return this.http.get<IResponseModel<IorderAndIIransaction>>(
      `${this.apiUrl}/orderDetails/${orderId}`,
      { headers: this.authHeaders.getAuthHeaders() }
    );
  }
  getTotalFees(): Observable<IResponseModel<number>> {
    return this.http.get<IResponseModel<number>>(`${this.apiUrl}/getFees`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
}
