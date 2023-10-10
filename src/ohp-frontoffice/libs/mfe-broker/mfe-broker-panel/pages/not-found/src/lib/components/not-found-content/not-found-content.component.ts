import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';

@Component({
  selector: 'mbpanel-not-found-content',
  templateUrl: './not-found-content.component.html',
})
export class NotFoundContentComponent {
  routePaths: typeof RoutePaths = RoutePaths;
  constructor(private store: Store, private router: Router) {}
  test = '/assets/images/background-404.svg';
}
