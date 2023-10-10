import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
  FirmsService,
  IntermediaryService,
  IntermediaryResponse,
  FirmDetailsModel,
  FirmAddressModel,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { getPanelUser } from '../state/panel-user.selectors';
import { IntermediaryDetailsService } from '../services/intermediary-details.service';
import { PermissionContextService } from '@close-front-office/mfe-broker/core'; // TODO

@Injectable({
  providedIn: 'root',
})
export class IntermediaryResolver {
  userData: any;
  constructor(
    private permissionContextService: PermissionContextService,
    private intermediaryService: IntermediaryService,
    private intermediaryDetailsService: IntermediaryDetailsService,
    private firmService: FirmsService,
    private store: Store,
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | void {
    this.permissionContextService.setCurrentIntermediaryContext(route.paramMap.get('userId') || '');
    this.store.select(getPanelUser).subscribe(reduxData => (this.userData = reduxData));
    return this.intermediaryService.intermediaryGetIntermediaryById(route.paramMap.get('userId') || this.userData.intermediaryId).pipe(
      concatMap((intermediary: IntermediaryResponse) => {
        return forkJoin([
          this.firmService.firmsGetById(intermediary.firmId as string),
          this.firmService.firmsGetFirmAddressesByFirmId(intermediary.firmId as string),
        ]).pipe(
          map(allResults => {
            this.intermediaryDetailsService.setIntermediaryDetails(intermediary);
            return {
              firmDetails: allResults[0] as FirmDetailsModel,
              addressDetails: allResults[1] as FirmAddressModel[],
            };
          }),
        );
      }),
    );
  }
}
