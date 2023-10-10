import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class AuthConfigUserResolver {
  userData: any;
  constructor(private store: Store) {}
}
