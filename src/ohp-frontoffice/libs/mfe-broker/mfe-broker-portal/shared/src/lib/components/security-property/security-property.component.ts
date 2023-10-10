import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
  AddressFeService,
  CodeTablesService,
  DataService,
  FeAddress,
  GroupValidators,
  RoutePaths,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  Address,
  AddressService,
  AddressSuggestionModel,
  BuilderGuaranteeSchemeType,
  ConstructionType,
  HeritageStatusType,
  PropertyType,
  RealEstateScenario,
  RegisterAddressRequest,
  SecurityPropertyResponse,
  TenureType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CustomValidators, GroupValidators as GroupValidatorFromCore, SpinnerService } from '@close-front-office/mfe-broker/core';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { debounceTime, finalize } from 'rxjs/operators';

export class SecurityPropertyValidators {
  static hasLift(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      if (
        group.get('propertyType')?.value === PropertyType.FLAT_APARTMENT &&
        group.get('numberOfFloors')?.value > 3 &&
        !group.get('hasLift')?.value
      ) {
        group.get('hasLift')?.setErrors({ hasLift: true });
      } else {
        group.get('hasLift')?.setErrors(null);
      }
      return null;
    };
  }
}

@Component({
  selector: 'mbp-security-property',
  templateUrl: './security-property.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecurityPropertyComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() type = 'dip';
  routePaths: typeof RoutePaths = RoutePaths;
  currentData: SecurityPropertyResponse = this.route.snapshot.data?.securityPropertyData || {};
  MODE: typeof Mode = Mode;

  //Dropdown value
  propertyStyleOptions = this.codeTablesService.getCodeTable('cdtb-broker-propertystyle');
  standardConstructionOptions = this.codeTablesService.getCodeTable('cdtb-constructiontype');
  roofTypeOptions = this.codeTablesService.getCodeTable('cdtb-rooftype');
  propertyTypeOption = this.codeTablesService.getCodeTable('cdtb-buildingtype');
  heritageStatusOptions = this.codeTablesService.getCodeTable('cdtb-heritagestatustype');
  realEstateScenarioOptions = this.codeTablesService.getCodeTable('cdtb-realestatescenario');
  tenureOptions = this.codeTablesService.getCodeTable('cdtb-tenuretype');
  propertyGuaranteeSchemeOptions = this.codeTablesService.getCodeTable('cdtb-builderguaranteeschemetype');
  parkingSpaceTypeOptions = this.codeTablesService.getCodeTable('cdtb-parkingspacetype');

  propertyType: typeof PropertyType = PropertyType;
  tenure: typeof TenureType = TenureType;
  constructionType: typeof ConstructionType = ConstructionType;
  propertyGuaranteeScheme: typeof BuilderGuaranteeSchemeType = BuilderGuaranteeSchemeType;
  securityPropertyForm: FormGroup = this.fb.group({});

  suggestedAddresses: Array<AddressSuggestionModel> = [];
  selectedAddress: FeAddress | null = null;
  hasButtonVisible = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    readonly cd: ChangeDetectorRef,
    public dataService: DataService,
    private codeTablesService: CodeTablesService,
    private addressService: AddressService,
    private spinnerService: SpinnerService,
    private addressFeService: AddressFeService,
  ) {}

  get mandatory() {
    return this.type === 'fma' ? ' *' : '';
  }

  get showGuaranteeScheme() {
    return (
      this.securityPropertyForm.get('realEstateScenario')?.value === RealEstateScenario.NEW_CONSTRUCTION ||
      new Date().getFullYear() - this.securityPropertyForm.get('yearBuilt')?.value < 10
    );
  }

  ngOnInit(): void {
    this.setFormData();
    this.setValidationOnInit();
    this.cd.detectChanges();
  }

  ngAfterViewInit(): void {
    //Set the address from the address search component:
    this.setAddressForm();
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  getSuggestionListFromAutoComplete(query: { originalEvent: Event; query: string }) {
    this.addressService
      .addressPostSearchAddress({ countryCode: 'GBR', maxSuggestions: 25, keyWords: [query.query] })
      .pipe(debounceTime(3000))
      .subscribe(resp => {
        if (resp && resp.suggestions) this.suggestedAddresses = resp.suggestions;
        this.cd.detectChanges();
      });
  }

  onSelectedAddress(selectedAddress: RegisterAddressRequest) {
    this.spinnerService.setIsLoading(true);
    this.addressService
      .addressPostRegisterAddress(selectedAddress)
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(selectedAddress => {
        this.selectedAddress = this.addressFeService.mapAddressToFeAddressModel(selectedAddress);
        this.cd.detectChanges();
      });
  }

  private setFormData() {
    const dipFields = {
      addressType: 'UK',
      propertyType: [this.currentData.propertyType, Validators.required],
      propertyStyle: [this.currentData.propertyStyle, Validators.required],
      remainingTermOfLeaseInYears: [this.currentData.remainingTermOfLeaseInYears],
      tenure: [this.currentData.tenure, Validators.compose([Validators.required, CustomValidators.valueIsNot(TenureType.COMMONHOLD)])],
      numberOfBedrooms: [this.currentData.numberOfBedrooms, Validators.required],
      constructionType: [
        this.currentData.constructionType,
        Validators.compose([
          Validators.required,
          CustomValidators.valueIsNot([
            ConstructionType.LARGE_PANEL_SYSTEM,
            ConstructionType.MODERN_METHOD_OF_CONSTRUCTION_MMC_SYSTEM_BUILT,
          ]),
        ]),
      ],
      constructionDetails: this.currentData.constructionDetails,
      roofType: [this.currentData.roofType, Validators.required],
      heritageStatus: [
        this.currentData.heritageStatus,
        Validators.compose([Validators.required, CustomValidators.valueIsNot([HeritageStatusType.GRADE_I, HeritageStatusType.GRADE_II_S])]),
      ],
      realEstateScenario: [
        this.currentData.realEstateScenario,
        Validators.compose([Validators.required, CustomValidators.valueIsNot(RealEstateScenario.NEW_CONSTRUCTION)]),
      ],
      yearBuilt: [
        this.currentData.yearBuilt,
        Validators.compose([Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear() - 2)]),
      ],
    };
    const fmaFields = {
      addressType: 'UK',
      propertyType: [this.currentData.propertyType, Validators.required],
      propertyStyle: [this.currentData.propertyStyle, Validators.required],
      numberOfBedrooms: [this.currentData.numberOfBedrooms, Validators.required],
      constructionType: [
        this.currentData.constructionType,
        Validators.compose([
          Validators.required,
          CustomValidators.valueIsNot([
            ConstructionType.LARGE_PANEL_SYSTEM,
            ConstructionType.MODERN_METHOD_OF_CONSTRUCTION_MMC_SYSTEM_BUILT,
          ]),
        ]),
      ],
      constructionDetails: this.currentData.constructionDetails,
      roofType: [this.currentData.roofType, Validators.required],
      heritageStatus: [
        this.currentData.heritageStatus,
        Validators.compose([Validators.required, CustomValidators.valueIsNot([HeritageStatusType.GRADE_I, HeritageStatusType.GRADE_II_S])]),
      ],
      realEstateScenario: [
        this.currentData.realEstateScenario,
        Validators.compose([Validators.required, CustomValidators.valueIsNot(RealEstateScenario.NEW_CONSTRUCTION)]),
      ],
      isFlatAboveCommercialPremises: [this.currentData.isFlatAboveCommercialPremises],
      tenure: [this.currentData.tenure, Validators.compose([Validators.required, CustomValidators.valueIsNot(TenureType.COMMONHOLD)])],
      remainingTermOfLeaseInYears: [this.currentData.remainingTermOfLeaseInYears],
      yearBuilt: [
        this.currentData.yearBuilt,
        Validators.compose([Validators.required, Validators.min(1000), Validators.max(new Date().getFullYear() - 2)]),
      ],
      numberOfFloors: [this.currentData.numberOfFloors, Validators.compose([Validators.required, Validators.max(10), Validators.min(1)])],
      floor: [this.currentData.floor],
      hasLift: [this.currentData.hasLift],
      numberOfBathrooms: [this.currentData.numberOfBathrooms, Validators.required],
      numberOfKitchens: [this.currentData.numberOfKitchens, Validators.required],
      numberOfReceptionrooms: [this.currentData.numberOfReceptionrooms, Validators.required],
      hasGarageOrParkingSpace: [this.currentData.hasGarageOrParkingSpace, Validators.required],
      isPlotSizeGreaterThanOneAcre: [this.currentData.isPlotSizeGreaterThanOneAcre, Validators.required],
      hasSufferedFromSubsidence: [this.currentData.hasSufferedFromSubsidence, Validators.required],
      isHabitable: [this.currentData.isHabitable, Validators.compose([Validators.required, CustomValidators.valueIs(true)])],
      hasBeenPreviouslyOwnedByLo: [
        this.currentData.hasBeenPreviouslyOwnedByLo,
        Validators.compose([Validators.required, CustomValidators.valueIs(false)]),
      ],
      isHmo: [this.currentData.isHmo],
      arePeopleOver17NotInTheMortgageLivingInTheProperty: [
        this.currentData.arePeopleOver17NotInTheMortgageLivingInTheProperty,
        Validators.required,
      ],
      hasPropertyGuaranteeScheme: [this.currentData.hasPropertyGuaranteeScheme],
      propertyGuaranteeScheme: [this.currentData.propertyGuaranteeScheme],
      isAtRiskOfCoastalOrRiverErosion: [this.currentData.isAtRiskOfCoastalOrRiverErosion],
      isToBeUsedForBusinessPurposes: [this.currentData.isToBeUsedForBusinessPurposes, Validators.required],
      energyRating: [this.currentData.energyRating],
      otherPropertyGuaranteeScheme: [this.currentData.otherPropertyGuaranteeScheme],
    };

    if (this.type === 'fma') {
      this.securityPropertyForm = this.fb.group(fmaFields, {
        validators: [
          SecurityPropertyValidators.hasLift(),
          GroupValidatorFromCore.tenureValidator(),
          GroupValidators.checkStandardConstructionAndYearBuilt('constructionType', 'yearBuilt'),
        ],
      });
    } else {
      this.securityPropertyForm = this.fb.group(dipFields, {
        validators: [
          GroupValidators.checkStandardConstructionAndYearBuilt('constructionType', 'yearBuilt'),
          GroupValidatorFromCore.tenureValidator(),
        ],
      });
    }

    const formControls = this.securityPropertyForm.controls;

    formControls.propertyType?.valueChanges.subscribe((val: any) => {
      const commercialPremisesControl = formControls.isFlatAboveCommercialPremises;
      const formControlsControl = formControls.floor;

      if (!commercialPremisesControl) return;

      if (val === PropertyType.FLAT_APARTMENT) {
        commercialPremisesControl.setValidators(Validators.required);
        formControlsControl.setValidators(Validators.required);
        this.securityPropertyForm.addValidators(GroupValidatorFromCore.checkOneFieldGreaterThan('floor', 'numberOfFloors'));
      } else {
        commercialPremisesControl.setValidators(null);
        formControlsControl.setValidators(null);
        this.securityPropertyForm.removeValidators(GroupValidatorFromCore.checkOneFieldGreaterThan('floor', 'numberOfFloors'));
      }
      this.securityPropertyForm.updateValueAndValidity({ emitEvent: false });
      commercialPremisesControl.updateValueAndValidity();
      formControlsControl.updateValueAndValidity();
    });

    formControls.tenure?.valueChanges.subscribe((val: any) => {
      const fieldControl = formControls.remainingTermOfLeaseInYears;

      if (val === TenureType.LEASEHOLD) {
        fieldControl.setValidators(Validators.compose([Validators.required]));
      } else {
        fieldControl.setValidators(null);
      }
      fieldControl.updateValueAndValidity();
    });

    formControls.realEstateScenario?.valueChanges.subscribe((val: any) => {
      const guaranteeSchemeControl = formControls.hasPropertyGuaranteeScheme;
      const yearBuiltValue = formControls.yearBuilt?.value;

      if (!guaranteeSchemeControl) return;

      if (new Date().getFullYear() - yearBuiltValue < 10 || val === RealEstateScenario.NEW_CONSTRUCTION) {
        guaranteeSchemeControl.setValidators(Validators.compose([Validators.required, CustomValidators.valueIs(true)]));
      } else {
        guaranteeSchemeControl.setValidators([]);
      }
      guaranteeSchemeControl.updateValueAndValidity();
    });

    formControls.yearBuilt?.valueChanges.subscribe((val: any) => {
      const guaranteeSchemeControl = formControls.hasPropertyGuaranteeScheme;
      const realEstateScenarioValue = formControls.realEstateScenario?.value;

      if (this.type === 'fma' && (new Date().getFullYear() - val < 10 || realEstateScenarioValue === RealEstateScenario.NEW_CONSTRUCTION)) {
        guaranteeSchemeControl.setValidators(Validators.compose([Validators.required, CustomValidators.valueIs(true)]));
      } else {
        guaranteeSchemeControl?.setValidators([]);
      }
      guaranteeSchemeControl?.updateValueAndValidity();
    });

    formControls.hasPropertyGuaranteeScheme?.valueChanges.subscribe((val: any) => {
      const fieldControl = formControls.propertyGuaranteeScheme;

      if (val) {
        fieldControl.setValidators(Validators.required);
      } else {
        fieldControl.setValidators([]);
      }
      fieldControl.updateValueAndValidity();
    });

    formControls.propertyGuaranteeScheme?.valueChanges.subscribe(value => {
      if (value === BuilderGuaranteeSchemeType.OTHER) {
        formControls.otherPropertyGuaranteeScheme.setValidators(Validators.required);
      } else {
        formControls.otherPropertyGuaranteeScheme.setValidators(null);
      }
      formControls.otherPropertyGuaranteeScheme.updateValueAndValidity();
    });

    formControls.constructionType?.valueChanges.subscribe(value => {
      if (value === ConstructionType.OTHER) {
        formControls.constructionDetails.setValidators(Validators.required);
      } else {
        formControls.constructionDetails.setValidators(null);
      }
      formControls.constructionDetails.updateValueAndValidity();
    });
  }

  private setValidationOnInit() {
    const formControls = this.securityPropertyForm.controls;

    if (
      this.type === 'fma' &&
      formControls.tenure?.value === TenureType.LEASEHOLD &&
      formControls.remainingTermOfLeaseInYears?.value < 85
    ) {
      formControls.remainingTermOfLeaseInYears.markAsTouched();
      formControls.remainingTermOfLeaseInYears.setValidators(Validators.compose([Validators.required, Validators.min(85)]));
    }
    if (formControls.realEstateScenario?.value === RealEstateScenario.NEW_CONSTRUCTION) {
      formControls.realEstateScenario.markAsTouched();
      formControls.realEstateScenario.setValidators([
        Validators.required,
        CustomValidators.valueIsNot(RealEstateScenario.NEW_CONSTRUCTION),
      ]);
    }

    if (
      formControls.heritageStatus?.value === HeritageStatusType.GRADE_I ||
      formControls.heritageStatus?.value === HeritageStatusType.GRADE_II_S
    ) {
      if (
        formControls.heritageStatus?.value === HeritageStatusType.GRADE_I ||
        formControls.heritageStatus?.value === HeritageStatusType.GRADE_II_S
      ) {
        formControls.heritageStatus.markAsTouched();
        formControls.heritageStatus.setValidators([
          Validators.required,
          CustomValidators.valueIsNot([HeritageStatusType.GRADE_I, HeritageStatusType.GRADE_II_S]),
        ]);
      }

      if (formControls.tenure?.value === TenureType.COMMONHOLD) {
        formControls.tenure.markAsTouched();
        formControls.tenure.setValidators([Validators.required, CustomValidators.valueIsNot(TenureType.COMMONHOLD)]);
      }

      if (this.type === 'fma' && formControls.propertyGuaranteeScheme?.value === BuilderGuaranteeSchemeType.OTHER) {
        formControls.otherPropertyGuaranteeScheme.markAsTouched();
        formControls.otherPropertyGuaranteeScheme.setValidators(Validators.required);
      }

      if (this.type === 'fma' && formControls.propertyType?.value === PropertyType.FLAT_APARTMENT) {
        formControls.floor?.setValidators(Validators.required);
        this.securityPropertyForm.addValidators(GroupValidatorFromCore.checkOneFieldGreaterThan('floor', 'numberOfFloors'));
        if (formControls.floor?.value > formControls.numberOfFloors?.value) {
          formControls.floor.markAsTouched();
        }
      }

      if (
        formControls.constructionType?.value === ConstructionType.LARGE_PANEL_SYSTEM ||
        formControls.constructionType?.value === ConstructionType.MODERN_METHOD_OF_CONSTRUCTION_MMC_SYSTEM_BUILT
      ) {
        formControls.constructionType.markAsTouched();
        formControls.constructionType.setValidators([
          Validators.required,
          CustomValidators.valueIsNot([
            ConstructionType.LARGE_PANEL_SYSTEM,
            ConstructionType.MODERN_METHOD_OF_CONSTRUCTION_MMC_SYSTEM_BUILT,
          ]),
        ]);
      }
    }

    if (formControls.constructionType?.value === ConstructionType.OTHER) {
      formControls.constructionDetails.markAsTouched();
      formControls.constructionDetails.setValidators(Validators.required);
    }
  }
  private setAddressForm() {
    const address = this.addressFeService.mapAddressBFFToAddressFE(this.currentData?.propertyAddress as Address);
    this.securityPropertyForm.get('address')?.get('selectedAddressControl')?.patchValue(address);
  }
}
