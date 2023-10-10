import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IntermediaryDetailsService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { IntermediaryResponse, IntermediarySummary } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Component({
  templateUrl: './intermediary-linked-advisors.component.html',
})
export class IntermediaryLinkedAdvisorsComponent {
  intermediaryDetails: IntermediaryResponse = this.intermediaryDetailsService.getIntermediaryDetails();
  advisors: IntermediarySummary[] = this.intermediaryDetails?.roleMappings || [];

  constructor(private route: ActivatedRoute, private intermediaryDetailsService: IntermediaryDetailsService) {}
}
