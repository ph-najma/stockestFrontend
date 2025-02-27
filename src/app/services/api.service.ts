import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable, ObservedValueOf } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { AuthHeadersService } from './auth-headers.service';
import {
  ILoginResponse,
  ILoginFormData,
  IStock,
  IRazorpayOrder,
  IPortfolioResponseModel,
  IUserResponseModel,
  IOrder,
  IWatchlist,
  ITransaction,
  IUser,
  IRewards,
  IPortfolioResponse,
  IOrderResponseData,
  IResponseModel,
  Iportfolio,
  ITradeDiary,
  ISessionDetails,
  IGenerateResponse,
  newIWatchlist,
} from '../interfaces/userInterface';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authHeaders: AuthHeadersService
  ) {}
  signup(userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Observable<IResponseModel<string>> {
    return this.http.post<IResponseModel<string>>(
      `${this.apiUrl}/signup`,
      userData
    );
  }
  googleLogin(id_token: string): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/auth/google/login`, {
      id_token,
    });
  }
  login(data: ILoginFormData): Observable<IUserResponseModel> {
    return this.http.post<IUserResponseModel>(`${this.apiUrl}/login`, data);
  }
  verifyOtp(otpData: any): Observable<IResponseModel<string>> {
    return this.http.post<IResponseModel<string>>(
      `${this.apiUrl}/verifyOtp`,
      otpData
    );
  }
  resendOtp(data: any): Observable<IResponseModel<string>> {
    return this.http.post<IResponseModel<string>>(
      `${this.apiUrl}/resendOtp`,
      data
    );
  }
  forgotPassword(data: any): Observable<IResponseModel<string>> {
    return this.http.post<IResponseModel<string>>(
      `${this.apiUrl}/forgotPassword`,
      data
    );
  }
  resetPassword(data: any): Observable<IResponseModel<string>> {
    return this.http.post<IResponseModel<string>>(
      `${this.apiUrl}/resetPassword`,
      data
    );
  }
  searchStocks(query: string): Observable<IResponseModel<IStock[]>> {
    let params = new HttpParams();
    if (query) {
      params = params.append('q', query);
    }
    return this.http.get<IResponseModel<IStock[]>>(`${this.apiUrl}/search`, {
      params: params,
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  createOrder(amount: number): Observable<IRazorpayOrder> {
    return this.http.post<IRazorpayOrder>(
      `${this.apiUrl}/create-order`,
      { amount },
      { headers: this.authHeaders.getAuthHeaders() }
    );
  }
  verifyPayment(payload: any): Observable<IResponseModel<boolean>> {
    return this.http.post<IResponseModel<boolean>>(
      `${this.apiUrl}/verify-payment`,
      payload,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getPortfolio(): Observable<IPortfolioResponseModel> {
    return this.http.get<IPortfolioResponseModel>(`${this.apiUrl}/portfolio`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  getStocks(): Observable<IResponseModel<IStock[]>> {
    return this.http.get<IResponseModel<IStock[]>>(`${this.apiUrl}/stocks`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  getUserProfile(): Observable<IResponseModel<IUser>> {
    return this.http.get<IResponseModel<IUser>>(`${this.apiUrl}/Userprofile`, {
      headers: this.authHeaders.getAuthHeaders(),
    });
  }
  getInitialData() {
    return Promise.all([
      this.getStocks().toPromise(),
      this.getUserProfile().toPromise(),
    ]).then(([stocksResponse, userResponse]) => ({
      stocks: stocksResponse?.data || [],
      user: userResponse?.data || null,
      portfolio: userResponse?.data.portfolio || [],
      balance: userResponse?.data.balance || 0,
    }));
  }
  placeOrder(order: IOrder): Observable<IResponseModel<IOrder>> {
    return this.http.post<IResponseModel<IOrder>>(
      `${this.apiUrl}/orders`,
      order,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  updateUserPortfolio(
    updatedPortfolio: Iportfolio[]
  ): Observable<IResponseModel<Iportfolio[]>> {
    return this.http.post<IResponseModel<Iportfolio[]>>(
      `${this.apiUrl}/updatePortfolio`,
      updatedPortfolio
    );
  }

  addToWatchlist(data: IWatchlist): Observable<IResponseModel<IWatchlist>> {
    return this.http.post<IResponseModel<IWatchlist>>(
      `${this.apiUrl}/ensureAndAddStock`,
      data,
      { headers: this.authHeaders.getAuthHeaders() }
    );
  }
  getWatchlist(): Observable<IResponseModel<newIWatchlist>> {
    return this.http.get<IResponseModel<newIWatchlist>>(
      `${this.apiUrl}/getWatchlist`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getTradeDiary(): Observable<IResponseModel<ITradeDiary>> {
    return this.http.get<IResponseModel<ITradeDiary>>(
      `${this.apiUrl}/tradeDiary`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getHistroical(
    symbol: string | undefined
  ): Observable<IResponseModel<IStock[]>> {
    return this.http.get<IResponseModel<IStock[]>>(
      `${this.apiUrl}/gethistorical?symbol=${symbol}`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getTransactions(
    page: number,
    limit: number
  ): Observable<IResponseModel<ITransaction[]>> {
    return this.http.get<IResponseModel<ITransaction[]>>(
      `${this.apiUrl}/transactions?page=${page}&limit=${limit}`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getPromotions(): Observable<IResponseModel<IRewards>> {
    return this.http.get<IResponseModel<IRewards>>(
      `${this.apiUrl}/promotions`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getStockData(
    symbol: string | undefined
  ): Observable<IResponseModel<IStock[]>> {
    return this.http.get<IResponseModel<IStock[]>>(
      `${this.apiUrl}/getStockData?symbol=${symbol}`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getTransaction(symbol: string): Observable<IResponseModel<ITransaction[]>> {
    return this.http.get<IResponseModel<ITransaction[]>>(
      `${this.apiUrl}/transactions`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getOrderByUserId(
    page: number,
    limit: number
  ): Observable<IResponseModel<IOrderResponseData>> {
    console.log('service called');
    return this.http.get<IResponseModel<IOrderResponseData>>(
      `${this.apiUrl}/getOrders?page=${page}&limit=${limit}`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getPurchasedCourses(): Observable<IResponseModel<ISessionDetails[]>> {
    return this.http.get<IResponseModel<ISessionDetails[]>>(
      `${this.apiUrl}/getPurchased`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getActiveSessions(): Observable<IResponseModel<ISessionDetails[]>> {
    return this.http.get<IResponseModel<ISessionDetails[]>>(
      `${this.apiUrl}/activeSessions`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  getAssignedCourses(): Observable<IResponseModel<ISessionDetails[]>> {
    return this.http.get<IResponseModel<ISessionDetails[]>>(
      `${this.apiUrl}/getAssigned`,
      {
        headers: this.authHeaders.getAuthHeaders(),
      }
    );
  }
  generatePrompt(prompt: string): Observable<IGenerateResponse> {
    return this.http.post<IGenerateResponse>(`${this.apiUrl}/generate`, {
      prompt,
    });
  }
  getUploadURL(userId: string): Observable<{ url: string; Key: string }> {
    return this.http.post<{ url: string; Key: string }>(
      `${this.apiUrl}/get-upload-url`,
      { userId }
    );
  }

  logout() {
    localStorage.removeItem('token');
    alert(
      'You have been logged out. Please contact support if you believe this is a mistake.'
    );
    this.router.navigate(['/login']);
  }
}
