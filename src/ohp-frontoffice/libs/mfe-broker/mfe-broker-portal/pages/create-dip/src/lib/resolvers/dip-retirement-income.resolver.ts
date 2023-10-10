import { Injectable } from '@angular/core';
import { CheckRetirementService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { DIPService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DipRetirementIncomeResolver {
  constructor(private dipService: DIPService, private checkRetirementService: CheckRetirementService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.dipService.dIPGetRetirementIncomeDetails(route.parent?.data.dipJourney?.dipData?.applicationDraftId).pipe(
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
