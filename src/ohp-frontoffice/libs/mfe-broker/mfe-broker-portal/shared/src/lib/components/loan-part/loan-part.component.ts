import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';

import { CaseSummaryService, CodeTablesService, DataService, FeLoanPart } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { BrokerCodeTableOption, CasePurposeType, LoanPartType, LoanProduct2 } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { ProductSelectionTableComponent } from '../product-selection-table/product-selection-table.component';
import { SplitProductModalComponent } from '../split-product-modal/split-product-modal.component';

@Component({
  selector: 'mbp-loan-part',
  templateUrl: './loan-part.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoanPartComponent implements OnInit, OnDestroy {
  private appId =
    this.route.snapshot.data.summary.applicationDraftId ||
    this.route.snapshot.data?.illustrationJourney?.illustrationData?.applicationDraftId ||
    this.route.snapshot.data?.dipJourney?.dipData?.applicationDraftId;
  private loanId =
    this.route.snapshot.data.summary.loanId ||
    this.route.snapshot.data?.illustrationJourney?.illustrationData?.loanId ||
    this.route.snapshot.data?.dipJourney?.dipData?.loanId;

  productTableRef?: DynamicDialogRef;
  splitLoanPartRef?: DynamicDialogRef;
  onDestroy$ = new Subject();

  typeOptions = this.codeTablesService.getCodeTable('cdtb-amortizationmethod');
  loanPartTypeOptions = this.codeTablesService
    .getCodeTable('cdtb-broker-loanparttype')
    .filter(
      (el: BrokerCodeTableOption) =>
        (this.route.snapshot.data.summary?.caseData?.casePurposeType === CasePurposeType.Purchase && el.value === LoanPartType.PURCHASE) ||
        (this.route.snapshot.data.summary?.caseData?.casePurposeType === CasePurposeType.Remortgage && el.value !== LoanPartType.PURCHASE),
    ); // TODO hide ADDITIONAL_BORROWING if casePurposeType === CasePurposeType.REMORTGAGE && borrowing step is hidden
  loanPartType: typeof LoanPartType = LoanPartType;
  invalidLoanPartsProduct$ = this.caseSummaryService.invalidLoanPartsProduct$;

  MODE: typeof Mode = Mode;

  @Input() loanPartForm?: FormGroup;
  @Input() loanPartIndex = 0;
  @Input() ltv?: number;
  @Input() isMandatory?: boolean;
  @Input() totalLoanAmount?: number | null;
  @Input() purchasePrice?: number | null;

  @Output() removeLoanPart = new EventEmitter<number>();
  @Output() splitLoanPart = new EventEmitter<{ data: FeLoanPart[]; index: number }>();

  constructor(
    public dialogService: DialogService,
    private cd: ChangeDetectorRef,
    public dataService: DataService,
    private codeTablesService: CodeTablesService,
    private caseSummaryService: CaseSummaryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.caseSummaryService.invalidLoanPartsProduct$.pipe(delay(10), takeUntil(this.onDestroy$)).subscribe(() => this.cd.detectChanges());
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

  onSelectProduct() {
    this.productTableRef = this.dialogService.open(ProductSelectionTableComponent, {
      data: {
        loanAmount: this.totalLoanAmount as number,
        tomYears: this.loanPartForm?.get('feMortgageTerm')?.get('years')?.value,
        tomMonths: this.loanPartForm?.get('feMortgageTerm')?.get('months')?.value,
        productType: this.loanPartForm?.get('repaymentType')?.value,
        ltv: this.ltv,
        currentProduct: this.loanPartForm?.get('product')?.value,
        purchasePrice: this.purchasePrice,
      },
      header: 'List of Products',
      width: '90%',
    });

    this.productTableRef.onClose.subscribe((selectedProduct: LoanProduct2) => {
      if (selectedProduct) {
        this.loanPartForm?.get('product')?.patchValue({
          code: selectedProduct.productCode,
          name: selectedProduct.productName,
          interestRate: selectedProduct.initialRate,
          baseInterestRate: selectedProduct.initialRate,
        });
        this.loanPartForm?.markAsDirty();
        this.cd.detectChanges();
      }
    });
  }

  onSplitLoan() {
    this.splitLoanPartRef = this.dialogService.open(SplitProductModalComponent, {
      data: {
        loanPart: this.loanPartForm?.getRawValue(),
        appId: this.appId,
        loanId: this.loanId,
      },
      header: 'Split Loan Part',
      width: '50%',
    });

    this.splitLoanPartRef.onClose.pipe(takeUntil(this.onDestroy$)).subscribe((loanParts: FeLoanPart[]) => {
      if (loanParts) {
        this.splitLoanPart.emit({ data: loanParts, index: this.loanPartIndex });
      }
    });
  }

  getMenuOptions(): MenuItem[] {
    return [
      {
        label: 'Split loan',
        disabled: !this.dataService.activeJourney || !this.loanPartForm?.valid,
        command: () => this.onSplitLoan(),
      },
      {
        label: 'Remove',
        disabled: !this.dataService.activeJourney || this.isMandatory,
        command: () => {
          this.removeLoanPart.emit(this.loanPartIndex);
        },
      },
    ];
  }

  // Don't remove
  onBlur() {}
}
