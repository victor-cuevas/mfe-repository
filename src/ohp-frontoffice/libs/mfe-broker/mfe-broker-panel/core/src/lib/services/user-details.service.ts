import { LenderUserResponse, UserProfileResponse } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  private intermediaryDetails: UserProfileResponse | null = null;
  private userLenderDetails: LenderUserResponse | null = null;

  constructor() {}

  setUserDetails(data: UserProfileResponse) {
    this.intermediaryDetails = data;
  }

  getUserDetails(): UserProfileResponse {
    return this.intermediaryDetails as UserProfileResponse;
  }

  setLenderUserDetails(data: LenderUserResponse) {
    this.userLenderDetails = data;
  }

  getLenderUserDetails(): LenderUserResponse {
    return this.userLenderDetails as LenderUserResponse;
  }
}
