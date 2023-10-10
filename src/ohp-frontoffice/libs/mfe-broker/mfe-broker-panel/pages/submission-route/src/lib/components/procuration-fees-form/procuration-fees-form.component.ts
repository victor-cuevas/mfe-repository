import { AfterViewInit, Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  ApplicationType,
  EndingType,
  FeeBasis,
  FeeUnit,
  ProcurationFee,
  ProcurationFeeModel,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

type TrailEndingType = 'Redemption' | 'InitialTerm' | 'InitialTermUnlessRedeemed';
type Unit = 'BasisPoints' | 'Currency';
type Basis = 'LoanAmount' | 'OutstandingBalance' | null;

interface ProcurationFeesFormValues {
  value?: number | null;
  unit?: Unit;
  basis?: Basis;
  trailValue?: number | null;
  trailUnit?: Unit;
  trailBasis?: Basis;
  trailStartingMonth?: number | null;
  trailPeriodInMonths?: number | null;
  trailEndingType?: TrailEndingType;
  useDefaultFees?: boolean | null;
}

@Component({
  selector: 'mbpanel-procuration-fees-form',
  templateUrl: './procuration-fees-form.component.html',
})
export class ProcurationFeesFormComponent implements AfterViewInit {
  currentData: ProcurationFeeModel[] = this.route.snapshot.data.fetchedData?.procurationFees;
  isReadOnlyMode = this.route.parent?.snapshot.data.readOnlyMode;

  @Input() procurationFees: ProcurationFee[] | undefined;
  @Input() defaultProcurationFees: ProcurationFee[] | undefined;

  procurationFeesOptions = [
    { label: this.translate.instant('submissionRoute.labels.purchase'), value: ApplicationType.NewLending },
    { label: this.translate.instant('submissionRoute.labels.remortgage'), value: ApplicationType.Remortgage },
  ];

  completionOptions = [
    { label: 'bps', value: FeeUnit.BasisPoints },
    { label: '£', value: FeeUnit.Currency },
  ];

  basedOnOptions = [
    { label: this.translate.instant('submissionRoute.labels.loanAmount'), value: FeeBasis.LoanAmount },
    { label: this.translate.instant('submissionRoute.labels.outstandingBalance'), value: FeeBasis.OutstandingBalance },
  ];

  endingOptions = [
    { label: 'Initial term', value: EndingType.InitialTerm },
    { label: 'Initial term unless redeemed', value: EndingType.InitialTermUnlessRedeemed },
    { label: 'Redemption', value: EndingType.Redemption },
  ];

  procurationFeesFormArray = this.fb.array([]);

  constructor(private fb: FormBuilder, private translate: TranslateService, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.setFormData();
    if (this.isReadOnlyMode) {
      this.procurationFeesFormArray.disable({ emitEvent: false });
    }
  }

  private setFormData() {
    this.procurationFeesOptions?.forEach(applicationType => {
      const customFeesData: ProcurationFeesFormValues = this.mapValues(
        this.procurationFees?.find((el: ProcurationFee) => el.applicationType === applicationType.value),
      );
      const defaultFeesData: ProcurationFeesFormValues = this.mapValues(
        this.defaultProcurationFees?.find((el: ProcurationFee) => el.applicationType === applicationType.value),
      );
      const feeData = customFeesData?.value ? customFeesData : defaultFeesData;

      const feeForm = this.fb.group({
        applicationType: [applicationType.value],
        applicationTypeName: [applicationType.label],
        value: [{ value: feeData?.value, disabled: feeData?.useDefaultFees }, Validators.required],
        unit: [{ value: feeData?.unit, disabled: feeData?.useDefaultFees }],
        basis: [{ value: feeData?.basis, disabled: feeData?.useDefaultFees }],
        trailValue: [{ value: feeData?.trailValue, disabled: feeData?.useDefaultFees }, Validators.required],
        trailUnit: [{ value: feeData?.trailUnit, disabled: feeData?.useDefaultFees }],
        trailBasis: [{ value: feeData?.trailBasis, disabled: feeData?.useDefaultFees }],
        trailStartingMonth: [{ value: feeData?.trailStartingMonth, disabled: feeData?.useDefaultFees }, Validators.required],
        trailPeriodInMonths: [{ value: feeData?.trailPeriodInMonths, disabled: feeData?.useDefaultFees }, Validators.required],
        trailEndingType: [{ value: feeData?.trailEndingType, disabled: feeData?.useDefaultFees }],
        useDefaultFees: [feeData?.useDefaultFees],
      });

      const feeFormControls = feeForm.controls;

      feeFormControls.useDefaultFees.valueChanges.subscribe((useDefault: any) => {
        Object.keys(feeFormControls).forEach(key => {
          if (['applicationType', 'applicationTypeName', 'useDefaultFees'].includes(key)) return;
          const field = feeForm.get(key);

          if (useDefault) {
            field?.setValue(defaultFeesData[key as keyof ProcurationFeesFormValues]);
            field?.disable();
          } else {
            field?.setValue(customFeesData[key as keyof ProcurationFeesFormValues]);
            field?.enable();
          }
        });
      });

      this.procurationFeesFormArray.push(feeForm);
    });
  }

  private mapValues(fee?: ProcurationFee): ProcurationFeesFormValues {
    return {
      value: fee?.completionFee?.value,
      unit: fee?.completionFee?.unit,
      basis: fee?.completionFee?.basis,
      trailValue: fee?.trailFee?.value,
      trailUnit: fee?.trailFee?.unit,
      trailBasis: fee?.trailFee?.basis,
      trailStartingMonth: fee?.trailFee?.startingMonth,
      trailPeriodInMonths: fee?.trailFee?.periodInMonths,
      trailEndingType: fee?.trailFee?.endingType,
      useDefaultFees: fee?.isDefault,
    };
  }
}
