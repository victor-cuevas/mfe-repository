import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { SubmissionRouteTableComponent } from './components/submission-route-table/submission-route-table.component';

@Component({
  selector: 'mbpanel-submission-route-page',
  templateUrl: './submission-route-page.component.html',
})
export class SubmissionRoutePageComponent implements AfterViewInit {
  routePaths: typeof RoutePaths = RoutePaths;

  breadcrumb: MenuItem[] = [{ label: 'Dashboard', routerLink: '/panel/dashboard', icon: 'pi pi-chevron-left' }];

  @ViewChild('submissionRoutesTable') submissionRoutesTable!: SubmissionRouteTableComponent;
  isChildInstantiated = false;

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
    if (this.isChildInstantiated && this.submissionRoutesTable.nameFilter) {
      return (
        this.submissionRoutesTable?.nameFilter.isActive ||
        this.submissionRoutesTable?.numberFilter.isActive ||
        this.submissionRoutesTable?.referenceFilter.isActive ||
        this.submissionRoutesTable?.statusFilter.isActive ||
        this.submissionRoutesTable?.typeFilter.isActive
      );
    }
    return false;
  }
}
