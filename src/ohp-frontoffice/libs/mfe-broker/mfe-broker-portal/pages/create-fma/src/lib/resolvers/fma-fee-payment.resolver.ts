import { Injectable } from '@angular/core';
import { FeePaymentResponse, FMAService, PaymentService } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FmaFeePaymentResolver implements Resolve<FeePaymentResponse> {
  constructor(private fmaService: FMAService, private paymentService: PaymentService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this.fmaService.fMAGetFeePayment(route?.parent?.data.fmaJourney?.fmaData.applicationDraftId).pipe(
      concatMap((response: FeePaymentResponse) => {
        return this.paymentService
          .paymentInitiatePayment(
            route?.parent?.data.fmaJourney?.fmaData.applicationDraftId,
            route?.parent?.data.fmaJourney?.fmaData.loanId,
          )
          .pipe(
            map(jsonGlobalPayment => {
              return {
                areFeesPaid: response.feesToBePaid?.areFeesPaid,
                lenderFees: response.feesToBePaid?.lenderFees,
                productFeesToBePaid: response.feesToBePaid?.productFees,
                intermediaryFees: response.otherFees,
                productFeesAddedToLoan: response.feesAddedToLoan,
                jsonGlobalPayment: jsonGlobalPayment,
                applicationDraftId: response.applicationDraftId,
                loanId: response.loanId,
              };
            }),
          );
      }),
    );
  }
}
