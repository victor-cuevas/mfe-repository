import { Injectable } from '@angular/core';

import { UserProfileResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  private intermediaryDetails: UserProfileResponse | null = null;

  constructor() {}

  setUserDetails(data: UserProfileResponse) {
    this.intermediaryDetails = data;
  }

  getUserDetails(): UserProfileResponse {
    return this.intermediaryDetails as UserProfileResponse;
  }
}
