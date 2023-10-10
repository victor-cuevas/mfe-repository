import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';

import { CodeTablesService, FeLoanPart, MortgageTermService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AmortizationMethod } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CustomValidators } from '@close-front-office/mfe-broker/core';

@Component({
  selector: 'mbp-split-product-modal',
  templateUrl: './split-product-modal.component.html',
})
export class SplitProductModalComponent implements OnDestroy {
  highestMortgageTerm$ = this.mortgageTermService.highestMortgageTerm$;
  onDestroy$ = new Subject();
  loanAmount = 0;
  typeOptions = this.codeTablesService.getCodeTable('cdtb-amortizationmethod');

  splitLoanPartForm: FormArray = this.fb.array([this.createLoanPart(this.config.data?.loanPart?.loanPartId), this.createLoanPart()]);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private mortgageTermService: MortgageTermService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private codeTablesService: CodeTablesService,
  ) {}

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  createLoanPart(loanPartId?: number | null): AbstractControl {
    const loanPart = this.config?.data?.loanPart;
    const { years, months } = this.mortgageTermService.getMortgageTermMonthsAndYears(loanPart?.mortgageTerm);
    const formGroup = this.fb.group({
      loanPartId: loanPartId,
      loanPartAmount: [loanPart?.loanPartAmount / 2, Validators.required],
      feMortgageTerm: this.fb.group({
        years: loanPart?.feMortgageTerm?.years || years,
        months: loanPart?.feMortgageTerm?.months || months,
      }),
      mortgageTerm: [
        loanPart?.mortgageTerm,
        [Validators.min(1), CustomValidators.maxApplicantAge(this.mortgageTermService.maxMortgageTerm)],
      ],
      loanPartType: { value: loanPart?.loanPartType, disabled: true },
      repaymentType: loanPart?.repaymentType || AmortizationMethod.ANNUITY,
      product: this.fb.group({
        code: [loanPart?.product?.code, Validators.required],
        name: [loanPart?.product?.name],
        interestRate: [loanPart?.product?.interestRate],
        baseInterestRate: [loanPart?.product?.baseInterestRate],
      }),
    });

    formGroup
      ?.get('product')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.mortgageTermService.checkProductAvailability(formGroup, this.config.data?.appId, this.config.data?.loanId));

    formGroup
      .get('feMortgageTerm')
      ?.get('years')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.mortgageTermService.updateMortgageTermTotal(formGroup);
      });

    formGroup
      .get('feMortgageTerm')
      ?.get('months')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.mortgageTermService.updateMortgageTermTotal(formGroup);
      });

    formGroup
      .get('mortgageTerm')
      ?.valueChanges.pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.mortgageTermService.checkProductAvailability(formGroup, this.config.data?.appId, this.config.data?.loanId);
        this.updateHighestMortgageTerm();
      });

    return formGroup;
  }

  public closeDialog(loanParts?: FeLoanPart[]): void {
    const mappedLoanParts = loanParts?.map(loanPart => ({
      ...loanPart,
      mortgageTerm: this.mortgageTermService.getMortgageTermTotalMonths(loanPart.feMortgageTerm?.years, loanPart.feMortgageTerm?.months),
    }));

    this.ref.close(mappedLoanParts);
  }

  public checkMonths(i: number) {
    const feMortgageTerm = this.splitLoanPartForm.at(i)?.get('feMortgageTerm');
    if (feMortgageTerm?.get('years')?.value === 40) {
      feMortgageTerm?.get('months')?.setValue(0);
    }
  }

  public divideAmount(index: number) {
    const otherIndex = index === 0 ? 1 : 0;
    const updatedAmount = this.splitLoanPartForm.at(index).get('loanPartAmount')?.value;
    this.splitLoanPartForm
      .at(otherIndex)
      .get('loanPartAmount')
      ?.setValue(this.config.data.loanPart.loanPartAmount - updatedAmount);
  }

  private updateHighestMortgageTerm() {
    this.mortgageTermService.updateHighestMortgageTerm(this.splitLoanPartForm.getRawValue());
  }
}
