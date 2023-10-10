import { Injectable, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { map, takeUntil } from 'rxjs/operators';
import { ApplicantPersonalDetails } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { getPersonalDetails } from '../state/personal-details';
import { MortgageTermService } from './mortgage-term.service';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Injectable({
  providedIn: 'root',
})
export class CheckRetirementService implements OnDestroy {
  private onDestroy$ = new Subject<boolean>();
  private minYearsUntilRetirement = CONFIGURATION_MOCK.MIN_YEARS_UNTIL_RETIREMENT;

  constructor(private store: Store, private mortgageTermService: MortgageTermService) {}

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  getRetiringApplicants(): Observable<ApplicantPersonalDetails[] | undefined> {
    return combineLatest([this.store.select(getPersonalDetails), this.mortgageTermService.highestMortgageTerm$]).pipe(
      takeUntil(this.onDestroy$),
      map(([personalDetails, highestMortgageTerm]) => {
        return personalDetails?.applicantPersonalDetails?.filter(applicant => {
          return this.applicantRetiresWithinMortgageTerm(applicant, highestMortgageTerm) || applicant.isApplicantRetired;
        });
      }),
    );
  }

  getAlreadyRetiredApplicants() {
    return this.store.select(getPersonalDetails).pipe(
      takeUntil(this.onDestroy$),
      map(personalDetails => {
        return personalDetails?.applicantPersonalDetails?.filter(applicant => applicant.isApplicantRetired);
      }),
    );
  }

  applicantRetiresWithinMortgageTerm(applicant: ApplicantPersonalDetails, highestMortgageTerm: number): boolean {
    if (applicant.birthDate && applicant.expectedRetirementAge) {
      const birthDate = new Date(applicant.birthDate);
      const retirementDate = new Date();
      const today = new Date();
      const mortgageEndDate = new Date();
      const currentAge = today.getFullYear() - birthDate.getFullYear();
      const limitedExpectedRetirementAge = Math.min(applicant.expectedRetirementAge, CONFIGURATION_MOCK.MAX_RETIREMENT_AGE);
      const yearsUntilRetirement = limitedExpectedRetirementAge - currentAge;

      retirementDate.setFullYear(birthDate.getFullYear() + limitedExpectedRetirementAge);
      mortgageEndDate.setMonth(today.getMonth() + highestMortgageTerm);

      return retirementDate < mortgageEndDate && yearsUntilRetirement < this.minYearsUntilRetirement;
    }
    return false;
  }

  /**
   * checks if the applicant is already retired or if they will retire within the highest mortgage term
   * based on the provided applicant ID.
   *
   * @param applicantId
   */
  applicantRetiresById(applicantId?: number | null): Observable<boolean> {
    return this.getRetiringApplicants().pipe(
      takeUntil(this.onDestroy$),
      map(retiringApplicants =>
        !retiringApplicants ? false : retiringApplicants?.some(applicant => applicant.applicantId === applicantId),
      ),
    );
  }

  /**
   * only checks if the applicant is already retired based on the provided applicant ID.
   *
   * @param applicantId
   */
  applicantIsRetiredById(applicantId?: number | null): Observable<boolean> {
    return this.getAlreadyRetiredApplicants().pipe(
      takeUntil(this.onDestroy$),
      map(retiredApplicants => (!retiredApplicants ? false : retiredApplicants?.some(applicant => applicant.applicantId === applicantId))),
    );
  }
}
