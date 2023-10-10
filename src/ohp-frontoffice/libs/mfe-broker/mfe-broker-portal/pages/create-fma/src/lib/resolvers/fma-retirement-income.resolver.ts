import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { CheckRetirementService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { FMAService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaRetirementIncomeResolver {
  constructor(private fmaService: FMAService, private checkRetirementService: CheckRetirementService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.fmaService.fMAGetRetirementIncomeDetails(route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number).pipe(
      map(response => ({
        ...response,
        applicantRetirementIncomeDetails: response.applicantRetirementIncomeDetails?.map(applicant => {
          this.checkRetirementService.applicantRetiresById(applicant.applicantInfo?.applicantId as number).subscribe(bool => {
            if (!bool) {
              applicant = { ...applicant, retirementIncomeDetails: [] };
            }
          });
          return applicant;
        }),
      })),
    );
  }
}
