import { Routes } from '@angular/router';
import { SignupUserComponent } from './components/user/signup-user/signup-user.component';
import { UserLoginComponent } from './components/user/user-login/user-login.component';
import { OtpComponent } from './components/user/otp/otp.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { HomeComponent } from './components/user/home/home.component';
import { LoginAdminComponent } from './components/admin/login-admin/login-admin.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { StockListComponent } from './components/admin/stock-list/stock-list.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { OrderManagementComponent } from './components/admin/order-management/order-management.component';
import { authGuard } from './auth.guard';
import { StocksComponent } from './components/user/stocks/stocks.component';
import { MarketOrdersComponent } from './components/admin/market-orders/market-orders.component';
import { LimitOrdersComponent } from './components/admin/limit-orders/limit-orders.component';
import { WatchlistComponent } from './components/user/watchlist/watchlist.component';
import { TradeDiaryComponent } from './components/user/trade-diary/trade-diary.component';
import { StockDetailsComponent } from './components/user/stock-details/stock-details.component';
import { TransactionComponent } from './components/user/transaction/transaction.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { PortfolioComponent } from './components/user/portfolio/portfolio.component';
import { CreateSessionComponent } from './components/admin/create-session/create-session.component';
import { EditSessionComponent } from './components/admin/edit-session/edit-session.component';
import { UserPortfolioComponent } from './components/admin/user-portfolio/user-portfolio.component';
import { PromotionComponent } from './components/admin/promotion/promotion.component';
import { SessionsComponent } from './components/admin/sessions/sessions.component';
import { TransactionsComponent } from './components/admin/transactions/transactions.component';
import { LimitAdminComponent } from './components/admin/limit-admin/limit-admin.component';
import { TradingViewComponent } from './components/user/trading-view/trading-view.component';
import { OrderListingComponent } from './components/user/order-listing/order-listing.component';
import { nonauthenticatedGuard } from './nonauthenticated.guard';
import { AiComponent } from './components/user/ai/ai.component';
import { TradingCourseComponent } from './components/user/trading-course/trading-course.component';
import { AddMoneyComponent } from './components/user/add-money/add-money.component';
import { ViewDetailsComponent } from './components/admin/view-details/view-details.component';
import { AppSummaryComponent } from './components/admin/app-summary/app-summary.component';
import { InstructorLoginComponent } from './components/instructor/instructor-login/instructor-login.component';
import { VideoCallComponent } from './components/user/video-call/video-call.component';

import { InstructorDashboardComponent } from './components/instructor/instructor-dashboard/instructor-dashboard.component';
import { InstructorSessionsComponent } from './components/instructor/instructor-sessions/instructor-sessions.component';
import { NotificationsComponent } from './components/user/notifications/notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  {
    path: 'signup',
    component: SignupUserComponent,
    canActivate: [nonauthenticatedGuard],
  },
  {
    path: 'login',
    component: UserLoginComponent,
    canActivate: [nonauthenticatedGuard],
  },
  {
    path: 'otp',
    component: OtpComponent,
    canActivate: [nonauthenticatedGuard],
  },

  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
  },
  { path: 'resetPassword', component: ResetPasswordComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'userProfile',
    component: UserProfileComponent,
    canActivate: [authGuard],
  },
  { path: 'stocks', component: StocksComponent, canActivate: [authGuard] },
  {
    path: 'portfolio',
    component: PortfolioComponent,
    canActivate: [authGuard],
  },
  {
    path: 'transactionhistory',
    component: TransactionComponent,
    canActivate: [authGuard],
  },
  { path: 'ai', component: AiComponent, canActivate: [authGuard] },
  {
    path: 'stockdetails/:symbol',
    component: StockDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'courses',
    component: TradingCourseComponent,
    canActivate: [authGuard],
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tradingview',
    component: TradingViewComponent,
    canActivate: [authGuard],
  },
  {
    path: 'addmoney',
    component: AddMoneyComponent,
    canActivate: [authGuard],
  },
  {
    path: 'myOrders',
    component: OrderListingComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tradediary',
    component: TradeDiaryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
  },
  {
    path: 'instructorLogin',
    component: InstructorLoginComponent,
    canActivate: [nonauthenticatedGuard],
  },
  {
    path: 'instructorhome',
    component: InstructorSessionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'videocall',
    component: VideoCallComponent,
    canActivate: [authGuard],
  },
  { path: 'dashboard', component: InstructorDashboardComponent },
  //Admin
  { path: 'adminLogin', component: LoginAdminComponent },
  {
    path: 'adminHome',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'userList', component: UserListComponent, canActivate: [authGuard] },
  {
    path: 'ordermanagement',
    component: OrderManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'limitorders',
    component: LimitOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'marketorders',
    component: MarketOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'viewdetails/:id',
    component: ViewDetailsComponent,
    canActivate: [authGuard],
  },
  { path: 'list', component: StockListComponent, canActivate: [authGuard] },

  {
    path: 'transactions',
    component: AppSummaryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'allTransactions',
    component: TransactionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'portfolioAdmin/:userId',
    component: UserPortfolioComponent,
    canActivate: [authGuard],
  },
  { path: 'limit', component: LimitAdminComponent, canActivate: [authGuard] },

  {
    path: 'promotions',
    component: PromotionComponent,
    canActivate: [authGuard],
  },

  {
    path: 'createSession',
    component: CreateSessionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'sessions',
    component: SessionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'editSession/:sessionId',
    component: EditSessionComponent,
    canActivate: [authGuard],
  },
];
