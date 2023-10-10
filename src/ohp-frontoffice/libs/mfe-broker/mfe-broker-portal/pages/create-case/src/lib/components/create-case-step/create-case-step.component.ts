import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateCaseData } from '../../models/createCaseData';
import {
  CheckPermissionsService,
  CodeTablesService,
  DataService,
  getPortalUser,
  RoutePaths,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  AuthorizationContextModel,
  IntermediaryResponse,
  IntermediaryService,
  IntermediarySummary,
  PortalPermissionType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { PermissionContextService, SpinnerService } from '@close-front-office/mfe-broker/core';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'mbp-create-case-step',
  templateUrl: './create-case-step.component.html',
})
export class CreateCaseStepComponent implements OnInit, OnDestroy {
  casePurposeTypes = this.codeTablesService.getCodeTable('cdtb-broker-applicationtypes');
  propertyPurposes = this.codeTablesService.getCodeTable('cdtb-broker-propertypurpose');
  routePaths: typeof RoutePaths = RoutePaths;
  fcaNumber?: string;
  CONFIG = CONFIGURATION_MOCK;
  firmId = this.route.parent?.parent?.parent?.parent?.parent?.snapshot.paramMap.get('firmId') || '';
  brokers: IntermediaryResponse[] | null = null;
  // form initial setup
  initialData: CreateCaseData = this.dataService.getFormData('step1') || {};
  killerQuestions?: string[] = this.initialData.casePurposeType
    ? Object.values(CONFIGURATION_MOCK.CONDITIONS[this.initialData.casePurposeType as 'PURCHASE' | 'REMORTGAGE'])
    : [];

  private onDestroy$ = new Subject<boolean>();

  createCaseForm = this.fb.group({
    caseOwner: [this.initialData.caseOwner, Validators.required],
    casePurposeType: [this.initialData.casePurposeType, Validators.required],
    propertyPurpose: [this.propertyPurposes[0]?.value, Validators.required],
    killerQuestions: this.fb.group({
      statementsCorrect: [this.initialData.killerQuestions?.statementsCorrect, Validators.requiredTrue],
      permissionCheck: [this.initialData.killerQuestions?.permissionCheck, Validators.requiredTrue],
      dataConsent: [this.initialData.killerQuestions?.dataConsent, Validators.requiredTrue],
      termsAndConditions: [this.initialData.killerQuestions?.termsAndConditions, Validators.requiredTrue],
    }),
  });

  get caseOwner() {
    return this.createCaseForm.get('caseOwner')?.value;
  }

  get tradingAddress() {
    const fields = ['lineOne', 'lineTwo', 'lineThree', 'lineFour', 'lineFive', 'city', 'postcode'];

    return fields
      .reduce((arr: string[], key: string) => {
        const value = this.caseOwner?.tradingAddress[key];
        return value ? [...arr, value] : arr;
      }, [])
      .join(', ');
  }

  constructor(
    public permissionContextService: PermissionContextService,
    private fb: FormBuilder,
    private dataService: DataService,
    private checkPermissionService: CheckPermissionsService,
    private intermediaryService: IntermediaryService,
    private store: Store,
    private spinnerService: SpinnerService,
    private codeTablesService: CodeTablesService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.setBrokers();
    this.onChanges();
    this.changeConditions();
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }

  onChanges(): void {
    this.createCaseForm.valueChanges.subscribe(val => {
      this.dataService.setFormData(
        {
          ...val,
          propertyPurpose: this.propertyPurposes[0]?.value,
        },
        this.createCaseForm.status,
        'step1',
      );
    });
  }

  changeConditions() {
    this.createCaseForm.get('casePurposeType')?.valueChanges.subscribe((casePurposeType: 'PURCHASE' | 'REMORTGAGE') => {
      this.killerQuestions = Object.values(CONFIGURATION_MOCK.CONDITIONS[casePurposeType]);
    });
  }

  setBrokers() {
    const caseOwnerControl = this.createCaseForm.get('caseOwner');

    this.store.pipe(select(getPortalUser), takeUntil(this.onDestroy$)).subscribe((reduxData: AuthorizationContextModel | undefined) => {
      if (!reduxData) {
        this.spinnerService.setIsLoading(false);
        return;
      }
      const intermediaryId = reduxData.intermediaryId;
      const fullName = `${reduxData.firstName} ${reduxData.lastName}`;

      if (this.checkPermissionService.checkPermissions({ section: 'assistants', features: ['support'] })) {
        const roleMappings: IntermediarySummary[] = reduxData?.roleMappings?.filter(
          (intermediary: IntermediarySummary) => intermediary.isActive && intermediary.permission !== PortalPermissionType.View,
        ) as IntermediarySummary[];

        if (roleMappings.length) {
          const obs: Observable<IntermediarySummary>[] = [];

          this.spinnerService.setIsLoading(true);
          if (this.checkPermissionService.checkPermissions({ section: 'case', features: ['assignee'] })) {
            obs.push(this.intermediaryService.intermediaryGetIntermediary(intermediaryId as string));
          }
          roleMappings.map(
            (intermediary: IntermediarySummary) =>
              intermediary.brokerId && obs.push(this.intermediaryService.intermediaryGetIntermediary(intermediary.brokerId)),
          );

          return forkJoin(obs).subscribe((intermediaries: IntermediaryResponse[]) => {
            this.brokers = intermediaries.filter(
              (intermediary: IntermediaryResponse) => intermediary.tradingAddress?.firmId === this.firmId,
            );
            if (this.brokers.length === 1) caseOwnerControl?.setValue(this.brokers[0]);
            this.spinnerService.setIsLoading(false);
          });
        }
      }
      return caseOwnerControl?.setValue({
        intermediaryId,
        fullName,
      });
    });
  }
}
