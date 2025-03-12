export interface IResponseModel<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface Iusername {
  name: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  is_Blocked: boolean;
  role: 'user' | 'admin';
  is_Admin: boolean;
  is_instructor: boolean;
  googleId?: string;
  profilePhoto: string;
  portfolio: IPortfolio[];
  balance: number;
  isEligibleForSignupBonus: boolean;
  isEligibleForReferralBonus: boolean;
  isEligibleForLoyaltyRewards: boolean;
  referralCode?: string;
  referredBy?: string;
  referralsCount: number;
  refreshToken?: string;
}
export interface IuserList {
  usersData: IUser[];
  totalUsers: number;
  totalPages: number;
}

export interface IStock {
  id?: string;
  symbol: string;
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  price: number;
  change: number;
  changePercent: number;
  latestTradingDay: string;
  adjustedVolume: number;
}
export interface IRewards {
  signupBonus?: {
    enabled: boolean;
    amount: number;
    minimumDepositRequired?: number;
    expiryDays?: number;
  };
  referralBonus?: {
    enabled: boolean;
    referrerAmount: number;
    refereeAmount: number;
    maxReferralsPerUser?: number;
    minimumDepositRequired?: number;
  };
  loyaltyRewards?: {
    enabled: boolean;
    tradingAmount: number;
    rewardAmount: number;
    timeframeInDays?: number;
  };
}
export interface IOrder {
  _id?: string;
  user?: IUser;
  stock: IStock;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT' | 'STOP';
  quantity: number;
  price: number;
  stopPrice?: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt?: Date;
  completedAt?: Date;
  isIntraday?: boolean;
  orderId?: string;
}
export interface IPortfolio {
  stockId: string;
  quantity: number;
}
export interface IWatchlist {
  user: IUser | null;
  stocks: { stockId: string; addedAt: Date }[];
  name: string;
  createdAt: Date;
}
export interface newIWatchlist {
  _id: string;
  name: string;
  createdAt: string;
  user: string;
  __v: number;
  stocks: IStock[];
}
export interface ITradeDetail {
  time: string;
  type: string;
  symbol: string;
  quantity: number;
  entry: number;
  exit: number;
  pnl: number;
  notes: string;
}

export interface IDailyTrade {
  date: string;
  trades: number;
  overallPL: number;
  netPL: number;
  status: string;
  details: ITradeDetail[];
}

export interface ITradeDiary {
  winRate: number;
  averageWin: number;
  averageLoss: number;
  overallPL: number;
  netPL: number;
  totalTrades: number;
  charges: number;
  brokerage: number;
  trades: IDailyTrade[];
}

export interface IGenerateResponse {
  response: string;
}

export interface IorderAndIIransaction {
  order: IOrder;
  transaction: ITransaction[];
}
export interface ITransaction {
  _id?: string;
  buyer: IUser;
  seller: IUser;
  buyOrder: IOrder;
  sellOrder: IOrder;
  stock: IStock;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  fees: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod?: 'PAYPAL' | 'CREDIT_CARD' | 'BANK_TRANSFER';
  paymentReference?: string;
  createdAt: Date;
  completedAt?: Date;
}
export interface ILimit {
  maxBuyLimit: number;
  maxSellLimit: number;
  timeframeInHours: number;
}
export interface Iportfolio {
  quantity: number;
  stockId: IStock;
  _id: string;
  isIntraday: Boolean;
}

// session-form.model.ts
export interface ISessionFormData {
  instructor_name: string;
  instructor_email: string;
  specialization: 'technical' | 'fundamental' | 'risk' | 'psychology';
  hourly_rate: number;
  start_time: string;
  end_time: string;
}
export interface GoogleLoginResponse {
  credential: string;
}

export interface ISessionDetails {
  id: string;
  created_at?: string;
  end_time: string;
  hourly_rate: number;
  instructor_email?: string;
  instructor_name: string;
  specialization: string;
  start_time: string;
  status: 'CANCELED' | 'COMPLETED' | 'SCHEDULED';
  student_id?: string;
  updated_at?: string;
  connection_status?: string;
}
export interface ISignupBonus {
  enabled: boolean;
  amount: number;
  minimumDepositRequired: number;
  expiryDays: number;
}

export interface IReferralBonus {
  enabled: boolean;
  referrerAmount: number;
  refereeAmount: number;
  maxReferralsPerUser: number;
  minimumDepositRequired: number;
}

export interface ILoyaltyRewards {
  enabled: boolean;
  tradingAmount: number;
  rewardAmount: number;
  timeframeInDays: number;
}

export interface IPromotion {
  signupBonus: ISignupBonus;
  referralBonus: IReferralBonus;
  loyaltyRewards: ILoyaltyRewards;
}

export interface IRazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_due: number;
  amount_paid: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
  notes?: Record<string, string>;
}
export interface ISymbolInfo {
  name: string;
  ticker: string;
  type: string;
  session: string;
  timezone: string;
  supported_resolutions: string[];
  has_intraday: boolean;
  has_no_volume: boolean;
}
export interface IBar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IPortfolioItem {
  _id?: string;
  isIntraday?: Boolean;
  stock: IStock;
  quantity: number;
  currentValue: number;
  overallProfit: number;
  todaysProfit: number;
  totalValue?: number;
  allocation?: number;
}
export interface IPortfolioResponse {
  user: IUser;
  portfolio: IPortfolioItem[];
  totalPortfolioValue: number;
  overallProfit: number;
  todaysProfit: number;
}
export type IPortfolioResponseModel = IResponseModel<IPortfolioResponse>;

export interface ILoginResponse {
  token: string;
}
export interface ILoginFormData {
  email: string;
  password: string;
}

export interface IUserLoginResponse {
  refreshToken: string;
  token: string;
  user: IUser;
}
export type IUserResponseModel = IResponseModel<IUserLoginResponse>;

export interface IOrderResponseData {
  currentPage: number;
  orders: IOrder[];
  totalOrders: number;
  totalPages: number;
}
export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
}
export interface IFilter {
  status: 'all' | 'PENDING' | 'COMPLETED' | 'FAILED';
  user: string;
  dateRange: string;
}
export interface IStatistics {
  buyTransactions: number;
  sellTransactions: number;
  total: number;
  totalVolume: number;
}
export interface IPortfolioSummaryUpdate {
  totalPortfolioValue: number;
  overallProfit: number;
  todaysProfit: number;
}

export interface ITradeDetail {
  time: string;
  type: string;
  symbol: string;
  quantity: number;
  entry: number;
  exit: number;
  pnl: number;
  notes: string;
}

export interface ITrade {
  date: string;
  trades: number;
  overallPL: number;
  netPL: number;
  status: string;
  details: ITradeDetail[];
}

export interface ITradeData {
  winRate: number;
  averageWin: number;
  averageLoss: number;
  overallPL: number;
  netPL: number;
  totalTrades: number;
  charges: number;
  brokerage: number;
  trades: ITrade[];
}
export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

