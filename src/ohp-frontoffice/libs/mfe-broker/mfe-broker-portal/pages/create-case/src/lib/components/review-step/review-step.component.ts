import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  CaseSummaryService,
  DataService,
  FeApplicant,
  getPortalUser,
  RoutePaths,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AuthorizationContextModel, CaseService, NewCaseRequest } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';

import { AddApplicantsData } from '../../models/addApplicantsData';
import { CreateCaseData } from '../../models/createCaseData';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'mbp-review-step',
  templateUrl: './review-step.component.html',
})
export class ReviewStepComponent implements OnInit, OnDestroy {
  routePaths: typeof RoutePaths = RoutePaths;
  CONFIG = CONFIGURATION_MOCK;
  firstStepData: CreateCaseData = this.dataService.getFormData('step1');
  secondStepData: AddApplicantsData = this.dataService.getFormData('step2');
  loggedInUser: AuthorizationContextModel | undefined;
  killerQuestions = Object.values(CONFIGURATION_MOCK.CONDITIONS[this.firstStepData.casePurposeType as 'PURCHASE' | 'REMORTGAGE']);
  firmId = this.caseSummaryService.fimData?.firmId;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private service: CaseService,
    private store: Store,
    private toastService: ToastService,
    private caseSummaryService: CaseSummaryService,
    private spinnerService: SpinnerService,
    private titleCasePipe: TitleCasePipe,
  ) {
    this.store
      .select(getPortalUser)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(user => (this.loggedInUser = user));
  }

  ngOnInit(): void {
    if (!this.firstStepData || !this.secondStepData) {
      this.router.navigate(['../initial-step'], { relativeTo: this.route });
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  submit() {
    // TODO modal check before sending
    this.spinnerService.setIsLoading(true);
    this.secondStepData.applicants.forEach(item => {
      if (item.mortgageAccountNumber) {
        item.mortgageAccountNumber = item.mortgageAccountNumber.toString();
      } else {
        delete item.mortgageAccountNumber;
      }
    });

    const payload: NewCaseRequest = {
      ownerId: this.firmId ?? '',
      assigneeId: this.firstStepData.caseOwner.intermediaryId ?? '',
      createdBy: this.loggedInUser?.intermediaryId ?? '',
      casePurposeType: this.firstStepData.casePurposeType,
      propertyPurpose: this.firstStepData.propertyPurpose,
      confirmStatements: this.firstStepData.killerQuestions.statementsCorrect,
      confirmApplicantsPermission: this.firstStepData.killerQuestions.permissionCheck,
      applicantConsentToUseData: this.firstStepData.killerQuestions.dataConsent,
      agreeToDocumentsAndTAndC: this.firstStepData.killerQuestions.termsAndConditions,
      applicants: this.secondStepData.applicants.map((applicant: FeApplicant) => ({
        ...applicant,
        firstName: this.titleCasePipe.transform(applicant?.firstName),
        familyName: this.titleCasePipe.transform(applicant?.familyName),
        dateOfBirth: applicant.dateOfBirth
          ? new Date(applicant?.dateOfBirth?.getTime() - applicant?.dateOfBirth?.getTimezoneOffset() * 60 * 1000).toISOString()
          : undefined,
      })),
    };
    this.service
      .casePost(payload)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value: { caseId: string }) => {
        this.router.navigate([`../../${value.caseId}`], { relativeTo: this.route });
        this.toastService.showMessage({ summary: `The case has been successfully created` });
      });
  }

  onKeyboardSubmit(event: KeyboardEvent) {
    if (event.key === 'Enter') this.submit();
  }
}
