import { Component, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  FirmsService,
  IntermediaryRole,
  IntermediarySearchResultEntry,
  IntermediarySearchResultPageModel,
  IntermediaryService,
  IntermediarySummary,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { LazyLoadEvent } from 'primeng/api';
import { concatMap } from 'rxjs/operators';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FilterMenuComponent } from '@close-front-office/mfe-broker/shared-ui';
import { Table } from 'primeng/table';
import { SortItem, SortService, CheckPermissionsServiceInterface, PERMISSIONS } from '@close-front-office/mfe-broker/core';

type InputControl = 'intermediaryName' | 'irnNumber' | 'position' | 'contacts' | 'isInReview' | 'status';
type Filter = 'nameFilter' | 'numberFilter' | 'positionFilter' | 'contactsFilter' | 'reviewFilter' | 'statusFilter';
type ActiveFilters = {
  [key: string]: boolean;
};

@Component({
  selector: 'mbpanel-intermediaries-table',
  templateUrl: './intermediaries-table.component.html',
})
export class IntermediariesTableComponent {
  routePaths: typeof RoutePaths = RoutePaths;
  intermediaryRole: typeof IntermediaryRole = IntermediaryRole;
  firmId = this.route.snapshot.paramMap.get('id') || '';
  firmMembers: IntermediarySearchResultEntry[] = [];
  loading = true;
  totalRecords!: number;
  pageSize = 10;
  display = false;
  colspan = 7;
  sortOrder: SortItem;
  canViewIntermediaries = this.checkPermissionService.checkPermissions({
    section: 'profiles',
    features: ['viewer', 'firm', 'lender'],
  });

  /**
   * object to check if filters have been applied properly by the 'Apply' button.
   * Toggles in the filter and clear filter function and is used in the validation of the API call
   * */
  activeFilters: ActiveFilters = {
    nameFilter: false,
    numberFilter: false,
    positionFilter: false,
    contactsFilter: false,
    reviewFilter: false,
    statusFilter: false,
  };

  /**
   * Controlling the filter components for each column
   **/
  @ViewChild('nameFilter') nameFilter!: FilterMenuComponent;
  @ViewChild('numberFilter') numberFilter!: FilterMenuComponent;
  @ViewChild('positionFilter') positionFilter!: FilterMenuComponent;
  @ViewChild('contactsFilter') contactsFilter!: FilterMenuComponent;
  @ViewChild('reviewFilter') reviewFilter!: FilterMenuComponent;
  @ViewChild('statusFilter') statusFilter!: FilterMenuComponent;
  @ViewChild('intermediariesTable') intermediariesTable!: Table;

  /*
   * Instantiating the filter form
   * */
  filterForm: FormGroup = this.fb.group({
    intermediaryName: '',
    irnNumber: '',
    position: [],
    contacts: '',
    isInReview: null,
    status: [],
  });

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private fb: FormBuilder,
    private intermediaryService: IntermediaryService,
    private firmService: FirmsService,
    private route: ActivatedRoute,
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
  loadFirmMembers(event: LazyLoadEvent) {
    const currentItems = event?.first || 0;
    const pageNumber = currentItems / this.pageSize + 1;
    this.loading = true;

    // Check which filters should be displayed as active
    this.checkActiveFilters();
    // handle loading logic; do POST call; populate data
    this.intermediaryService
      .intermediarySearchIntermediariesAll(
        this.firmId,
        {
          nameSortOrder: this.sortOrder.value,
          ...(this.filterForm.get('intermediaryName')?.value &&
            this.activeFilters.nameFilter && { partialName: this.filterForm.get('intermediaryName')?.value }),
          ...(this.filterForm.get('irnNumber')?.value &&
            this.activeFilters.numberFilter && { partialAdvisorUniqueId: this.filterForm.get('irnNumber')?.value }),
          ...(this.filterForm.get('position')?.value &&
            this.activeFilters.positionFilter && { position: this.filterForm.get('position')?.value }),
          ...(this.filterForm.get('contacts')?.value &&
            this.activeFilters.contactsFilter && { partialEmail: this.filterForm.get('contacts')?.value }),
          ...(this.filterForm.get('isInReview')?.value !== null &&
            this.activeFilters.reviewFilter && { isInReview: this.filterForm.get('isInReview')?.value }),
          ...(this.filterForm.get('status')?.value && this.activeFilters.statusFilter && { status: this.filterForm.get('status')?.value }),
        },
        pageNumber,
        this.pageSize,
      )
      .subscribe((response: IntermediarySearchResultPageModel) => {
        this.firmMembers = response.items;
        this.totalRecords = response.total;
        this.loading = false;
      });
  }

  onRowSelect(event: any) {
    this.loading = true;
    this.intermediaryService
      .intermediaryGetIntermediaryById(event.id)
      .pipe(
        concatMap((response: any) => {
          event.intermediariesData = response;
          return this.firmService.firmsGetFirmAddress(this.firmId, response.tradingAddressId);
        }),
      )
      .subscribe(address => {
        event.addressesData = address;
        this.loading = false;
      });
  }

  /**
   * Function that populates the firmMembers based
   * on filter variables that are passed in
   *
   * @param filter
   * */
  filter(filter: Filter): void {
    // activate filter css highlighting
    this.activeFilters[filter] = true;

    // reload data with filter activated
    this.intermediariesTable.reset();

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
      // if the filter isn't active reset the filter form
      this.filterForm.get(inputControl)?.reset();
    } else {
      // clear the filter form
      this.filterForm.get(inputControl)?.reset();

      // disable filter css highlighting
      this.activeFilters[filter] = false;

      // reload data with filter disabled
      this.intermediariesTable.reset();

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
      this.positionFilter.isActive = this.activeFilters.positionFilter;
      this.contactsFilter.isActive = this.activeFilters.contactsFilter;
      this.reviewFilter.isActive = this.activeFilters.reviewFilter;
      this.statusFilter.isActive = this.activeFilters.statusFilter;
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

    // remove all css highlighting
    this.checkActiveFilters();

    // reload data without filters
    this.intermediariesTable.reset();
  }

  /**
   * Sorts the table to either ascending name or descending name
   */
  sort() {
    this.sortOrder = this.sortService.getSortOrder(this.sortOrder);
    this.intermediariesTable.reset();
  }

  formattingPosition(position: string): string {
    if (position === 'SupervisorAndAdvisor') {
      return 'Supervisor And Advisor';
    } else if (position === 'SupervisorAndAssistant') {
      return 'Assistant and Supervisor';
    } else {
      return position;
    }
  }

  getPosition(roleMapping: IntermediarySummary[], intermediaryId: string): string {
    const selectedIntermediary = roleMapping.find(el => {
      return el.brokerId === intermediaryId;
    });
    return selectedIntermediary?.role as string;
  }
}
