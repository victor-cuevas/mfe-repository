import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import {
  ApplicationType,
  ProcurationFee,
  SubmissionRouteModel,
  SubmissionRoutesService,
  SubmissionRouteType,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { DetailsFormComponent } from '../../components/details-form/details-form.component';
import { ProcurationFeesFormComponent } from '../../components/procuration-fees-form/procuration-fees-form.component';

@Component({
  selector: 'mbpanel-update-submission-route',
  templateUrl: './update-submission-route.component.html',
})
export class UpdateSubmissionRouteComponent implements OnInit {
  @ViewChild(DetailsFormComponent)
  detailsFormComponent?: DetailsFormComponent;

  @ViewChild(ProcurationFeesFormComponent)
  procurationsFeeComponent?: ProcurationFeesFormComponent;

  breadcrumb: MenuItem[] = [{ label: this.translate.instant('general.buttons.back'), routerLink: '../', icon: 'pi pi-chevron-left' }];

  id? = this.route.snapshot.paramMap.get('id');
  isReadOnlyMode = this.route.parent?.snapshot.data.readOnlyMode;

  submissionTypes = [
    { icon: 'pi pi-directions', type: 'submissionRoute.labels.network', value: SubmissionRouteType.Network },
    { icon: 'pi pi-directions', type: 'submissionRoute.labels.mortgageClub', value: SubmissionRouteType.MortgageClub },
    { icon: 'pi pi-directions', type: 'submissionRoute.labels.directAuth', value: SubmissionRouteType.DirectlyAuthorized },
  ];

  activeSubmissionType: any = { icon: 'pi pi-directions', type: 'Network', value: 'Network' };

  autoAddressEntry = true;

  activeFeeGroup = 'NewLending';

  initialSubmissionRouteData: SubmissionRouteModel | null = this.route.snapshot.data.fetchedData?.submissionRoute;
  defaultProcurationFees: any = this.route.snapshot.data.fetchedData?.defaultProcurationFees.reduce(
    (obj: any, el: ProcurationFee) => ({ ...obj, [el.submissionRouteType]: [...(obj[el.submissionRouteType] || []), el] }),
    {},
  );

  routePaths: typeof RoutePaths = RoutePaths;

  submissionRouteForm: FormGroup = this.fb.group({
    submissionRouteType: ['Network', Validators.required],
    bankAccountName: [''],
    bankAccountNumber: [null, Validators.compose([Validators.required, Validators.pattern(/^[0-9]{8}$/)])],
    bankSortCode: ['', Validators.compose([Validators.required, Validators.pattern(/^(?!0{6}|00-00-00)(?:\d{6}|\d\d-\d\d-\d\d)$/)])],
    isActivated: [true, Validators.required],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private submissionRouteService: SubmissionRoutesService,
    private translate: TranslateService,
    private router: Router,
    private toastService: ToastService,
    private spinnerService: SpinnerService,
  ) {}

  ngOnInit(): void {
    if (this.initialSubmissionRouteData) {
      this.lockSubmissionType(this.initialSubmissionRouteData);
      this.setValues(this.initialSubmissionRouteData);
    }
    if (this.isReadOnlyMode) {
      this.submissionRouteForm.disable();
    } else {
      this.onChanges();
    }
  }

  private onChanges() {
    this.submissionRouteForm?.controls.submissionRouteType.valueChanges.subscribe((value: SubmissionRouteType) => {
      this.procurationsFeeComponent?.procurationFeesFormArray.controls.forEach((form, i) => {
        const feeData = this.defaultProcurationFees[value][i];

        form.patchValue({
          value: feeData?.completionFee?.value,
          unit: feeData?.completionFee?.unit,
          basis: feeData?.completionFee?.basis,
          trailValue: feeData?.trailFee?.value,
          trailUnit: feeData?.trailFee?.unit,
          trailBasis: feeData?.trailFee?.basis,
          trailStartingMonth: feeData?.trailFee?.startingMonth,
          trailPeriodInMonths: feeData?.trailFee?.periodInMonths,
          trailEndingType: feeData?.trailFee?.endingType,
        });
      });
    });
  }

  /**
   * Function that sets the main values of the submissionRouteFormGroup
   *
   * @param {SubmissionRouteModel} data
   */
  setValues(data: SubmissionRouteModel) {
    this.submissionRouteForm.get('submissionRouteType')?.setValue(data.submissionRouteType);
    this.submissionRouteForm.get('bankAccountName')?.setValue(data.bankDetails.accountName);
    this.submissionRouteForm.get('bankAccountNumber')?.setValue(data.bankDetails.accountNumber);
    this.submissionRouteForm.get('bankSortCode')?.setValue(data.bankDetails.sortCode);
    this.submissionRouteForm.get('isActivated')?.setValue(data.isActivated);
  }

  /**
   * Function that locks the submissionRouteType formControl and sets the value to the active type of the passed
   * data model
   *
   * @param {SubmissionRouteModel}
   */
  lockSubmissionType(data: SubmissionRouteModel) {
    this.submissionRouteForm.get('submissionRouteType')?.disable();
    this.activeSubmissionType = this.submissionTypes.filter(el => el.value === data.submissionRouteType)[0];
  }

  /**
   * First triggers all form inputs to see if they are valid or not,
   * then sends the mapped form data with the PUT call when there is an id (screen is EDIT)
   * or the POST call when there is no id (screen is ADD)
   */
  submit() {
    this.submissionRouteForm.markAllAsTouched();

    if (this.submissionRouteForm.valid) {
      this.spinnerService.setIsLoading(true);
      if (this.id) {
        this.submissionRouteService.submissionRoutesPutSubmissionRoute(this.id, this.mapToDTO()).subscribe(
          () => {
            this.router.navigate([this.routePaths.LIST_SUBMISSION_ROUTES]).then(() => {
              this.spinnerService.setIsLoading(false);
              this.toastService.showMessage({
                summary: this.translate.instant('submissionRoute.alerts.update'),
              });
            });
          },
          err => {
            this.spinnerService.setIsLoading(false);
          },
        );
      } else {
        this.submissionRouteService.submissionRoutesPostSubmissionRoute(this.mapToDTO()).subscribe(
          () => {
            this.spinnerService.setIsLoading(false);
            this.router.navigate([this.routePaths.LIST_SUBMISSION_ROUTES]).then(() => {
              this.toastService.showMessage({
                summary: this.translate.instant('submissionRoute.alerts.create'),
              });
            });
          },
          err => {
            this.spinnerService.setIsLoading(false);
          },
        );
      }
    } else {
      window.alert(this.translate.instant('general.validations.enterAllFields'));
    }
  }

  mapToDTO() {
    const mainFormValues = this.submissionRouteForm.getRawValue();
    const procurationFeesValues = this.procurationsFeeComponent?.procurationFeesFormArray.getRawValue();
    const newLendingValues = procurationFeesValues?.find(el => el.applicationType === ApplicationType.NewLending);
    const remortgageValues = procurationFeesValues?.find(el => el.applicationType === ApplicationType.Remortgage);
    const detailsValues = this.detailsFormComponent?.addressForm.getRawValue();
    const procurationFees = [];

    if (!newLendingValues.useDefaultFees) {
      procurationFees.push({
        applicationType: newLendingValues.applicationType,
        submissionRouteType: mainFormValues.submissionRouteType,
        completionFee: {
          value: newLendingValues.value,
          unit: newLendingValues.unit,
          basis: newLendingValues.basis,
        },
        trailFee: {
          value: newLendingValues.trailValue,
          unit: newLendingValues.trailUnit,
          basis: newLendingValues.trailBasis,
          startingMonth: newLendingValues.trailStartingMonth,
          periodInMonths: newLendingValues.trailPeriodInMonths,
          endingType: newLendingValues.trailEndingType,
        },
      });
    }

    if (!remortgageValues.useDefaultFees) {
      procurationFees.push({
        applicationType: remortgageValues.applicationType,
        submissionRouteType: mainFormValues.submissionRouteType,
        completionFee: {
          value: remortgageValues.value,
          unit: remortgageValues.unit,
          basis: remortgageValues.basis,
        },
        trailFee: {
          value: remortgageValues.trailValue,
          unit: remortgageValues.trailUnit,
          basis: remortgageValues.trailBasis,
          startingMonth: remortgageValues.trailStartingMonth,
          periodInMonths: remortgageValues.trailPeriodInMonths,
          endingType: remortgageValues.trailEndingType,
        },
      });
    }

    return {
      ...(detailsValues.reference && { reference: detailsValues.reference }),
      submissionRouteType: mainFormValues.submissionRouteType,
      firmName: detailsValues.firmName,
      firmFcaReference: detailsValues.fcaReference,
      isActivated: mainFormValues.isActivated,
      submissionRouteAddress: {
        numberOrBuilding: detailsValues.numberOrBuilding,
        postcode: detailsValues.postcode,
        ...(detailsValues.city && { city: detailsValues.city }),
        ...(detailsValues.country && { country: detailsValues.country }),
        ...(detailsValues.lineOne && { lineOne: detailsValues.lineOne }),
        ...(detailsValues.lineTwo && { lineTwo: detailsValues.lineTwo }),
        ...(detailsValues.lineThree && { lineThree: detailsValues.lineThree }),
        ...(detailsValues.lineFour && { lineFour: detailsValues.lineFour }),
        ...(detailsValues.lineFive && { lineFive: detailsValues.lineFive }),
      },
      procurationFees,
      bankDetails: {
        accountName: mainFormValues.bankAccountName,
        accountNumber: mainFormValues.bankAccountNumber,
        sortCode: mainFormValues.bankSortCode.toString(),
      },
    };
  }
}
