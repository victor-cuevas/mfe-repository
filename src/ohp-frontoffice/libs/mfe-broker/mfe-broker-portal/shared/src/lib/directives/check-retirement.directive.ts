import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { RequiredInput } from '@close-front-office/mfe-broker/core';
import { CheckRetirementService, MortgageTermService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { ApplicantPersonalDetails } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Directive({
  selector: '[cfoRetirement]',
})
export class CheckRetirementDirective implements OnInit, OnDestroy {
  @Input() @RequiredInput cfoRetirement!: number;
  @Input() cfoRetirementElse?: TemplateRef<unknown>;

  onDestroy$ = new Subject();

  constructor(
    private checkRetirementService: CheckRetirementService,
    private mortgageTermService: MortgageTermService,
    private templateRef: TemplateRef<never>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit() {
    this.displayTemplate();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  private displayTemplate() {
    this.checkRetirementService.getRetiringApplicants().subscribe(applicants => {
      const applicantRetires = applicants?.some((applicant: ApplicantPersonalDetails) => {
        return applicant.applicantId === this.cfoRetirement;
      });

      if (applicantRetires) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else if (this.cfoRetirementElse) {
        this.viewContainer.createEmbeddedView(this.cfoRetirementElse);
      } else {
        this.viewContainer.clear();
      }
    });
  }
}
