import { Injectable } from '@angular/core';

import { IntermediaryResponse } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Injectable({
  providedIn: 'root',
})
export class IntermediaryDetailsService {
  private intermediaryDetails: IntermediaryResponse | null = null;

  constructor() {}

  setIntermediaryDetails(data: IntermediaryResponse) {
    this.intermediaryDetails = data;
  }

  getIntermediaryDetails(): IntermediaryResponse {
    return this.intermediaryDetails as IntermediaryResponse;
  }
}
