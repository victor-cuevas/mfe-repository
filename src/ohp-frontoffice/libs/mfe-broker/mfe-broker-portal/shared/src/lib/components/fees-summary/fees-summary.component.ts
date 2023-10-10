import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FeeService, FeFee } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { CostPaymentMethod } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'mbp-fees-summary',
  templateUrl: './fees-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeesSummaryComponent implements OnInit, OnChanges, OnDestroy {
  onDestroy$ = new Subject();
  feesToPay$ = new BehaviorSubject<Array<FeFee>>([]);
  otherFees$ = new BehaviorSubject<Array<FeFee>>([]);
  feesToPayAmount$ = new BehaviorSubject(0);
  otherFeesAmount$ = new BehaviorSubject(0);

  @Input() fees: FeFee[] = [];
  @Input() readOnlyMode = false;

  @Input() paymentActive?: boolean;

  constructor(private feeService: FeeService) {}

  ngOnInit() {
    this.onChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.fees) {
      this.filterFees();
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  onChanges() {
    this.feesToPay$.pipe(takeUntil(this.onDestroy$)).subscribe(value => this.feesToPayAmount$.next(this.feeService.calculateTotal(value)));
    this.otherFees$.pipe(takeUntil(this.onDestroy$)).subscribe(value => this.otherFeesAmount$.next(this.feeService.calculateTotal(value)));
  }

  filterFees() {
    this.feesToPay$.next([...this.fees].filter(fee => fee.feeAmount && fee.feeType && fee.paymentMethod === CostPaymentMethod.DIRECT));
    this.otherFees$.next(
      [...this.fees].filter(fee => (fee.feeAmount && fee.paymentMethod === CostPaymentMethod.ADD_TO_PRINCIPAL) || !fee.feeType),
    );
  }
}
