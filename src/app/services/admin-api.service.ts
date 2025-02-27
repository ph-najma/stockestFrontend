import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable, tap, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthHeadersService } from './auth-headers.service';
import {
  IResponseModel,
  ILoginResponse,
  ILoginFormData,
  IOrder,
  ISessionDetails,
  IPortfolioResponseModel,
  ISessionFormData,
  ITransaction,
  IorderAndIIransaction,
  IStock,
  IuserList,
  IPromotion,
  ILimit,
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
  userList(page: number, limit: number): Observable<IResponseModel<IuserList>> {
    if (this.userCache[page]) {
      console.log(`Returning cached data for page ${page}`);
      return of(this.userCache[page]);
    }
    return this.http
      .get<IResponseModel<IuserList>>(
        `${this.apiUrl}/userlist?page=${page}&limit=${limit}`,
        {
          headers: this.authHeaders.getAuthHeaders(),
        }
      )
      .pipe(
        tap((response) => {
          console.log(`Caching data for page ${page}`);
          this.userCache[page] = response;
        })
      );
  }
  getStocks(): Observable<IResponseModel<IStock[]>> {
    return this.http.get<IResponseModel<IStock[]>>(`${this.apiUrl}/stocklist`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
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
  getOrders(): Observable<IResponseModel<IOrder[]>> {
    return this.http.get<IResponseModel<IOrder[]>>(`${this.apiUrl}/orders`, {
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
  getSessionById(id: string): Observable<IResponseModel<ISessionFormData>> {
    return this.http.get<IResponseModel<ISessionFormData>>(
      `${this.apiUrl}/getSessionById/${id}`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  updateSession(
    sessionId: string,
    data: ISessionFormData
  ): Observable<IResponseModel<ISessionFormData>> {
    return this.http.post<IResponseModel<ISessionFormData>>(
      `${this.apiUrl}/updateSession/${sessionId}`,
      data,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getUserPortfolio(userId: string | null): Observable<IPortfolioResponseModel> {
    return this.http.get<IPortfolioResponseModel>(
      `${this.apiUrl}/userPortfolio/${userId}`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  createPomotions(
    promotionData: IPromotion
  ): Observable<IResponseModel<IPromotion>> {
    return this.http.post<IResponseModel<IPromotion>>(
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
  cancelSession(
    id: string,
    newStatus: string
  ): Observable<IResponseModel<ISessionDetails>> {
    return this.http.post<IResponseModel<ISessionDetails>>(
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
  getLimits(): Observable<IResponseModel<ILimit>> {
    return this.http.get<IResponseModel<ILimit>>(`${this.apiUrl}/limit`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  saveLimits(limits: ILimit): Observable<IResponseModel<ILimit>> {
    return this.http.post<IResponseModel<ILimit>>(
      `${this.apiUrl}/updateLimit`,
      limits,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
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
