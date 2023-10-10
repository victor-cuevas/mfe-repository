import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  CodeTablesService,
  DataService,
  FeeService,
  RoutePaths,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  AdviceAndFeesResponse,
  AdviceGiven,
  CostPaymentMethod,
  IntermediaryFee,
  LenderFee,
  LenderFeeType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'mbp-advice-fees',
  templateUrl: './advice-fees.component.html',
})
export class AdviceFeesComponent implements OnInit, OnDestroy {
  onDestroy$ = new Subject();
  feeTypeEnum = LenderFeeType;
  totalAdvanceLenderFees = 0;
  caseId: string | null | undefined;
  routePaths: typeof RoutePaths = RoutePaths;
  initialData: AdviceAndFeesResponse = this.route.snapshot.data.adviceFeesData || {};
  MODE: typeof Mode = Mode;
  adviceGiven: typeof AdviceGiven = AdviceGiven;

  adviceGivenOptions = this.codeTablesService.getCodeTable('cdtb-broker-advicegiven');
  whenPayableOptions = this.codeTablesService.getCodeTable('cdtb-broker-whenpayable');
  paymentMethodOptions = this.codeTablesService.getCodeTable('cdtb-costpaymentmethod');

  adviceFeesForm: FormGroup = this.fb.group({
    adviceGiven: [this.adviceGivenOptions[0], Validators.required],
    adviceAccepted: [true],
    valuationFeeAmount: null,
    lenderFees: this.fb.array([]),
    intermediaryFees: this.fb.array([]),
    totalLenderFeesInAdvance: null,
  });

  @ViewChild('dropDown') private dropdown!: Dropdown;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private feeService: FeeService,
    public stepSetupService: StepSetupService,
    public dataService: DataService,
    private codeTablesService: CodeTablesService,
  ) {}

  get lenderFees(): FormArray {
    return this.adviceFeesForm.controls['lenderFees'] as FormArray;
  }

  get intermediaryFees(): FormArray {
    return this.adviceFeesForm.controls['intermediaryFees'] as FormArray;
  }

  ngOnInit(): void {
    this.setTotalAdvanceLenderFees();
    this.feeService.updateAllFees(this.adviceFeesForm);
    this.setFormData();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  private setFormData() {
    if (this.initialData.intermediaryFees?.length) {
      this.initialData.intermediaryFees?.forEach(intermediaryFee => this.addIntermediaryFee(intermediaryFee));
    } else {
      this.addIntermediaryFee();
    }

    this.adviceFeesForm.get('adviceGiven')?.valueChanges.subscribe((val: any) => {
      const adviceAcceptedControl = this.adviceFeesForm.controls.adviceAccepted;

      if (val && this.adviceFeesForm.get('adviceGiven')?.value === AdviceGiven.ADVISED) {
        adviceAcceptedControl.setValidators(Validators.required);
      } else {
        adviceAcceptedControl.setValidators(null);
      }
      adviceAcceptedControl.updateValueAndValidity({ emitEvent: false });
    });
  }

  public addLenderFee(lenderFee: LenderFee): void {
    this.lenderFees.push(
      this.fb.group({
        feeType: [
          {
            value: lenderFee?.feeType,
            disabled: true,
          },
        ],
        feFeeType: [
          {
            value: this.feeService.mapFeeLabel(lenderFee),
            disabled: true,
          },
        ],
        feeAmount: [{ value: lenderFee?.feeAmount, disabled: true }],
        name: lenderFee?.name,
        paymentMethod: [this.feeService.mapPaymentMethod(lenderFee?.paymentMethod, lenderFee?.feeType), Validators.required],
        valuationType: lenderFee?.valuationType,
      }),
    );
  }

  private addIntermediaryFee(intermediaryFee?: IntermediaryFee) {
    this.intermediaryFees.push(
      this.fb.group({
        feeAmount: [intermediaryFee?.feeAmount, Validators.required],
        whenPayable: [intermediaryFee?.whenPayable, Validators.required],
        payableTo: [intermediaryFee?.payableTo, Validators.required],
      }),
    );
  }

  private setTotalAdvanceLenderFees() {
    const filterFn = (currentValue: LenderFee): boolean => {
      return currentValue?.paymentMethod === CostPaymentMethod.DIRECT;
    };
    this.lenderFees.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.totalAdvanceLenderFees = this.feeService.calculateTotal(this.lenderFees.getRawValue(), filterFn);
    });
  }
}
