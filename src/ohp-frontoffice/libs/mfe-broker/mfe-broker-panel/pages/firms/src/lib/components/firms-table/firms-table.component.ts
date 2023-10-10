import { Component, ViewChild } from '@angular/core';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { FirmSearchResultEntry, FirmSearchResultPageModel, FirmsService } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { LazyLoadEvent } from 'primeng/api';
import { FormBuilder } from '@angular/forms';
import { FilterMenuComponent } from '@close-front-office/mfe-broker/shared-ui';
import { Table } from 'primeng/table';
import { SortItem, SortService } from '@close-front-office/mfe-broker/core';
import { ActivatedRoute } from '@angular/router';

type InputControl = 'firmName' | 'fcaNumber' | 'reference' | 'isActivated' | 'isInReview' | 'type';
type Filter = 'nameFilter' | 'numberFilter' | 'referenceFilter' | 'statusFilter' | 'reviewFilter' | 'typeFilter';
type ActiveFilters = {
  [key: string]: boolean;
};

@Component({
  selector: 'mbpanel-firms-table',
  templateUrl: './firms-table.component.html',
})
export class FirmsTableComponent {
  firms: FirmSearchResultEntry[] = [];
  routePaths = RoutePaths;
  loading = true;
  totalRecords!: number;
  pageSize = 10;
  sortOrder: SortItem;

  /**
   * object to check if filters have been applied properly by the 'Apply' button.
   * Toggles in the filter and clear filter function and is used in the validation of the API call
   * */
  activeFilters: ActiveFilters = {
    nameFilter: false,
    numberFilter: false,
    referenceFilter: false,
    statusFilter: true,
    reviewFilter: false,
    typeFilter: false,
  };

  /**
   * Controlling the child components
   **/
  @ViewChild('nameFilter') nameFilter!: FilterMenuComponent;
  @ViewChild('numberFilter') numberFilter!: FilterMenuComponent;
  @ViewChild('referenceFilter') referenceFilter!: FilterMenuComponent;
  @ViewChild('statusFilter') statusFilter!: FilterMenuComponent;
  @ViewChild('reviewFilter') reviewFilter!: FilterMenuComponent;
  @ViewChild('typeFilter') typeFilter!: FilterMenuComponent;
  @ViewChild('firmsTable') firmsTable!: Table;

  /*
   * Instantiating the filter form
   * */
  filterForm = this.fb.group({
    firmName: '',
    fcaNumber: '',
    reference: '',
    isActivated: true,
    isInReview: null,
    type: '',
  });

  constructor(
    private firmsService: FirmsService,
    private fb: FormBuilder,
    private sortService: SortService,
    private route: ActivatedRoute,
  ) {
    this.sortOrder = sortService.getSortOrder();
  }

  /**
   * function that gets called by the table and by the filter actions
   * and fetches the submission routes with the passed in variables.
   *
   * Also handles sort logic, which defaults to ascending (sort applies on name)
   *
   * @param event
   **/
  loadFirms(event: LazyLoadEvent) {
    const currentItems = event?.first || 0;
    const pageNumber = currentItems / this.pageSize + 1;
    this.loading = true;

    // handle loading logic; do POST call; populate data
    this.firmsService
      .firmsSearchFirms(
        {
          firmNameSortOrder: this.sortOrder.value,
          partialFirmName: this.activeFilters.nameFilter ? this.filterForm.get('firmName')?.value : '',
          ...(this.activeFilters.numberFilter && { fcaReference: this.filterForm.get('fcaNumber')?.value }),
          ...(this.activeFilters.referenceFilter && { partialReference: this.filterForm.get('reference')?.value }),
          ...(this.activeFilters.statusFilter && { isActive: this.filterForm.get('isActivated')?.value }),
          ...(this.activeFilters.reviewFilter && { isInReview: this.filterForm.get('isInReview')?.value }),
          ...(this.activeFilters.typeFilter && { firmType: this.filterForm.get('type')?.value }),
        },
        pageNumber,
        this.pageSize,
      )
      .subscribe((response: FirmSearchResultPageModel) => {
        this.firms = response.items;
        this.totalRecords = response.total;
        this.loading = false;
      });
  }

  /**
   * Function that populates the firms based
   * on filter variables that are passed in
   *
   * @param filter
   * */
  filter(filter: Filter): void {
    // activate filter css highlighting
    this.activeFilters[filter] = true;
    this.firmsTable.reset();
    this[filter].showFilter = false;

    // Check which filters should be displayed as active
    this.checkActiveFilters();
  }

  /**
   * Function that clears and hides the specified filter
   *
   * @param inputControl
   * @param filter
   * */
  clearFilter(inputControl: InputControl, filter: Filter): void {
    if (!this.activeFilters[filter]) {
      this.filterForm.get(inputControl)?.reset();
    } else {
      this.filterForm.get(inputControl)?.reset();
      this.activeFilters[filter] = false;
      this.firmsTable.reset();
      this[filter].showFilter = false;
    }
    // Check which filters should be displayed as active
    this.checkActiveFilters();
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
      this.reviewFilter.isActive = this.activeFilters.reviewFilter;
      this.typeFilter.isActive = this.activeFilters.typeFilter;
    }
  }

  /**
   * Function that clears all the filters and populates the firms
   * based on the cached items from the initial call
   * */
  clearAllFilters(): void {
    // clear all filter values
    this.filterForm.reset();

    // resetting the activeFilters object
    Object.keys(this.activeFilters).forEach(value => (this.activeFilters[value] = false));

    this.checkActiveFilters();

    this.firmsTable.reset();
  }

  /**
   * Sorts the table to either ascending name, descending name or default (no sorting)
   */
  sort() {
    this.sortOrder = this.sortService.getSortOrder(this.sortOrder);
    this.firmsTable.reset();
  }
}
