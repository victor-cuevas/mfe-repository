import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserDetailsService } from '../services/user-details.service';
import { LenderUsersService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';

@Injectable({
  providedIn: 'root',
})
export class LenderUserDetailsResolver implements Resolve<void> {
  constructor(private lenderUserService: LenderUsersService, private userDetailsService: UserDetailsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<void> {
    return this.lenderUserService.lenderUsersGetLenderUser(route.paramMap.get('id') || '').pipe(
      map(response => {
        this.userDetailsService.setLenderUserDetails(response);
      }),
    );
  }
}
