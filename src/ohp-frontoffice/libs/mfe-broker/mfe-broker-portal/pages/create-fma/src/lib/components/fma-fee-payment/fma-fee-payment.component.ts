import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { DataService, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  GlobalPayPaymentResponse,
  IntermediaryFee,
  Journey,
  LenderFee,
  LenderFeeType,
  PaymentService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRoute } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { RealexHpp } from './rxp-hpp';
import { ConfigContextService } from '@close-front-office/shared/config';
import { of, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'close-front-office-fma-fee-payment',
  templateUrl: './fma-fee-payment.component.html',
})
export class FmaFeePaymentComponent implements OnInit, AfterViewInit {
  readonly STEP_NAME = this.stepSetupService.feePayment.automationId;
  private onDestroy$ = new Subject();
  areFeesPaid: boolean = this.route.snapshot.data?.feePaymentData?.areFeesPaid;
  intermediaryFee: IntermediaryFee = this.route.snapshot.data?.feePaymentData?.intermediaryFees || {};
  lenderFees: LenderFee[] = this.route.snapshot.data?.feePaymentData?.lenderFees || [];
  productFeesToBePaid: LenderFee[] | undefined = this.route.snapshot.data?.feePaymentData?.productFeesToBePaid || [];
  productFeesAddedToLoan: LenderFee[] | undefined = this.route.snapshot.data?.feePaymentData?.productFeesAddedToLoan || [];

  applicationFee: LenderFee | undefined;
  valuationFee: LenderFee | undefined;

  totalFeeAmount = 0;
  totalAddedToLoanAmount = 0;
  jsonGlobalPayment = this.route.snapshot.data?.feePaymentData?.jsonGlobalPayment;

  applicationDraftId = this.route.snapshot.data?.feePaymentData?.applicationDraftId;
  loanId = this.route.snapshot.data?.feePaymentData?.loanId;

  errorMessage = '';
  code = '';

  isPrd = false;

  constructor(
    public dataService: DataService,
    private route: ActivatedRoute,
    private stepSetupService: StepSetupService,
    private paymentService: PaymentService,
    private translateService: TranslateService,
    private configService: ConfigContextService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const stage = this.configService.getConfigContext().STAGE;
    this.isPrd = stage === 'prd';
    this.setInitialValues();
    this.totalFeeAmount = this.calculateTotalFeeAmount();
    this.totalAddedToLoanAmount = this.calculateTotalAddedToLoanAmount();
  }

  ngAfterViewInit(): void {
    this.checkActiveJourney();
  }

  checkActiveJourney() {
    this.stepSetupService
      .checkActiveJourney(this.STEP_NAME)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(isActive => {
        if (isActive && this.areFeesPaid) {
          this.dataService.setFormStatus('VALID', this.STEP_NAME);
        }
      });
  }

  payNow() {
    RealexHpp.setHppUrl(this.isPrd);
    RealexHpp.lightbox.init(
      'autoload',
      (response: any) => {
        if (response.error) {
          //workaourd for Master error 200
          if (response.message.includes('200')) {
            this.paymentService.paymentInitiatePayment(this.applicationDraftId, this.loanId).subscribe(resp => {
              this.jsonGlobalPayment = resp;
            });
          }
          RealexHpp.closeModal();
          this.errorMessage = response.message.replace('<BR>', '');
          this.cd.detectChanges();
        } else {
          this.paymentService.paymentProcess(this.applicationDraftId, this.loanId, this.mapToDTO(response)).subscribe(resp => {
            if (resp && resp.resultCode) {
              this.code = resp.resultCode;
              if (this.code === '00') {
                this.dataService.setFormStatus('VALID', this.STEP_NAME);
                this.dataService
                  .saveProgress(Journey.Fma, this.applicationDraftId, this.loanId, { [this.STEP_NAME]: 'VALID' }, of(undefined))
                  .pipe(take(1))
                  .subscribe();
              } else {
                this.paymentService.paymentInitiatePayment(this.applicationDraftId, this.loanId).subscribe(resp => {
                  this.jsonGlobalPayment = resp;
                });
              }
              RealexHpp.closeModal();
              this.errorMessage = this.setErrorMessageToDisplay(this.code);
              this.cd.detectChanges();
            }
          });
        }
      },
      JSON.parse(this.jsonGlobalPayment),
    );
  }

  private setInitialValues() {
    this.lenderFees.forEach(lenderFee => {
      if (lenderFee.feeType === LenderFeeType.APPLICATION_FEE) {
        this.applicationFee = lenderFee;
      } else {
        this.valuationFee = lenderFee;
      }
    });
  }

  private calculateTotalFeeAmount(): number {
    const totalLenderFee = this.lenderFees.length
      ? (this.lenderFees.map(lenderFee => lenderFee.feeAmount).reduce((total, amount) => (total || 0) + (amount || 0)) as number)
      : 0;
    const totalProductFeesToBePaid = this.productFeesToBePaid?.length
      ? (this.productFeesToBePaid
          ?.map(productFee => productFee.feeAmount)
          .reduce((total, amount) => (total || 0) + (amount || 0)) as number)
      : 0;
    return totalLenderFee + totalProductFeesToBePaid;
  }

  private calculateTotalAddedToLoanAmount(): number {
    return this.productFeesAddedToLoan?.length
      ? (this.productFeesAddedToLoan
          ?.map(productFeeAddToLoan => productFeeAddToLoan.feeAmount)
          .reduce((total, amount) => (total || 0) + (amount || 0)) as number)
      : 0;
  }

  private mapToDTO(data: any): GlobalPayPaymentResponse {
    return {
      authcode: data.AUTHCODE,
      result: data.RESULT,
      message: data.MESSAGE,
      pasref: data.PASREF,
      avspostcoderesult: data.AVSPOSTCODERESULT,
      avsaddressresult: data.AVSADDRESSRESULT,
      cvnresult: data.CVNRESULT,
      account: data.ACCOUNT,
      merchanT_ID: data.MERCHANT_ID,
      ordeR_ID: data.ORDER_ID,
      timestamp: data.TIMESTAMP,
      amount: data.AMOUNT,
      merchanT_RESPONSE_URL: data.MERCHANT_RESPONSE_URL,
      pas_uuid: data.pas_uuid,
      srd: data.SRD,
      shA1HASH: data.SHA1HASH,
      hpP_CUSTOMER_EMAIL: data.HPP_CUSTOMER_EMAIL,
      hpP_CHALLENGE_REQUEST_INDICATOR: data.HPP_CHALLENGE_REQUEST_INDICATOR,
      hpP_ENABLE_EXEMPTION_OPTIMIZATION: data.HPP_ENABLE_EXEMPTION_OPTIMIZATION,
      hpP_ADDRESS_MATCH_INDICATOR: data.HPP_ADDRESS_MATCH_INDICATOR,
      hpP_FRAUDFILTER_RESULT: data.HPP_FRAUDFILTER_RESULT,
      batchid: data.BATCHID,
    };
  }

  private setErrorMessageToDisplay(code: string): string {
    switch (code) {
      case '101':
        this.errorMessage = this.translateService.instant('createFma.validations.errorMsgDeclineByBank');
        break;
      case '102':
        this.errorMessage = this.translateService.instant('createFma.validations.errorMsgReferralB');
        break;
      case '103':
        this.errorMessage = this.translateService.instant('createFma.validations.errorMgsReferralA');
        break;
      case '200':
        this.errorMessage = this.translateService.instant('createFma.validations.errorMsgCommunication');
        break;
      case '111':
        this.errorMessage = this.translateService.instant('createFma.validations.errorMessageAuthRequired');
        break;
    }
    return this.errorMessage;
  }
}
