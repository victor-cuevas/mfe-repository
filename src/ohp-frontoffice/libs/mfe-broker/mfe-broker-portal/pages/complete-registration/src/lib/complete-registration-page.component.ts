import { Component } from '@angular/core';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { UserDetailsService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { UserProfileResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'mbp-complete-registration-page',
  templateUrl: './complete-registration-page.component.html',
})
export class CompleteRegistrationPageComponent {
  intermediaryData: UserProfileResponse = this.userDetailsService.getUserDetails();

  constructor(public spinnerService: SpinnerService, private userDetailsService: UserDetailsService) {}
}
