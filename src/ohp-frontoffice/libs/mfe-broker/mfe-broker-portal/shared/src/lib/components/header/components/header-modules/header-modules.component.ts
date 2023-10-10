import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { FirmSearchResultEntry, FirmsService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { DataService, getPortalUser } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AuthorizationContextModel } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'mbp-header-modules',
  templateUrl: './header-modules.component.html',
})
export class HeaderModulesComponent implements OnInit, OnDestroy {
  selectedFirm: Array<FirmSearchResultEntry> = [];
  searchFirms$?: Observable<FirmSearchResultEntry[]>;
  firms$?: Observable<FirmSearchResultEntry[]>;
  stepHasUnsavedChanges$ = this.dataService.stepHasUnsavedChanges$;
  searchResults: Array<FirmSearchResultEntry> = [];
  routePaths = RoutePaths;
  user!: AuthorizationContextModel;
  canSwitchToPanel = false;
  panelLink = '/panel';

  @ViewChild('selector') selector!: OverlayPanel;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private firmsService: FirmsService,
    private dataService: DataService,
    private translateService: TranslateService,
    private router: Router,
    private store: Store,
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
  ) {
    this.store
      .pipe(select(getPortalUser), takeUntil(this.onDestroy$))
      .subscribe(reduxData => (this.user = reduxData as AuthorizationContextModel));
  }

  ngOnInit(): void {
    this.canSwitchToPanel = this.checkPermissionService.checkPermissions({
      section: 'switcher',
      features: ['firm', 'lender'],
    });
    if (this.checkPermissionService.checkPermissions({ section: 'switcher', features: ['lender'] })) {
      this.firms$ = this.firmsService.firmsSearchFirms({ partialFirmName: '' }, 1, 5).pipe(map(response => response.items));
    }
    if (this.checkPermissionService.checkPermissions({ section: 'switcher', features: ['firm'] })) {
      this.panelLink = `/panel/firms/${this.user.firmId}`;
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  handleNavigation(): void {
    if (this.dataService.stepHasUnsavedChanges) {
      const navigateToPanel = window.confirm(this.translateService.instant('general.warnings.unsavedChanges'));
      if (navigateToPanel) {
        this.dataService.navigatedToPanel$.next(true);
        this.router.navigate([this.panelLink]);
      } else {
        this.selector.hide();
        this.dataService.navigatedToPanel$.next(false);
      }
    }
  }

  searchFirm(event: any) {
    const query = event.query;
    this.firms$ = this.searchFirms$ = this.firmsService.firmsSearchFirms({ partialFirmName: query }, 1, 5).pipe(
      debounceTime(300),
      map(response => response.items),
    );
  }
}
