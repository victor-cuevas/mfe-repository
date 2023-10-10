import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterMenuComponent } from '@close-front-office/mfe-broker/shared-ui';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  SubmissionRouteSearchResultEntry,
  SubmissionRouteSearchResultPageModel,
  SubmissionRoutesService,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';

import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { SortItem, SortService } from '@close-front-office/mfe-broker/core';

type InputControl = 'submissionRouteName' | 'fcaNumber' | 'reference' | 'isActivated' | 'type';
type Filter = 'nameFilter' | 'numberFilter' | 'referenceFilter' | 'statusFilter' | 'typeFilter';
type ActiveFilters = {
  [key: string]: boolean;
};
type SortValue = 'Ascending' | 'Descending';

@Component({
  selector: 'mbpanel-submission-route-table',
  templateUrl: './submission-route-table.component.html',
})
export class SubmissionRouteTableComponent {
  colspan = 8;
  loading = true;
  pageSize = 10;
  routePaths = RoutePaths;
  submissionRoutes: SubmissionRouteSearchResultEntry[] = [];
  isInitialCall = true;
  totalRecords!: number;
  sortOrder: SortItem;

  /**
   * object to check if filters have been applied properly by the 'Apply' button.
   * Toggles in the filter and clear filter function and is used in the validation of the API call
   * */
  activeFilters: ActiveFilters = {
    nameFilter: false,
    numberFilter: false,
    referenceFilter: false,
    statusFilter: false,
    typeFilter: false,
  };

  /**
   * Controlling the filter components for each column
   **/
  @ViewChild('nameFilter') nameFilter!: FilterMenuComponent;
  @ViewChild('numberFilter') numberFilter!: FilterMenuComponent;
  @ViewChild('referenceFilter') referenceFilter!: FilterMenuComponent;
  @ViewChild('statusFilter') statusFilter!: FilterMenuComponent;
  @ViewChild('typeFilter') typeFilter!: FilterMenuComponent;
  @ViewChild('submissionRoutesTable') submissionRoutesTable!: Table;

  /*
   * Instantiating the filter form
   * */
  filterForm: FormGroup = this.fb.group({
    submissionRouteName: '',
    fcaNumber: null,
    reference: '',
    isActivated: null,
    type: [],
  });

  constructor(
    private submissionRouteService: SubmissionRoutesService,
    private fb: FormBuilder,
    private toast: ToastService,
    private sortService: SortService,
  ) {
    this.sortOrder = this.sortService.getSortOrder();
  }

  /**
   * function that gets called by the table and by the filter actions
   * and fetches the submission routes with the passed in variables.
   *
   * Also handles sort logic, which defaults to ascending (sort applies on name)
   *
   * @param event
   **/
  loadSubmissionRoutes(event?: LazyLoadEvent): void {
    const currentItems = event?.first || 0;
    const pageNumber = currentItems / this.pageSize + 1;

    // Check which filters should be displayed as active
    this.checkActiveFilters();

    // handle loading logic; do POST call; populate data
    this.loading = true;
    this.submissionRouteService
      .submissionRoutesSearchSubmissionRoute(
        {
          firmNameSortOrder: this.sortOrder.value,
          partialFirmName: this.activeFilters.nameFilter ? this.filterForm.get('submissionRouteName')?.value : '',
          ...(this.filterForm.get('type')?.value &&
            this.activeFilters.typeFilter && { submissionRouteType: this.filterForm.get('type')?.value }),
          ...(this.filterForm.get('fcaNumber')?.value &&
            this.activeFilters.numberFilter && { firmFcaReference: this.filterForm.get('fcaNumber')?.value }),
          ...(this.filterForm.get('reference')?.value &&
            this.activeFilters.referenceFilter && { partialReference: this.filterForm.get('reference')?.value }),
          ...(this.filterForm.get('isActivated')?.value !== null &&
            this.activeFilters.statusFilter && { isActivated: this.filterForm.get('isActivated')?.value }),
        },
        pageNumber,
        this.pageSize,
      )
      .subscribe((response: SubmissionRouteSearchResultPageModel) => {
        this.submissionRoutes = response.items;
        this.totalRecords = response.total;

        this.loading = false;
      });
  }

  /**
   * Function that populates the submission routes based
   * on filter variables that are passed in
   *
   * @param filter
   * */
  filter(filter: Filter): void {
    // activate filter css highlighting
    this.activeFilters[filter] = true;

    // reload data with filter activated
    this.submissionRoutesTable.reset();

    // close the filter popup
    this[filter].showFilter = false;
  }

  /**
   * Function that clears and hides the specified filter.
   * If the filter is not active then this function will only clear the filterdata in the form.
   *
   * Else if the filter is active, a new call will be made without the filter parameter.
   *
   * @param inputControl
   * @param filter
   * */
  clearFilter(inputControl: InputControl, filter: Filter): void {
    if (!this.activeFilters[filter]) {
      // if the filter isn't activated reset the filter type
      this.filterForm.get(inputControl)?.reset();
    } else {
      // clear the filter form
      this.filterForm.get(inputControl)?.reset();

      // disable filter css highlighting
      this.activeFilters[filter] = false;

      // reload data with filter disabled
      this.submissionRoutesTable.reset();

      // close the filter popup
      this[filter].showFilter = false;
    }
  }

  /**
   * Function that checks which form controls have values
   * and sets corresponding filters as activated
   * */
  checkActiveFilters(): void {
    // if statement to check if filters have been instantiated
    if (this.nameFilter) {
      this.nameFilter.isActive = this.activeFilters.nameFilter;
      this.numberFilter.isActive = this.activeFilters.numberFilter;
      this.referenceFilter.isActive = this.activeFilters.referenceFilter;
      this.statusFilter.isActive = this.activeFilters.statusFilter;
      this.typeFilter.isActive = this.activeFilters.typeFilter;
    }
  }

  /**
   * Function that clears all the filters and populates the submissionRoutes
   * based on the cached items from the initial call
   * */
  clearAllFilters(): void {
    // clear all filter values
    this.filterForm.reset();

    // resetting the activeFilters object
    Object.keys(this.activeFilters).forEach(value => (this.activeFilters[value] = false));

    this.checkActiveFilters();

    // reload data without filters
    this.submissionRoutesTable.reset();
  }

  /**
   * Sorts the table to either ascending name or descending name
   */
  sort() {
    this.sortOrder = this.sortService.getSortOrder(this.sortOrder);
    this.submissionRoutesTable.reset();
  }
}
