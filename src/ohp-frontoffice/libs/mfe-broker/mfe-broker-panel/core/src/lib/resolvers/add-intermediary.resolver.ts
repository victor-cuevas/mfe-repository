import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FirmsService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Injectable({
  providedIn: 'root',
})
export class AddIntermediaryResolver {
  constructor(private fs: FirmsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | void {
    const id = route.paramMap.get('id');
    if (id)
      return forkJoin([this.fs.firmsGetById(id), this.fs.firmsGetFirmAddressesByFirmId(id)]).pipe(
        map(allResponse => {
          return {
            firm: allResponse[0],
            address: allResponse[1],
          };
        }),
      );
  }
}
