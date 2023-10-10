import { Component, Inject, OnInit } from '@angular/core';
import { getPanelUser, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { FirmSearchResultEntry, FirmsService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { Observable } from 'rxjs';
import { debounceTime, map, mergeMap, take } from 'rxjs/operators';
import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'mbpanel-header-modules',
  templateUrl: './header-modules.component.html',
})
export class HeaderModulesComponent implements OnInit {
  selectedFirm: Array<FirmSearchResultEntry> = [];
  searchFirms$?: Observable<FirmSearchResultEntry[]>;
  firms$?: Observable<FirmSearchResultEntry[]>;
  firm$?: Observable<any>;
  searchResults: Array<FirmSearchResultEntry> = [];
  routePaths = RoutePaths;
  canSwitchToPortal = false;

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private firmsService: FirmsService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.canSwitchToPortal = this.checkPermissionService.checkPermissions({ section: 'switcher', features: ['firm'] });
    this.checkPermissionService.checkPermissions({ section: 'switcher', features: ['lender'] })
      ? (this.firms$ = this.firmsService.firmsSearchFirms({ partialFirmName: '' }, 1, 5).pipe(map(response => response.items)))
      : (this.firm$ = this.store.select(getPanelUser).pipe(
          take(1),
          mergeMap((user: any) => this.firmsService.firmsGetById(user.firmId)),
        ));
  }

  searchFirm(event: any) {
    const query = event.query;
    this.firms$ = this.searchFirms$ = this.firmsService.firmsSearchFirms({ partialFirmName: query }, 1, 5).pipe(
      debounceTime(300),
      map(response => response.items),
    );
  }
}
