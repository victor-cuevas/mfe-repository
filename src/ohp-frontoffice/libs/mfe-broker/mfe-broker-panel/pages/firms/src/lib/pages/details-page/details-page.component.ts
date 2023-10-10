import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';

import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { FirmsService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';
import { IntermediariesTableComponent } from '../../components/intermediaries-table/intermediaries-table.component';

@Component({
  selector: 'mbpanel-details-page',
  templateUrl: './details-page.component.html',
})
export class DetailsPageComponent implements OnInit, AfterViewInit {
  routePaths: typeof RoutePaths = RoutePaths;
  firmId = this.route.snapshot.paramMap.get('id') || '';
  breadcrumb: MenuItem[] = [];
  firmName = '';
  isChildInstantiated = false;
  isReadOnlyMode = this.route.parent?.parent?.snapshot.data.readOnlyMode;

  @ViewChild('intermediariesTable') intermediariesTable!: IntermediariesTableComponent;

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private route: ActivatedRoute,
    private firmService: FirmsService,
  ) {}

  ngOnInit() {
    if (this.checkPermissionService.checkPermissions({ section: 'switcher', features: ['lender'] })) {
      this.breadcrumb.push({ label: 'Firms', routerLink: RoutePaths.LIST_FIRMS, icon: 'pi pi-chevron-left' });
    }
  }

  ngAfterViewInit(): void {
    this.firmService.firmsGetById(this.firmId).subscribe(response => (this.firmName = response.firmName));
    this.isChildInstantiated = true;
  }

  /**
   * Function that checks if the child table component has any active filters.
   * Checks for the first filter before running to prevent instantiation errors
   *
   * @returns {boolean} whether or not any filter is currently active on the child table
   * */
  checkActiveFilters(): boolean {
    if (this.isChildInstantiated && this.intermediariesTable.nameFilter) {
      return (
        this.intermediariesTable?.nameFilter.isActive ||
        this.intermediariesTable?.numberFilter.isActive ||
        this.intermediariesTable?.positionFilter.isActive ||
        this.intermediariesTable?.contactsFilter.isActive ||
        this.intermediariesTable?.reviewFilter.isActive ||
        this.intermediariesTable?.statusFilter.isActive
      );
    }
    return false;
  }
}
