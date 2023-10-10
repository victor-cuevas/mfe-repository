import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize, map, take, takeUntil } from 'rxjs/operators';
import { ColumnFilter, Table } from 'primeng/table';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder } from '@angular/forms';
import { FilterService, MenuItem } from 'primeng/api';
import { CaseTransferComponent, DialogData, FilterMenuComponent } from '@close-front-office/mfe-broker/shared-ui';
import {
  CaseSummaryService,
  CaseTableObject,
  getCaseTable,
  getPortalUser,
  loadCaseTableSuccess,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  CaseDataResponse,
  CaseService,
  CaseStage,
  CaseStatusEnum,
  ContactInformationResponse,
  IntermediarySummary,
  UserType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import {
  CheckPermissionsServiceInterface,
  PermissionContextService,
  PERMISSIONS,
  SortItem,
  SortService,
  SpinnerService,
} from '@close-front-office/mfe-broker/core';
import { Store } from '@ngrx/store';
import { Calendar } from 'primeng/calendar';

interface CaseData extends Omit<CaseDataResponse, 'created'> {
  created?: Date;
}

interface ToggleAllEvent {
  checked: boolean;
}

interface ToggleSingleEvent {
  data: CaseData;
  originalEvent: Event;
}

interface statusOptions {
  label: string;
  value: string;
}

interface stageOptions {
  label: string;
  value: string;
}

enum CasePropertiesEnum {
  CASE_ID = 'caseId',
  CONTACTS_INFORMATION = 'contactsInformation',
  TOTAL_LOAN_AMOUNT = 'totalLoanAmount',
  CREATED = 'created',
  STAGE = 'stage',
  MODIFIED = 'modified',
  STATUS = 'status',
  CREATED_BY = 'createdByFullName',
  ASSIGNEE = 'assigneeFullName',
}

interface FilterEvent {
  filteredValue: CaseData[];
  filters: { [key in CasePropertiesEnum]: { matchMode: string; value: any } };
}

interface SortEvent {
  field: string;
  order: number;
}

interface PageEvent {
  first: number;
  rows: number;
}

type ActiveFilters = {
  [key: string]: boolean;
};

function isFilterEvent(object: FilterEvent | SortEvent | PageEvent): object is FilterEvent {
  return 'filters' in object;
}

function isSortEvent(object: FilterEvent | SortEvent | PageEvent): object is SortEvent {
  return 'field' in object;
}

@Component({
  selector: 'mbp-case-table',
  templateUrl: './case-table.component.html',
})
export class CaseTableComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('caseTable') caseTable!: Table;
  @ViewChild('numberFilter') numberFilter!: FilterMenuComponent;
  @ViewChild('createdCalendar') createdCalendar!: Calendar;
  @ViewChild('createdCalendarFilter') createdCalendarFilter!: ColumnFilter;
  @ViewChild('lastUpdatedCalendar') lastUpdatedCalendar!: Calendar;
  @ViewChild('lastUpdatedCalendarFilter') lastUpdatedCalendarFilter!: ColumnFilter;
  @ViewChild('searchApplicantFilter') searchApplicantFilter!: ColumnFilter;
  @ViewChild('searchLoanAmountFilter') searchLoanAmountFilter!: ColumnFilter;
  @ViewChild('selectStageFilter') selectStageFilter!: ColumnFilter;
  @ViewChild('selectStatusFilter') selectStatusFilter!: ColumnFilter;
  @ViewChild('searchCaseIdFilter') searchCaseIdFilter!: ColumnFilter;
  @ViewChild('searchCreatedByFilter') searchCreatedByFilter!: ColumnFilter;
  @ViewChild('searchAssigneeFilter') searchAssigneeFilter!: ColumnFilter;

  caseTableLayoutKey = 'CASE_TABLE_LAYOUT_PREFERENCE';
  caseStatusEnum = CaseStatusEnum;
  filterDate?: string;
  hasLayoutPreference = false;
  selectedStages?: string[];
  stageFilterActive = false;

  selectedStatus?: string[];
  statusFilterActive = false;

  statusInitFilter: CaseStatusEnum[] = [
    CaseStatusEnum.Active,
    CaseStatusEnum.InProgress,
    CaseStatusEnum.Submitted,
    CaseStatusEnum.Assessment,
    CaseStatusEnum.Rejected,
  ];

  rangeDates?: Date[];
  createDateFilterActive = false;

  rangeDatesLastUpdated?: Date[];
  lastUpdatedFilterActive = false;

  LoanAmountFrom?: number;
  LoanAmountTo?: number;
  loanAmountFilterActive = false;

  inputGlobal?: string;

  inputApplicant?: string;
  applicantFilterActive = false;

  inputCaseId?: string;
  caseIdFilterActive = false;

  inputCreatedBy?: string;
  createdByFilterActive = false;

  inputAssignee?: string;
  assigneeFilterActive = false;

  onDestroy$ = new Subject();
  cases: CaseData[] = [];
  filteredCases: CaseData[] = [];
  pageSize = 10;
  totalRecords!: number;
  loading = true;
  casesSelected$ = new BehaviorSubject(false);
  selectedCases: CaseData[] = [];
  ref!: DynamicDialogRef;
  showSuccessfulModal = false;
  firmId = this.caseSummaryService.fimData?.firmId;
  newAssigneeName = '';
  showCancelCase = false;
  cancelCaseDataPopup: DialogData | undefined;
  changedStatusFilter = false;
  notAllowed = false;

  statusOptions: statusOptions[] = [
    { label: CaseStatusEnum.Active, value: CaseStatusEnum.Active },
    { label: 'In Progress', value: CaseStatusEnum.InProgress },
    { label: CaseStatusEnum.Completed, value: CaseStatusEnum.Completed },
    { label: CaseStatusEnum.Submitted, value: CaseStatusEnum.Submitted },
    { label: CaseStatusEnum.Assessment, value: CaseStatusEnum.Assessment },
    { label: CaseStatusEnum.Rejected, value: CaseStatusEnum.Rejected },
    { label: CaseStatusEnum.Cancelled, value: CaseStatusEnum.Cancelled },
  ];

  stageOptions: stageOptions[] = [
    { label: CaseStage.New, value: CaseStage.New },
    { label: CaseStage.Draft, value: CaseStage.Draft },
    { label: CaseStage.Illustration, value: CaseStage.Illustration },
    { label: CaseStage.Dip, value: CaseStage.Dip },
    { label: CaseStage.Fma, value: CaseStage.Fma },
    { label: CaseStage.Underwriting, value: CaseStage.Underwriting },
  ];

  moreMenuItems$ = new BehaviorSubject<MenuItem[]>([
    {
      label: 'Transfer case',
      icon: 'pi pi-user-edit',
      styleClass: 'more-menu-item',
      disabled: true,
      command: () => this.openTransferModal(),
    },
    {
      label: 'Cancel case',
      icon: 'pi pi-times',
      styleClass: 'more-menu-item',
      disabled: true,
      command: () => this.openCancelModal(),
    },
  ]);

  colspan = 8;
  sortOrder: SortItem;

  activeFilters: ActiveFilters = {
    numberFilter: false,
  };

  filterColumnForm = this.fb.group({
    showApplicants: true,
    showCreatedDate: false,
    showLastUpdate: true,
    showAmount: true,
    showStage: true,
    showStatus: true,
    showCreatedBy: false,
    showAssignee: true,
  });

  sortedField = '';
  sortedOrder = 0;
  first = 0;
  pageData: { first: number; page: number; pageCount: number; rows: number } | null = null;

  casePropertiesEnum = CasePropertiesEnum;

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    public dialogService: DialogService,
    public permissionContextService: PermissionContextService,
    private translateService: TranslateService,
    private caseService: CaseService,
    private router: Router,
    private filterService: FilterService,
    private route: ActivatedRoute,
    private sortService: SortService,
    private fb: FormBuilder,
    private spinnerService: SpinnerService,
    private store: Store,
    private caseSummaryService: CaseSummaryService,
    private cd: ChangeDetectorRef,
  ) {
    this.sortOrder = sortService.getSortOrder();
  }

  ngOnInit(): void {
    this.getLayoutPreferences();
    this.saveLayoutPreferences();
    this.setDateFilter();
    this.setApplicantFilter();
    this.setNumberFromToFilter();
    this.setMultiSelectFilter();
    this.toggleDisableMoreMenu();
    this.loadTable();
  }

  ngAfterViewInit(): void {
    this.store
      .select(getCaseTable)
      .pipe(take(1), takeUntil(this.onDestroy$))
      .subscribe((resp?: CaseTableObject) => {
        if (resp) {
          if (resp.filter) {
            if (resp.filter?.caseId) {
              this.caseTable.filter(resp.filter?.caseId, CasePropertiesEnum.CASE_ID, 'contains');
              this.caseIdFilterActive = true;
              this.inputCaseId = resp.filter?.caseId;
            }

            if (resp.filter?.contactsInformation) {
              this.caseTable.filter(resp?.filter?.contactsInformation, CasePropertiesEnum.CONTACTS_INFORMATION, 'inputApplicantFilter');
              this.applicantFilterActive = true;
              this.inputApplicant = resp?.filter?.contactsInformation;
            }

            if (resp.filter?.created) {
              this.caseTable.filter(resp.filter?.created, CasePropertiesEnum.CREATED, 'dateRangeFilter');
              this.createDateFilterActive = true;
              this.rangeDates = resp?.filter.created;
            }

            if (resp.filter?.modified) {
              this.caseTable.filter(resp.filter?.modified, CasePropertiesEnum.MODIFIED, 'dateRangeFilter');
              this.lastUpdatedFilterActive = true;
              this.rangeDatesLastUpdated = resp.filter?.modified;
            }

            if (resp.filter?.totalLoanAmount) {
              this.caseTable.filter(
                [resp.filter?.totalLoanAmount[0], resp.filter?.totalLoanAmount[1]],
                'totalLoanAmount',
                'inputNumberFromToFilter',
              );
              this.loanAmountFilterActive = true;
              this.LoanAmountFrom = resp.filter?.totalLoanAmount[0] as number;
              this.LoanAmountTo = resp.filter?.totalLoanAmount[1] as number;
            }

            if (resp.filter?.stage) {
              this.caseTable.filter(resp.filter?.stage, CasePropertiesEnum.STAGE, 'multiSelectFilter');
              this.stageFilterActive = true;
              this.selectedStages = resp.filter?.stage;
            }

            if (resp.filter?.status) {
              this.caseTable.filter(resp.filter?.status, CasePropertiesEnum.STATUS, 'multiSelectFilter');
              this.statusFilterActive = true;
              this.selectedStatus = resp.filter?.status;
              this.changedStatusFilter = true;
            }

            if (resp.filter?.createdByFullName) {
              this.caseTable.filter(resp.filter?.createdByFullName, CasePropertiesEnum.CREATED_BY, 'contains');
              this.createdByFilterActive = true;
              this.inputCreatedBy = resp.filter?.createdByFullName;
            }

            if (resp.filter?.assigneeFullName) {
              this.caseTable.filter(resp.filter?.assigneeFullName, CasePropertiesEnum.ASSIGNEE, 'contains');
              this.assigneeFilterActive = true;
              this.inputAssignee = resp.filter?.assigneeFullName;
            }
          }
          if (resp.sorting) {
            this.sortedField = resp.sorting.field;
            this.sortedOrder = resp.sorting.order;
          }

          if (resp.pagination) {
            this.pageData = {
              first: resp.pagination.first,
              page: resp.pagination.first / resp.pagination.rows,
              pageCount: Math.ceil(resp.pagination.totalRecords / resp.pagination.rows),
              rows: resp.pagination.rows,
            };
          }
        }
      });

    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
    if (this.ref) {
      this.ref.close();
    }
  }

  private loadTable(): void {
    this.loading = true;
    this.store
      .select(getPortalUser)
      .pipe(take(1))
      .subscribe(portalUser => {
        const firmId: string | undefined = portalUser?.userType === UserType.Lender ? (this.firmId as string) : undefined;
        const roleMappings: IntermediarySummary[] = JSON.parse(JSON.stringify(portalUser?.roleMappings || []));

        this.caseService
          .caseGetAll(firmId)
          .pipe(
            finalize(() => (this.loading = false)),
            map(cases =>
              cases?.map((el: CaseDataResponse) => {
                const date = new Date(el.created as string);

                return { ...el, created: date };
              }),
            ),
          )
          .subscribe((cases: CaseData[]) => {
            this.totalRecords = cases?.length;
            if (cases?.length) {
              cases.sort((a: CaseData, b: CaseData) => {
                return a.modified && b.modified ? new Date(b.modified).getTime() - new Date(a.modified).getTime() : 0;
              });
            }

            this.cases = cases;
            this.filteredCases = cases;
            if (!this.changedStatusFilter) {
              this.setInitialFilters();
            }

            setTimeout(() => {
              this.pageData && this.caseTable.onPageChange(this.pageData);
            }, 100);
          });

        if (roleMappings.length > 1 && !this.hasLayoutPreference) {
          this.filterColumnForm.patchValue({
            showAssignee: true,
          });
        }
      });
  }

  private setInitialFilters() {
    this.caseTable.filter(this.statusInitFilter, CasePropertiesEnum.STATUS, 'multiSelectFilter');
    this.statusFilterActive = true;
    this.selectedStatus = this.statusInitFilter;
  }

  private saveLayoutPreferences() {
    this.filterColumnForm.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe(value => {
      window.localStorage.setItem(this.caseTableLayoutKey, JSON.stringify(value));
    });
  }

  private getLayoutPreferences() {
    const preferences = window.localStorage.getItem(this.caseTableLayoutKey);
    if (preferences) {
      this.hasLayoutPreference = true;
      this.filterColumnForm.reset(JSON.parse(preferences), { emitEvent: false, onlySelf: true });
    }
  }

  clearAllFilters() {
    this.caseTable.reset();

    this.clearInputCaseId();
    this.caseTable.filter('', CasePropertiesEnum.CASE_ID, 'contains');

    this.clearInputApplicant();
    this.caseTable.filter('', CasePropertiesEnum.CONTACTS_INFORMATION, 'inputApplicantFilter');

    this.clearInputNumberFromTo();
    this.caseTable.filter('', CasePropertiesEnum.TOTAL_LOAN_AMOUNT, 'inputNumberFromToFilter');

    this.clearCreatedCalendar();
    this.caseTable.filter('', CasePropertiesEnum.CREATED, 'dateRangeFilter');

    this.clearSelectStage();
    this.caseTable.filter('', CasePropertiesEnum.STAGE, 'multiSelectFilter');

    this.clearLastUpdatedCalendar();
    this.caseTable.filter('', CasePropertiesEnum.MODIFIED, 'dateRangeFilter');

    this.clearSelectStatus();
    this.caseTable.filter('', CasePropertiesEnum.STATUS, 'multiSelectFilter');

    this.clearInputCreatedBy();
    this.caseTable.filter('', CasePropertiesEnum.CREATED_BY, 'contains');

    this.clearInputAssignee();
    this.caseTable.filter('', CasePropertiesEnum.ASSIGNEE, 'contains');

    this.setInitialFilters();
    this.ngOnInit();
  }

  closeLastUpdatedCalendarOverlay() {
    if (this.rangeDatesLastUpdated && this.rangeDatesLastUpdated.length == 2 && this.rangeDatesLastUpdated[1] != null) {
      this.lastUpdatedCalendar.hideOverlay();
    }
  }

  clearLastUpdatedCalendar() {
    this.rangeDatesLastUpdated = undefined;
    this.lastUpdatedFilterActive = false;
  }

  closeLastUpdatedCalendar(value?: Date[]) {
    if (value && value[0]) {
      this.lastUpdatedFilterActive = true;
    } else {
      this.lastUpdatedFilterActive = false;
    }
    this.lastUpdatedCalendarFilter.toggleMenu();
  }

  closeCreatedCalendarOverlay() {
    if (this.rangeDates && this.rangeDates.length == 2 && this.rangeDates[1] != null) {
      this.createdCalendar.hideOverlay();
    }
  }

  clearCreatedCalendar() {
    this.rangeDates = undefined;
    this.createDateFilterActive = false;
  }

  closeCreatedCalendar(value?: Date[]) {
    if (value && value[0]) {
      this.createDateFilterActive = true;
    } else {
      this.createDateFilterActive = false;
    }
    this.createdCalendarFilter.toggleMenu();
  }

  clearInputAssignee() {
    this.inputAssignee = undefined;
    this.assigneeFilterActive = false;
  }

  closeInputAssignee(value?: string) {
    if (value) {
      this.assigneeFilterActive = true;
    } else {
      this.assigneeFilterActive = false;
    }
    this.searchAssigneeFilter.toggleMenu();
  }

  onFilteredSortedColumns(event: FilterEvent | SortEvent | PageEvent) {
    let reduxData: CaseTableObject = {};
    this.store
      .select(getCaseTable)
      .pipe(take(1), takeUntil(this.onDestroy$))
      .subscribe((resp?: CaseTableObject) => {
        if (resp) {
          reduxData = resp;
        }
      });

    this.store.dispatch(
      loadCaseTableSuccess({
        entity: this.createCaseTableObj(event, reduxData),
      }),
    );
  }

  private createCaseTableObj(event: FilterEvent | SortEvent | PageEvent, reduxData: CaseTableObject): CaseTableObject {
    if (isFilterEvent(event)) {
      this.filteredCases = event.filteredValue;
      return {
        ...reduxData,
        filter: {
          caseId: event.filters?.caseId?.value,
          contactsInformation: event.filters?.contactsInformation?.value,
          created: event.filters?.created?.value,
          modified: event.filters?.modified?.value,
          totalLoanAmount: event.filters?.totalLoanAmount?.value,
          stage: event.filters?.stage?.value,
          status: event.filters?.status?.value,
          createdByFullName: event.filters?.createdByFullName?.value,
          assigneeFullName: event.filters?.assigneeFullName?.value,
        },
      };
    } else if (isSortEvent(event)) {
      return {
        ...reduxData,
        sorting: {
          field: event.field,
          order: event.order,
        },
      };
    } else {
      return {
        ...reduxData,
        pagination: {
          first: event.first,
          rows: event.rows,
          totalRecords: this.totalRecords,
        },
      };
    }
  }

  setDateFilter() {
    this.filterService.register('dateRangeFilter', (value: string, filter: Array<Date | null>): boolean => {
      let dateCheck: Date;
      let filterDate: Date;
      let filterEndDate: Date;

      if (!filter || !value) {
        return true;
      }

      if (filter[0] && filter[1] === null) {
        dateCheck = new Date(value);
        filterDate = new Date(filter[0]?.setHours(12));
        return dateCheck.toISOString().substring(0, 10) === filterDate.toISOString().substring(0, 10);
      }
      if (filter[0] && filter[1]) {
        dateCheck = new Date(value);
        filterDate = new Date(filter[0].setHours(12));
        filterEndDate = new Date(filter[1].setHours(12));

        if (filter[0].getTime() === filter[1].getTime()) {
          return dateCheck.toISOString().substring(0, 10) === filterDate.toISOString().substring(0, 10);
        }

        return dateCheck.getTime() >= filterDate.getTime() && dateCheck.getTime() <= filterEndDate.getTime();
      }
      return false;
    });
  }

  clearSelectStage() {
    this.selectedStages = [];
    this.stageFilterActive = false;
  }

  closeSelectStage(value?: string[]) {
    if (value && value[0]) {
      this.stageFilterActive = true;
    } else {
      this.stageFilterActive = false;
    }
    this.selectStageFilter.toggleMenu();
  }

  clearSelectStatus() {
    this.selectedStatus = [];
    this.statusFilterActive = false;
  }

  closeSelectStatus(value?: string[]) {
    if (value && value[0]) {
      this.statusFilterActive = true;
    } else {
      this.statusFilterActive = false;
    }
    this.selectStatusFilter.toggleMenu();
  }

  setMultiSelectFilter() {
    this.filterService.register('multiSelectFilter', (value: string, filter: string[]): boolean => {
      if (!filter || !value) {
        return true;
      }
      return filter.includes(value);
    });
  }

  clearInputApplicant() {
    this.inputApplicant = undefined;
    this.applicantFilterActive = false;
  }

  clearInputCaseId() {
    this.inputCaseId = undefined;
    this.caseIdFilterActive = false;
  }

  clearInputCreatedBy() {
    this.inputCreatedBy = undefined;
    this.createdByFilterActive = false;
  }

  closeInputApplicant(value?: string) {
    if (value) {
      this.applicantFilterActive = true;
    } else {
      this.applicantFilterActive = false;
    }
    this.searchApplicantFilter.toggleMenu();
  }

  closeInputCaseId(value?: string) {
    if (value) {
      this.caseIdFilterActive = true;
    } else {
      this.caseIdFilterActive = false;
    }
    this.searchCaseIdFilter.toggleMenu();
  }

  closeInputCreatedBy(value?: string) {
    if (value) {
      this.createdByFilterActive = true;
    } else {
      this.createdByFilterActive = false;
    }
    this.searchCreatedByFilter.toggleMenu();
  }

  clearInputNumberFromTo() {
    this.LoanAmountFrom = undefined;
    this.LoanAmountTo = undefined;
    this.loanAmountFilterActive = false;
  }

  closeInputNumberFromTo(value?: [number?, number?]) {
    if (value?.[0] || value?.[1]) {
      this.loanAmountFilterActive = true;
    } else {
      this.loanAmountFilterActive = false;
    }
    this.searchLoanAmountFilter.toggleMenu();
  }

  setApplicantFilter() {
    this.filterService.register('inputApplicantFilter', (value: ContactInformationResponse[], filter: string): boolean => {
      if (!filter || !value) {
        return true;
      }

      if (value.length === 2) {
        return (
          value[0].firstName?.toLowerCase().includes(filter.toLowerCase()) ||
          value[1].firstName?.toLowerCase().includes(filter.toLowerCase()) ||
          value[0].familyName?.toLowerCase().includes(filter.toLowerCase()) ||
          value[1].familyName?.toLowerCase().includes(filter.toLowerCase()) ||
          false
        );
      } else {
        return (
          value[0].firstName?.toLowerCase().includes(filter.toLowerCase()) ||
          value[0].familyName?.toLowerCase().includes(filter.toLowerCase()) ||
          false
        );
      }
    });
  }

  setNumberFromToFilter() {
    this.filterService.register('inputNumberFromToFilter', (value: number, filter: [number?, number?]): boolean => {
      if (!filter[0] && !filter[1]) {
        return true;
      }

      if (filter[0] && filter[1]) {
        return filter[0] <= value && filter[1] >= value;
      }
      if (!filter[0] && filter[1]) {
        return filter[1] >= value;
      }
      if (filter[0] && !filter[1]) {
        return filter[0] <= value;
      }

      return false;
    });
  }

  toggleDisableMoreMenu(): void {
    this.casesSelected$.pipe(takeUntil(this.onDestroy$)).subscribe(bool => {
      const moreMenuItems = this.moreMenuItems$.getValue();
      bool
        ? this.moreMenuItems$.next(moreMenuItems.map(menuItem => ({ ...menuItem, disabled: false })))
        : this.moreMenuItems$.next(moreMenuItems.map(menuItem => ({ ...menuItem, disabled: true })));
    });
  }

  toggleAllCases($event: ToggleAllEvent) {
    $event.checked
      ? (this.selectedCases = this.filteredCases.filter(
          (el: CaseData) => el.status !== CaseStatusEnum.Cancelled && el.status !== CaseStatusEnum.Completed,
        ))
      : (this.selectedCases = []);
    this.updateCasesSelected();
  }

  toggleCase($event: ToggleSingleEvent, selected: boolean) {
    $event.originalEvent.stopPropagation();
    if (selected) {
      this.selectedCases.push($event.data);
    } else {
      this.selectedCases = this.selectedCases.filter(el => el.caseId !== $event.data.caseId);
    }
    this.toggleDisableMoreMenu();
    this.updateCasesSelected();
  }

  updateCasesSelected(): void {
    if (!this.casesSelected$.getValue() && this.selectedCases.length > 0) {
      this.casesSelected$.next(true);
    }
    if (this.casesSelected$.getValue() && this.selectedCases.length === 0) {
      this.casesSelected$.next(false);
    }
  }

  navigateTo(caseId: string) {
    this.router.navigate([`./${caseId}`], { relativeTo: this.route });
  }

  resizeRowExpansionOnToggle($event: HTMLInputElement) {
    if ($event.checked) {
      this.colspan++;
    } else {
      this.colspan--;
    }
  }

  openTransferModal() {
    this.ref = this.dialogService.open(CaseTransferComponent, {
      header: this.translateService.instant('cases.transfer.header'),
      width: '50vw',
      modal: true,
      baseZIndex: 1000,
      styleClass: 'transfer-dialog',
      data: {
        firmId: this.firmId,
        cases: this.selectedCases,
      },
    });

    this.ref.onClose.subscribe(data => {
      if (data) {
        this.showSuccessfulModal = true;
        this.selectedCases = [];
        this.newAssigneeName = data.intermediary.fullName;
        this.loadTable();
      }
    });
  }

  openCancelModal() {
    this.showCancelCase = true;
    this.cancelCaseDataPopup = {
      type: 'danger',
      icon: 'pi pi-times',
      header: this.translateService.instant('dialog.cancelCase'),
      content: this.translateService.instant(this.selectedCases.length === 1 ? 'dialog.cancelCaseMsg1' : 'dialog.cancelCaseMsg2', {
        cases: this.selectedCases.map((el: CaseData) => el.caseId).join(', '),
      }),
    };
  }

  cancelCancelCase() {
    this.showCancelCase = false;
  }

  confirmCancelCase() {
    this.spinnerService.setIsLoading(true);
    const obs: Observable<void>[] = this.selectedCases
      .filter((c: CaseData) => c.caseId)
      .map((c: CaseData) => this.caseService.casePutCancelCase(c.caseId));

    forkJoin(obs).subscribe(
      () => {
        this.showCancelCase = false;
        this.spinnerService.setIsLoading(false);
        this.loadTable();
      },
      () => {
        this.showCancelCase = false;
        this.spinnerService.setIsLoading(false);
        this.loadTable();
      },
    );
  }

  closeSuccessfulModal() {
    this.showSuccessfulModal = false;
  }
}
