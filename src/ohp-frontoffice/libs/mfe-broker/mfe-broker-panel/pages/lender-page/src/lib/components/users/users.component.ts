import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { IntermediaryRole, LenderUsersService, UserModel, UserStatus } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { FormBuilder } from '@angular/forms';
import { ColumnFilter, Table } from 'primeng/table';
import { CheckPermissionsServiceInterface, PERMISSIONS, SortItem, SortService } from '@close-front-office/mfe-broker/core';
import { FilterService } from 'primeng/api';

enum FilterValueEnum {
  NAME = 'fullName',
  ROLE = 'role',
  EMAIL = 'email',
  PHONE = 'telephone.mobile',
  STATUS = 'status',
}

@Component({
  selector: 'close-front-office-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  routePaths: typeof RoutePaths = RoutePaths;
  intermediaryRole: typeof IntermediaryRole = IntermediaryRole;
  firmId = this.route.snapshot.paramMap.get('id') || '';
  firmMembers: UserModel[] = [];
  loading = true;
  display = false;
  colspan = 7;
  pageSize = 10;
  totalRecords!: number;
  sortOrder: SortItem;
  //Filter properties:
  filterValueEnum = FilterValueEnum;
  inputName = '';
  nameFilterActive = false;
  selectedPositions = [];
  selectedPositionControl = '';
  positionFilterActive = false;
  inputEmail = '';
  emailFilterActive = false;
  inputPhone = '';
  phoneFilterActive = false;
  selectedStatus = [];
  selectedStatusControl = '';
  statusFilterActive = false;

  canViewIntermediaries = this.checkPermissionService.checkPermissions({
    section: 'lender',
    features: ['admin'],
  });

  positionOptions = [
    { label: 'Lender administrator', value: IntermediaryRole.LenderAdvisorAdmin },
    { label: 'Lender support', value: IntermediaryRole.LenderAdvisorSupport },
    { label: 'Lender viewer', value: 'Lender viewer' }, //TODO is not in the role list at the moment
  ];

  statusOptions = [
    { label: 'Active', value: UserStatus.Active },
    { label: 'Pending', value: UserStatus.Pending },
    { label: 'Inactive', value: UserStatus.Inactive },
  ];

  @ViewChild('lenderUsersTable') lenderUsersTable!: Table;
  @ViewChild('nameFilter') nameFilter!: ColumnFilter;
  @ViewChild('positionFilter') positionFilter!: ColumnFilter;
  @ViewChild('emailFilter') emailFilter!: ColumnFilter;
  @ViewChild('phoneFilter') phoneFilter!: ColumnFilter;
  @ViewChild('statusFilter') statusFilter!: ColumnFilter;

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private fb: FormBuilder,
    private lenderUsersService: LenderUsersService,
    private route: ActivatedRoute,
    private sortService: SortService,
    private filterService: FilterService,
  ) {
    this.sortOrder = this.sortService.getSortOrder();
  }

  ngOnInit() {
    this.setMultiSelectFilter();
    this.loadLenderUsers();
  }

  filter(
    input: string | string[],
    field: string,
    matchMode: string,
    activeStyle: 'nameFilterActive' | 'emailFilterActive' | 'phoneFilterActive' | 'positionFilterActive' | 'statusFilterActive',
    filterColumnReference: 'nameFilter' | 'emailFilter' | 'phoneFilter' | 'positionFilter' | 'statusFilter',
    inputNameControl: 'inputName' | 'inputEmail' | 'inputPhone' | 'selectedPositionControl' | 'selectedStatusControl',
  ) {
    this.lenderUsersTable.filter(input, field, matchMode);
    if (input) {
      this[activeStyle] = true;
    } else {
      this[activeStyle] = false;
      if (inputNameControl === 'selectedPositionControl') {
        this.selectedPositions = [];
      } else if (inputNameControl === 'selectedStatusControl') {
        this.selectedStatus = [];
      } else {
        this[inputNameControl] = '';
      }
    }
    this[filterColumnReference].toggleMenu();
  }

  private loadLenderUsers() {
    this.loading = true;
    this.lenderUsersService.lenderUsersGetLenderUsers().subscribe((response: UserModel[]) => {
      const updateResponseFe = response.map(el => ({
        ...el,
        fullName: el.person.firstName + el.person.lastName,
        role: el.roleMappings[el.userId].userRole,
      }));
      this.firmMembers = updateResponseFe;
      this.totalRecords = this.firmMembers.length;
      this.loading = false;
    });
  }

  private resetFilterInactiveStyle() {
    this.nameFilterActive = false;
    this.positionFilterActive = false;
    this.emailFilterActive = false;
    this.phoneFilterActive = false;
    this.statusFilterActive = false;
  }

  private resetInput() {
    this.inputName = '';
    this.selectedPositions = [];
    this.inputEmail = '';
    this.inputPhone = '';
    this.selectedStatus = [];
  }

  private resetTable() {
    this.lenderUsersTable.reset();
    this.lenderUsersTable.filter('', FilterValueEnum.NAME, 'contains');
    this.lenderUsersTable.filter('', FilterValueEnum.ROLE, 'multiSelectFilter');
    this.lenderUsersTable.filter('', FilterValueEnum.EMAIL, 'contains');
    this.lenderUsersTable.filter('', FilterValueEnum.PHONE, 'contains');
    this.lenderUsersTable.filter('', FilterValueEnum.STATUS, 'multiSelectFilter');
  }

  private setMultiSelectFilter() {
    this.filterService.register('multiSelectFilter', (value: string, filter: string[]): boolean => {
      if (!filter || !value) {
        return true;
      }
      return filter.includes(value);
    });
  }

  clearAllFilters() {
    this.resetFilterInactiveStyle();
    this.resetInput();
    this.resetTable();
  }
}
