import { Injectable } from '@angular/core';
import { FeFmaValuationAndContact } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { FMAService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FmaValuationDetailsResolver {
  constructor(private fmaService: FMAService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<FeFmaValuationAndContact> {
    return forkJoin([
      this.fmaService.fMAGetValuationDetails(route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number),
      this.fmaService.fMAGetContactDetails(route.parent?.data.fmaJourney?.fmaData?.applicationDraftId as number),
    ]).pipe(
      map(([valuationDetails, contactDetails]) => {
        return {
          valuationDetails,
          applicantDetails: contactDetails.applicants?.map((applicant, index) => {
            return {
              key: index,
              applicantName: `${applicant.applicantInfo?.firstName?.trim()} ${
                applicant.applicantInfo?.familyNamePrefix
                  ? applicant.applicantInfo?.familyNamePrefix + ' ' + applicant.applicantInfo?.familyName
                  : applicant.applicantInfo?.familyName
              }`,
              preferredContactMethod: applicant.contactDetails?.preferredContactMethod,
              mobilePhone: applicant.contactDetails?.mobilePhone,
              workPhone: applicant.contactDetails?.workPhone,
              homePhone: applicant.contactDetails?.homePhone,
              email: applicant.contactDetails?.email,
            };
          }),
        };
      }),
    );
  }
}
