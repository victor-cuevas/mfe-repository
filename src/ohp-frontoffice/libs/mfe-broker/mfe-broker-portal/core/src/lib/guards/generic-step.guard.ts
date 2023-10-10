import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { GenericStepForm } from './generic-step.form';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GenericStepGuard implements CanDeactivate<GenericStepForm> {
  constructor() {}

  canDeactivate(component: GenericStepForm): Observable<boolean> {
    return component.canDeactivate().pipe(
      map(() => {
        return true;
      }),
      catchError(() => {
        return of(false);
      }),
    );
  }
}
