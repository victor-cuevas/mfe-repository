import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProcurationFeesService, SubmissionRoutesService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Injectable({
  providedIn: 'root',
})
export class UpdateSubmissionRouteResolver {
  constructor(private submissionRouteService: SubmissionRoutesService, private procurationFeesService: ProcurationFeesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> | void {
    const id = route.paramMap.get('id');
    const obs: Observable<any>[] = [this.procurationFeesService.procurationFeesGetAllProcurationFees()];

    id && obs.push(this.submissionRouteService.submissionRoutesGetSubmissionRouteById(id));

    return forkJoin(obs).pipe(
      map(res => {
        return {
          defaultProcurationFees: res[0],
          submissionRoute: res[1] || null,
        };
      }),
    );
  }
}
