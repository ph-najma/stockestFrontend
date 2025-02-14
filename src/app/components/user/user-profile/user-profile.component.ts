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

@Component({
  selector: 'app-user-profile',
  imports: [FormsModule, UserHeaderComponent, CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: {
    name: string;
    fullName: string;
    profilePhoto: string;
    refferalCode?: string;
  } = {
    name: 'NIZAM',
    fullName: 'NIZAM P H',
    profilePhoto: '',
  };

  rewards: IRewards = {};
  private subscriptions = new Subscription();
  isEligibleForsignupBonus: boolean = true;
  isEligibleForReferralBonus: boolean = false;
  isEligibleForLoyaltyRewards: boolean = false;

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.fetchUserDetails();
  }
  fetchUserDetails(): void {
    const userDetailsSubscription = this.apiService.getUserProfile().subscribe({
      next: (response: IResponseModel<IUser>) => {
        console.log(response);
        this.user.name = response.data.name;
        this.user.fullName = response.data.name || 'unknown user';
        this.user.profilePhoto = response.data.profilePhoto;
        this.user.refferalCode = response.data.referralCode;

        this.isEligibleForLoyaltyRewards =
          response.data.isEligibleForLoyaltyRewards;
        this.isEligibleForReferralBonus =
          response.data.isEligibleForReferralBonus;
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
  uploadPhoto(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    this.apiService.getUploadURL().subscribe({
      next: (response: { uploadURL: string; fileKey: string }) => {
        const uploadURL = response.uploadURL;
        const fileKey = response.fileKey;

        // Upload file to S3 using the signed URL
        fetch(uploadURL, {
          method: 'PUT',
          headers: { 'Content-Type': file.type },
          body: file,
        })
          .then(() => {
            alert('Photo uploaded successfully!');

            // Set the user's profile photo to the S3 URL
            this.apiService.getDownloadURL(fileKey).subscribe({
              next: (result: { signedUrl: string }) => {
                this.user.profilePhoto = result.signedUrl;
              },
              error: (err: any) =>
                console.error('Failed to get download URL:', err),
            });
          })
          .catch((err) => console.error('Upload error:', err));
      },
      error: (err: any) => console.error('Failed to get upload URL:', err),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
