import { Component } from '@angular/core';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
@Component({
  selector: 'mbp-not-found-content',
  templateUrl: './not-found-content.component.html',
})
export class NotFoundContentComponent {
  routePaths: typeof RoutePaths = RoutePaths;
  constructor() {}
  test = '/assets/images/background-404.svg';
}
