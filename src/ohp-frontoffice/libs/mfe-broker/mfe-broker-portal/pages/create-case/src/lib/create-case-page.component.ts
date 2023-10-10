import { Component, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DataService, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mbp-create-case-page',
  templateUrl: './create-case-page.component.html',
})
export class CreateCasePageComponent implements OnDestroy {
  routePaths: typeof RoutePaths = RoutePaths;
  // breadcrumb data
  breadcrumb: MenuItem[] = [{ label: 'Case management', routerLink: '../' }, { label: 'Create case' }];

  // form status var
  formStatus: any = {};
  subscription: Subscription;

  // steps to display in the timeline with their respective states

  steps: MenuItem[] = [
    {
      label: this.translate.instant('createCase.steps.createCase'),
      routerLink: this.routePaths.CREATE_CASE_INITIAL_STEP,
      styleClass: 'incomplete',
    },
    {
      label: this.translate.instant('createCase.steps.addApplicants'),
      routerLink: this.routePaths.CREATE_CASE_ADD_APPLICANT,
      styleClass: 'incomplete',
    },
    {
      label: this.translate.instant('createCase.steps.review'),
      styleClass: 'incomplete',
      disabled: true,
    },
  ];

  constructor(private dataService: DataService, private translate: TranslateService) {
    // subscribtion to check if all fields of current step form are filled in
    this.subscription = this.dataService.formStatus$.subscribe(status => {
      this.formStatus = status;
      this.formStatus.step1 === 'VALID' && this.formStatus.step2 === 'VALID' ? this.enableReviewStep() : this.disableReviewStep();

      // check if current step form is valid and if so update step css class
      this.steps = this.steps.map((el: MenuItem, i: number) => {
        return { ...el, styleClass: this.formStatus[`step${i + 1}`] === 'VALID' ? 'complete' : 'incomplete' };
      });
    });
  }

  ngOnDestroy(): void {
    this.dataService.reset();
    this.subscription.unsubscribe();
  }

  private enableReviewStep() {
    this.steps[2].routerLink = './review';
    this.steps[2].disabled = false;
  }

  private disableReviewStep() {
    delete this.steps[2].routerLink;
    this.steps[2].disabled = true;
  }
}
