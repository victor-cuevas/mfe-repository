import { Injectable } from '@angular/core';
import { FeFee } from '../models/fe-fee';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CodeTablesService } from './code-tables.service';
import { CostPaymentMethod, LenderFee, LenderFeeType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Injectable({
  providedIn: 'root',
})
export class FeeService {
  allFees$ = new BehaviorSubject<Array<FeFee>>([]);
  feeTypes = this.codeTablesService.getCodeTable('cdtb-broker-lenderfeetype');
  valuationTypeOptions = this.codeTablesService.getCodeTable('cdtb-ads-valuationtype');
  lenderFeeTypeOptions = this.codeTablesService.getCodeTable('cdtb-broker-lenderfeetype');

  constructor(private translateService: TranslateService, private codeTablesService: CodeTablesService) {}

  mapFeeLabel(lenderFeeType: LenderFee): string {
    const name = lenderFeeType.name as string;
    const feeType = lenderFeeType.feeType as string;
    switch (lenderFeeType.feeType) {
      case LenderFeeType.VALUATION_FEE:
        return this.valuationTypeOptions.find(el => el.value === name)?.label || name;
      case LenderFeeType.APPLICATION_FEE:
        return this.lenderFeeTypeOptions.find(el => el.value === name)?.label || name;
      case LenderFeeType.COMPLETION_FEE:
      default:
        return this.lenderFeeTypeOptions.find(el => el.value === feeType)?.label || feeType;
    }
  }

  mapPaymentMethod(
    paymentMethod?: string | null,
    feeType?: string | null,
  ): string | undefined | null | { value: string; disabled: boolean } {
    if (feeType === LenderFeeType.COMPLETION_FEE) {
      return paymentMethod;
    }
    return { value: CostPaymentMethod.DIRECT, disabled: true };
  }

  calculateTotal(fees: Array<FeFee>, filterFn?: (currentValue: any) => boolean): number {
    return fees.reduce((previousValue, currentValue) => {
      if (filterFn) {
        return filterFn(currentValue) && currentValue?.feeAmount ? previousValue + currentValue?.feeAmount : previousValue;
      } else {
        return currentValue.feeAmount ? previousValue + currentValue.feeAmount : previousValue;
      }
    }, 0);
  }

  updateAllFees(form: FormGroup) {
    const lenderFees = form.get('lenderFees') as FormArray;
    const intermediaryFees = form.get('intermediaryFees') as FormArray;
    combineLatest([lenderFees.valueChanges, intermediaryFees.valueChanges]).subscribe(() => {
      this.allFees$.next([...lenderFees.getRawValue(), ...intermediaryFees.getRawValue()]);
    });
  }
}
