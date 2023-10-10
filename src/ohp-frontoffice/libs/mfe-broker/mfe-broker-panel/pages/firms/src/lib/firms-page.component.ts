import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { MenuItem } from 'primeng/api';
import { FirmsTableComponent } from './components/firms-table/firms-table.component';

@Component({
  selector: 'mbpanel-firms-page',
  templateUrl: './firms-page.component.html',
})
export class FirmsPageComponent implements AfterViewInit {
  routePaths: typeof RoutePaths = RoutePaths;
  breadcrumb: MenuItem[] = [{ label: 'Dashboard', routerLink: '../dashboard', icon: 'pi pi-chevron-left' }];
  isChildInstantiated = false;

  @ViewChild('firmsTable') firmsTable!: FirmsTableComponent;

  ngAfterViewInit(): void {
    this.isChildInstantiated = true;
  }

  /**
   * Function that checks if the child table component has any active filters.
   * Checks for the first filter before running to prevent instantiation errors
   *
   * @returns {boolean} whether or not any filter is currently active on the child table
   * */
  checkActiveFilters(): boolean {
    if (this.isChildInstantiated && this.firmsTable.nameFilter) {
      return (
        this.firmsTable?.nameFilter.isActive ||
        this.firmsTable?.numberFilter.isActive ||
        this.firmsTable?.referenceFilter.isActive ||
        this.firmsTable?.statusFilter.isActive ||
        this.firmsTable?.reviewFilter.isActive ||
        this.firmsTable?.typeFilter.isActive
      );
    }
    return false;
  }
}
