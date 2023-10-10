import { Component } from '@angular/core';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SpinnerService } from '@close-front-office/mfe-broker/core';

@Component({
  selector: 'cfo-global-layout',
  templateUrl: './global-layout.component.html',
})
export class GlobalLayoutComponent {
  private onDestroy$ = new Subject<boolean>();

  constructor(public spinnerService: SpinnerService, private router: Router, private route: ActivatedRoute) {
    router.events.pipe(takeUntil(this.onDestroy$)).subscribe((routerEvent: Event) => {
      this.checkRouterEvent(routerEvent);
    });
  }

  checkRouterEvent(routerEvent: Event): void {
    if (routerEvent instanceof NavigationStart) {
      Array.from(document.getElementsByClassName('scroll-container')).forEach(scrollContainer =>
        scrollContainer.scroll({ top: 0, left: 0, behavior: 'smooth' }),
      );
      this.spinnerService.setIsLoading(true);
    }

    if (routerEvent instanceof NavigationEnd || routerEvent instanceof NavigationCancel || routerEvent instanceof NavigationError) {
      this.spinnerService.setIsLoading(false);
    }
  }
}
