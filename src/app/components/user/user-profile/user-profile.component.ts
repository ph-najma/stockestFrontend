import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import {
  IRewards,
  IResponseModel,
  IUser,
} from '../../../interfaces/userInterface';
import { UserHeaderComponent } from '../user-header/user-header.component';
import { AlertService } from '../../../services/alert.service';
import { AlertModalComponent } from '../../reusable/alert-modal/alert-modal.component';
import { S3Service } from '../../../services/s3.service';
@Component({
  selector: 'app-user-profile',
  imports: [
    FormsModule,
    UserHeaderComponent,
    CommonModule,
    AlertModalComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profileImageUrl: string = '';
  private bucketName = 'stockest-user-profile'; // Replace with actual bucket name
  private region = 'ap-south-1';
  user: {
    id: string;
    name: string;
    fullName: string;
    profilePhoto: string;
    refferalCode?: string;
  } = {
    id: '',
    name: 'NIZAM',
    fullName: 'NIZAM P H',
    profilePhoto: '',
  };

  rewards: IRewards = {};
  private subscriptions = new Subscription();
  isEligibleForsignupBonus: boolean = true;
  isEligibleForReferralBonus: boolean = false;
  isEligibleForLoyaltyRewards: boolean = false;

  constructor(
    private apiService: ApiService,
    private alertService: AlertService,
    private s3Service: S3Service
  ) {}
  ngOnInit(): void {
    this.fetchUserDetails();
  }
  fetchUserDetails(): void {
    const userDetailsSubscription = this.apiService.getUserProfile().subscribe({
      next: (response: IResponseModel<IUser>) => {
        console.log(response);
        this.user.id = response.data._id;
        this.user.name = response.data.name;
        this.user.fullName = response.data.name || 'unknown user';
        this.user.profilePhoto = response.data.profilePhoto;
        this.user.refferalCode = response.data.referralCode;

        this.isEligibleForLoyaltyRewards =
          response.data.isEligibleForLoyaltyRewards;
        this.isEligibleForReferralBonus =
          response.data.isEligibleForReferralBonus;

        if (response.data.profilePhoto) {
          this.profileImageUrl = response.data.profilePhoto;
        }
      },
      error: (err) => console.error('Failed to fetch user details:', err),
    });
    this.subscriptions.add(userDetailsSubscription);

    const promotionSubscription = this.apiService.getPromotions().subscribe({
      next: (response: IResponseModel<IRewards>) => {
        console.log(response);
        this.rewards = response.data;
        console.log(this.rewards);
      },
    });
    this.subscriptions.add(promotionSubscription);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const encodedFileName = encodeURIComponent(file.name);
    console.log('Uploading file:', file.name, 'Type:', file.type);

    this.s3Service.getSignedUrl(file.name, file.type).subscribe({
      next: ({ signedUrl, fileUrl }) => {
        fetch(signedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        })
          .then(() => {
            this.s3Service.updateProfile(fileUrl).subscribe({
              next: () => (this.profileImageUrl = fileUrl),
              error: (error) => console.error('Error updating profile:', error),
            });
          })
          .catch((error) => console.error('Error uploading file:', error));
      },
      error: (error) => console.error('Error getting signed URL:', error),
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
