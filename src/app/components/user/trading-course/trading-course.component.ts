import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import {
  IResponseModel,
  ISessionDetails,
} from '../../../interfaces/userInterface';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../services/alert.service';
import { AlertModalComponent } from '../../reusable/alert-modal/alert-modal.component';
declare var Razorpay: RazorpayInstance;
interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
}
interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
@Component({
  selector: 'app-trading-course',
  standalone: true,
  imports: [CommonModule, AlertModalComponent],
  templateUrl: './trading-course.component.html',
  styleUrls: ['./trading-course.component.css'],
})
export class TradingCourseComponent implements OnInit, OnDestroy {
  courses: any[] = [];
  isCourse: Boolean = true;
  purchasedCourses: Set<string> = new Set();
  private subscription = new Subscription();
  constructor(
    private apiService: ApiService,
    private router: Router,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.fetchData();
    this.fetchPurchasedCourses();
  }
  fetchPurchasedCourses() {
    const purchasedCoursesubscription = this.apiService
      .getPurchasedCourses()
      .subscribe((response: IResponseModel<ISessionDetails[]>) => {
        this.purchasedCourses = new Set(
          response.data.map((course: ISessionDetails) => course.id)
        );
        console.log(this.purchasedCourses);
      });
    this.subscription.add(purchasedCoursesubscription);
  }
  isPurchased(courseId: string): boolean {
    return this.purchasedCourses.has(courseId);
  }
  fetchData() {
    const ActiveSessionsSubscription = this.apiService
      .getActiveSessions()
      .subscribe((response: IResponseModel<ISessionDetails[]>) => {
        this.courses = response.data.map((session: ISessionDetails) => ({
          id: session.id,
          title: session.specialization,
          instructor: session.instructor_name,
          rating: 4.5,
          originalPrice: 999,
          discountedPrice: session.hourly_rate || 500,
          discount: 50,
          image: 'assets/course.jpg',
        }));
      });
    this.subscription.add(ActiveSessionsSubscription);
  }
  buyCourse(course: ISessionDetails): void {
    console.log(`Processing payment for course: ${course.specialization}`);

    // Create Razorpay order
    const createOrderSubscription = this.apiService
      .createOrder(course.hourly_rate)
      .subscribe(
        (order) => {
          const options: RazorpayOptions = {
            key: 'rzp_test_sHq1xf34I99z5x',
            amount: order.amount,
            currency: order.currency,
            name: 'stockest',
            description: 'payment for new order',
            order_id: order.id,
            handler: (response: RazorpayPaymentResponse) => {
              const payload = {
                order_id: order.id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                course_id: course.id,
                isCourse: this.isCourse,
              };
              this.apiService.verifyPayment(payload).subscribe(
                (result) => {
                  if (result.success) {
                    this.alertService.showAlert(
                      `Payment successful for course: ${course.specialization}`
                    );
                    this.purchasedCourses.add(course.id);
                  } else {
                    this.alertService.showAlert('Payment verification failed!');
                  }
                },
                (error) => {
                  console.error(error);
                  this.alertService.showAlert('Payment verification error!');
                }
              );
            },
            prefill: {
              name: 'Your Name',
              email: 'your-email@example.com',
              contact: '9999999999',
            },
            theme: {
              color: '#528FF0',
            },
          };

          const razorpay = new Razorpay(options);
          razorpay.open();
        },
        (error) => {
          console.error(error);
          this.alertService.showAlert('Failed to create order');
        }
      );
    this.subscription.add(createOrderSubscription);
  }
  makeCall() {
    this.router.navigate(['/videocall']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
