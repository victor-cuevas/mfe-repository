import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { RequiredInput } from '@close-front-office/mfe-broker/core';
import { CheckRetirementService, MortgageTermService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { RetirementIncomeSource } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[cfoProjectedValue]',
})
export class ProjectedValueDirective implements OnInit, OnDestroy {
  @Input() @RequiredInput cfoProjectedValue!: number;
  @Input() @RequiredInput cfoProjectedValueIncome?: string;
  isRetired = false;
  onDestroy$ = new Subject();

  constructor(
    private checkRetirementService: CheckRetirementService,
    private mortgageTermService: MortgageTermService,
    private templateRef: TemplateRef<never>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnInit() {
    this.checkRetirementService
      .applicantIsRetiredById(this.cfoProjectedValue)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(bool => {
        this.isRetired = bool;
      });

    this.displayTemplate();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  private displayTemplate() {
    if (!this.isRetired && this.cfoProjectedValueIncome === RetirementIncomeSource.PENSION_INCOME) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
