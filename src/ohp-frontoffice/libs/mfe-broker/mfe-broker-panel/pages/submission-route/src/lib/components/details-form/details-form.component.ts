import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { FirmFcaDetailsModel, FirmsService, SubmissionRouteModel } from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { CodeTablesService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { SortService, SpinnerService } from '@close-front-office/mfe-broker/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';

@Component({
  selector: 'mbpanel-details-form',
  templateUrl: './details-form.component.html',
})
export class DetailsFormComponent implements OnInit {
  /**
   * Defining wheter or not the details are editable based on url id param
   */
  isEditable = !this.route.snapshot.paramMap.get('id');
  isReadOnlyMode = this.route.parent?.snapshot.data.readOnlyMode;
  countryOptions = this.codeTablesService
    .getCodeTable('cdtb-countrycode')
    .sort((a, b) => this.sortService.sortArrayByLabel(a.label as string, b.label as string));

  /**
   * Getting the existing submission route details from the parent component
   */
  private _submissionRouteAddressInput = new BehaviorSubject<SubmissionRouteModel | null>(null);

  @Input() set submissionRouteAddressInput(val: SubmissionRouteModel | null) {
    this._submissionRouteAddressInput.next(val);
  }

  get submissionRouteAddressInput() {
    return this._submissionRouteAddressInput.getValue();
  }

  /**
   * Generating the address/ details form
   */
  addressForm: FormGroup = this.fb.group({
    fcaReference: [null, Validators.compose([Validators.required, Validators.min(1), Validators.max(9999999)])],
    reference: [null],
    firmName: ['', Validators.required],
    numberOrBuilding: ['', Validators.required],
    lineOne: ['', Validators.required],
    lineTwo: [''],
    lineThree: [''],
    lineFour: [''],
    lineFive: [''],
    postcode: ['', Validators.compose([Validators.required, Validators.pattern(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2}$/)])],
    city: ['', Validators.required],
    country: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private firmsService: FirmsService,
    private spinnerService: SpinnerService,
    private sortService: SortService,
    private toast: ToastService,
    private route: ActivatedRoute,
    private codeTablesService: CodeTablesService,
  ) {}

  /**
   * Checking if the component receives input (SR) data from the parent component
   * on init lifecycle hook, if so then set those values in the form and disallow editing
   */
  ngOnInit(): void {
    this._submissionRouteAddressInput.subscribe(val => {
      if (val) {
        this.setAddressValues(val);
        this.isEditable = false;
      }
    });
    if (this.isReadOnlyMode) {
      this.addressForm.disable();
    }
  }

  /**
   * Function that calls the firmsService and populates the FCADetails based on the firmFcaReference input field
   * Uses the firmFcaReference as the parameter for the service call.
   *
   * Also locks the input and hides the populateData btn if an input is found
   */
  populateData(): void {
    if (this.addressForm.controls.fcaReference.valid) {
      this.spinnerService.setIsLoading(true);
      this.firmsService
        .firmsGetFcaDetailsById(this.addressForm.controls.fcaReference.value)
        .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
        .subscribe((res: FirmFcaDetailsModel) => {
          this.setAddressValues(res);
          this.isEditable = false;
        });
    } else {
      this.toast.showMessage({ summary: 'Please enter a valid FCA number', severity: 'error' });
    }
  }

  /**
   * sets the addressForm values based on the data parameter,
   * which is either a SubmissionRouteModel from the parent component
   * or the firmFcaDetailsModel from the fcaNumber GET call
   *
   * @param {SubmissionRouteModel | FirmDetailsModel} data
   */
  setAddressValues(data: SubmissionRouteModel | FirmFcaDetailsModel): void {
    const dataAddress = this.isFirmFcaDetailsModel(data) ? data.firmAddress : data.submissionRouteAddress;
    const fcaReference = this.isFirmFcaDetailsModel(data) ? data.fcaReference : data.firmFcaReference;

    const newAddressValues = {
      firmName: data.firmName,
      reference: this.isFirmFcaDetailsModel(data) ? null : data.reference,
      fcaReference: fcaReference,
      numberOrBuilding: dataAddress ? dataAddress.numberOrBuilding : '',
      lineOne: dataAddress ? dataAddress.lineOne : '',
      lineTwo: dataAddress ? dataAddress.lineTwo : '',
      lineThree: dataAddress ? dataAddress.lineThree : '',
      lineFour: dataAddress ? dataAddress.lineFour : '',
      lineFive: dataAddress ? dataAddress.lineFive : '',
      city: dataAddress ? dataAddress.city : '',
      postcode: dataAddress ? dataAddress.postcode : '',
      country: dataAddress ? dataAddress.country : '',
    };
    this.addressForm.reset(newAddressValues);
  }

  /**
   * Displays editable input feels for addressForm
   */
  editFirmAddress(): void {
    this.isEditable = true;
  }

  private isFirmFcaDetailsModel(fcaReference: SubmissionRouteModel | FirmFcaDetailsModel): fcaReference is FirmFcaDetailsModel {
    return (fcaReference as FirmFcaDetailsModel).fcaReference !== undefined;
  }
}
