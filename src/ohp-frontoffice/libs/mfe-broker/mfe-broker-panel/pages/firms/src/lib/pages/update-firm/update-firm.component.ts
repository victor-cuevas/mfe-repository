import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AccordionTab } from 'primeng/accordion';
import { forkJoin, Observable, Subject } from 'rxjs';
import { concatMap, debounceTime, finalize } from 'rxjs/operators';

import {
  AddressFormData,
  AddressService,
  AddressType2,
  Club,
  FESubmissionRoute,
  FirmAddressModel,
  FirmDetailsModel,
  FirmFcaDetailsModel,
  FirmsService,
  FirmType,
  RegisterAddressRequest,
  RegisterNewFirmRequest,
  SubmissionRoute,
  SubmissionRouteGroup,
  SubmissionRouteSearchResultEntry,
  SubmissionRouteSearchResultPageModel,
  SubmissionRoutesObject,
  SubmissionRoutesService,
  SubmissionRouteType,
  UpdateFirmAddressRequest,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { AddressSuggestionModel } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { AddressFeService, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { CheckPermissionsServiceInterface, PERMISSIONS, SpinnerService } from '@close-front-office/mfe-broker/core';
import { ToastService } from '@close-front-office/mfe-broker/shared-toast';
import { AddressSearchComponent } from '@close-front-office/mfe-broker/shared-ui';
import { UpdateFirmHandlerService } from './update-firm-handler.service';
import { TradingAddressComponent } from '../../components/trading-address/trading-address.component';
import { FeAddress } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

class CustomAssociationValidators {
  static associationIsActive(object?: SubmissionRoutesObject): ValidatorFn {
    return (field: AbstractControl): ValidationErrors | null => {
      if (object) {
        return object[field.value]?.disabled ? { associationIsActive: true } : null;
      } else {
        return field.value.some((club: Club) => club.disabled) ? { associationIsActive: true } : null;
      }
    };
  }
}

@Component({
  selector: 'mbpanel-update-firm',
  templateUrl: './update-firm.component.html',
  providers: [UpdateFirmHandlerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateFirmComponent implements OnInit, AfterViewInit {
  @ViewChild(AddressSearchComponent) addressSearchComponent!: AddressSearchComponent;
  @ViewChild(TradingAddressComponent) tradingAddressComponent!: TradingAddressComponent;
  @ViewChild('firmDetailsAccRef') firmDetailsAccRef!: AccordionTab;
  @ViewChild('mortgageClubsAccRef') mortgageClubsAccRef!: AccordionTab;
  @ViewChild('networkAccRef') networkAccRef!: AccordionTab;

  firmId = this.route.snapshot.paramMap.get('id');
  isReadOnlyMode = this.route.parent?.parent?.snapshot.data.readOnlyMode;
  firmData: FirmDetailsModel = this.route.snapshot.data.fetchedData?.firmDetail;
  firmAddressData: FirmAddressModel | null = null;
  tradingAddressData: FirmAddressModel[] = [];
  tradingAddressDataIsReady = false;

  fcaData: FirmFcaDetailsModel | undefined;
  clubsOptions: Club[] = [];
  submissionRoutesGroups = ['All', 'DirectlyAuthorized', 'Network'];
  submissionRoutesSelectedGroup = this.submissionRoutesGroups[0];
  submissionRoutesOptions: SubmissionRouteGroup[] = ['DirectlyAuthorized', 'Network'].map(type => ({
    label: type,
    value: type,
    items: [],
  }));
  submissionRoutesObject: SubmissionRoutesObject = {};
  submissionRoutesFilteredOptions: SubmissionRouteGroup[] = this.submissionRoutesOptions;

  //Firms type
  firmTypes = [
    { icon: 'pi pi-sitemap', type: 'Directly Authorised', value: 'DirectlyAuthorized' },
    { icon: 'pi pi-sitemap', type: 'Appointed Representative', value: 'AppointedRepresentative' },
  ];

  isAR = false;
  isFCADetails = true;
  isPopulateDataButtonVisible = false;
  isFCANumberSelected = false;
  isDirectlyAuthorized = this.firmData?.firmType ? this.firmData.firmType === FirmType.DirectlyAuthorized : true;
  hasButtonVisible = true;
  hasAutoSuggestVisible = true;
  hasNoValidation = false;

  routePaths: typeof RoutePaths = RoutePaths;
  breadcrumb: MenuItem[] = [{ label: 'Back', routerLink: '../', icon: 'pi pi-chevron-left' }];
  firmForm!: FormGroup;
  associationForm!: FormGroup;

  firmDetailsIsClosed!: boolean;
  mortgageClubsIsClosed!: boolean;
  networkIsClosed!: boolean;
  hasNotPermissionNetworks = this.checkPermissionService.checkPermissions({
    section: 'firms',
    features: ['firm'],
  });
  selectedAddressSub: Subject<FeAddress> = new Subject();
  selectedAddressFCADetailsSub: Subject<FeAddress> = new Subject<FeAddress>();
  showFirmDetails = true;
  suggestedAddresses: Array<AddressSuggestionModel> = [];
  selectedAddress: FeAddress | null = null;

  get clubsForm() {
    return this.associationForm.controls.clubs;
  }

  get submissionRouteForm() {
    return this.associationForm.controls.submissionRoute;
  }

  constructor(
    @Inject(PERMISSIONS) private checkPermissionService: CheckPermissionsServiceInterface,
    private firmsService: FirmsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private spinnerService: SpinnerService,
    private submissionRouteService: SubmissionRoutesService,
    private handler: UpdateFirmHandlerService,
    private cd: ChangeDetectorRef,
    private addressService: AddressService,
    private addressFeService: AddressFeService,
  ) {}

  ngOnInit() {
    this.firmForm = this.handler.createForm();
    this.associationForm = this.handler.createAssociationForm();
    if (this.isReadOnlyMode) {
      this.firmForm.disable();
      this.associationForm.disable();
    }
    if (this.hasNotPermissionNetworks) {
      this.associationForm.get('submissionRoute')?.disable();
    }
    this.cd.detectChanges();
    this.onChanges();
  }

  ngAfterViewInit(): void {
    this.firmDetailsIsClosed = !this.firmDetailsAccRef.selected;
    this.mortgageClubsIsClosed = !this.mortgageClubsAccRef.selected;
    this.networkIsClosed = !this.networkAccRef.selected;
    this.firmDetailsAccRef.selectedChange.subscribe(val => (this.firmDetailsIsClosed = !val));
    this.mortgageClubsAccRef.selectedChange.subscribe(val => (this.mortgageClubsIsClosed = !val));
    this.networkAccRef.selectedChange.subscribe(val => (this.networkIsClosed = !val));

    //Get firm details for the edit mode
    if (this.firmId) {
      this.isFCANumberSelected = true;
      this.hasButtonVisible = false;
      this.hasAutoSuggestVisible = false;
      this.firmData = this.route.snapshot.data.fetchedData.firmDetail;

      this.route.snapshot.data.fetchedData.firmAddress.forEach((el: FirmAddressModel) => {
        el.addressType = el.addressType.replace('_', ' ') as AddressType2;
        if (el.addressType === AddressType2.FirmAddress) {
          this.firmAddressData = el;
        } else if (el.addressType === AddressType2.TradingAddress && el.isActive) {
          this.tradingAddressData.push(el);
        }
      });
      this.tradingAddressDataIsReady = true;

      if (this.firmData.firmType === 'AppointedRepresentative') {
        this.isAR = true;
      }
      this.firmForm.patchValue(this.handler.mapToForm(this.firmData, this.firmAddressData as FirmAddressModel));
      if (this.firmAddressData) {
        const address = this.addressFeService.mapFirmAddressModelToAddressFE(this.firmAddressData);
        this.firmForm.get('address')?.get('selectedAddressControl')?.patchValue(address);
      }
    } else {
      this.showFirmDetails = false;
    }

    //Get all the submission route
    forkJoin([
      this.submissionRouteService.submissionRoutesSearchSubmissionRoute({
        submissionRouteType: this.isDirectlyAuthorized
          ? [SubmissionRouteType.Network, SubmissionRouteType.DirectlyAuthorized]
          : [SubmissionRouteType.Network],
        partialFirmName: '',
      }),
      this.submissionRouteService.submissionRoutesSearchSubmissionRoute({
        submissionRouteType: [SubmissionRouteType.MortgageClub],
        partialFirmName: '',
      }),
    ]).subscribe(
      ([submissionRoutesResult, mortgageClubsResult]: [SubmissionRouteSearchResultPageModel, SubmissionRouteSearchResultPageModel]) => {
        const submissionRoutes: FESubmissionRoute[] = [
          ...(this.route.snapshot.data.fetchedData?.associationsDetails.networks || []),
          ...(this.route.snapshot.data.fetchedData?.associationsDetails.directlyAuthorized || []),
        ]?.map((submissionRoute: SubmissionRoute) => ({
          label: submissionRoute.firmName,
          value: `${submissionRoute.submissionRouteType}-${submissionRoute.id}`,
          id: submissionRoute.id,
          submissionRouteType: submissionRoute.submissionRouteType,
          firmFcaReference: submissionRoute.firmFcaReference,
          disabled: !submissionRoute.isActivated,
        }));
        const clubs: Club[] =
          this.route.snapshot.data.fetchedData?.associationsDetails.clubs
            ?.map((club: SubmissionRoute) => ({
              label: club.firmName,
              value: club.id,
              disabled: !club.isActivated,
            }))
            .sort((a: Club, b: Club) => a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase())) || [];
        const clubsValues: string[] = clubs.map((club: Club) => club.value);

        let submissionRoutesOptions: FESubmissionRoute[] = submissionRoutesResult.items
          .filter(
            (submissionRoute: SubmissionRouteSearchResultEntry) =>
              submissionRoute.isActivated || submissionRoute.id === submissionRoutes[0]?.id,
          )
          .map((submissionRoute: SubmissionRouteSearchResultEntry) => ({
            label: submissionRoute.firmName,
            value: `${submissionRoute.submissionRouteType}-${submissionRoute.id}`,
            id: submissionRoute.id,
            submissionRouteType: submissionRoute.submissionRouteType,
            firmFcaReference: submissionRoute.firmFcaReference,
            disabled: !submissionRoute.isActivated,
          }))
          .sort((a, b) => a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase()));

        if (this.isDirectlyAuthorized && this.firmData) {
          submissionRoutesOptions = submissionRoutesOptions.sort((a, b) =>
            a.firmFcaReference == this.firmData.fcaReference ? -1 : b.firmFcaReference == this.firmData.fcaReference ? 1 : 0,
          );
        }

        this.submissionRoutesOptions = this.submissionRoutesOptions.map(submissionRoutesGroup => ({
          ...submissionRoutesGroup,
          items: [
            ...submissionRoutesOptions.filter(
              (submissionRoutesOption: FESubmissionRoute) => submissionRoutesOption.submissionRouteType === submissionRoutesGroup.value,
            ),
          ],
        }));

        this.submissionRoutesFilteredOptions = this.submissionRoutesOptions;

        this.submissionRoutesObject = submissionRoutesOptions.reduce(
          (obj, option: FESubmissionRoute) => ({ ...obj, [option.value]: option }),
          {},
        );

        this.clubsOptions = mortgageClubsResult.items
          .filter((mortgageClub: SubmissionRouteSearchResultEntry) => mortgageClub.isActivated || clubsValues.includes(mortgageClub.id))
          .map((mortgageClub: SubmissionRouteSearchResultEntry) => ({
            label: mortgageClub.firmName,
            value: mortgageClub.id,
            disabled: !mortgageClub.isActivated,
          }))
          .sort((a, b) => a.label.toLocaleLowerCase().localeCompare(b.label.toLocaleLowerCase()));

        this.submissionRouteForm.setValue(submissionRoutes[0]?.value);
        this.clubsForm.setValue(clubs);

        this.submissionRouteForm.setValidators([CustomAssociationValidators.associationIsActive(this.submissionRoutesObject)]);
        this.clubsForm.setValidators([CustomAssociationValidators.associationIsActive()]);

        this.submissionRouteForm.markAsDirty();
        this.clubsForm.markAsDirty();

        this.submissionRouteForm.updateValueAndValidity();
        this.clubsForm.updateValueAndValidity();
      },
    );

    //Set the button populate data visible or not
    this.isPopulateDataButtonVisible = !this.firmId;

    //Checking if the firm type is AR to show the principal FCA Number field
    this.firmForm.controls['firmType'].valueChanges.subscribe((val: string) => {
      const principalFcaReferenceControl = this.firmForm.controls.principalFcaReference;
      if (val === 'AppointedRepresentative') {
        this.isAR = true;
        principalFcaReferenceControl.setValidators([Validators.required, Validators.min(1), Validators.max(9999999)]);
        principalFcaReferenceControl.updateValueAndValidity();
      } else {
        this.isAR = false;
        principalFcaReferenceControl.setValidators(null);
        principalFcaReferenceControl.setValue(null);
        principalFcaReferenceControl.updateValueAndValidity();
      }
    });
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

  onChanges(): void {
    this.firmForm.controls.isTradingAddress.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.firmForm.get('tradingName')?.setValidators(Validators.required);
        this.firmForm.get('businessDevelopmentManager')?.setValidators(Validators.required);
      } else {
        this.firmForm.get('tradingName')?.setValidators(null);
        this.firmForm.get('tradingName')?.setValidators(null);
      }
    });
  }

  populateData() {
    if (this.firmForm.controls.fcaReference.value) {
      this.spinnerService.setIsLoading(true);
      if (this.firmForm.controls.fcaReference.valid)
        this.firmsService
          .firmsGetFcaDetailsById(this.firmForm.controls.fcaReference.value, 'response')
          .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
          .subscribe(
            (response: HttpResponse<FirmFcaDetailsModel>) => {
              if (response.status === 200) {
                this.isFCANumberSelected = true;
                this.firmForm.controls.fcaReference.markAsDirty();
                this.firmForm.controls.fcaReference.setErrors({ isValidFCANumber: false });
              }
              if (response && response.body) {
                this.fcaData = response.body;
                this.showFirmDetails = true;
                this.lockDefaultStructure();
                setTimeout(() => {
                  this.populateFCADetailsFields(this.fcaData);
                  this.submissionRoutesOptions[0].items = this.submissionRoutesOptions[0].items.sort((a, b) =>
                    a.firmFcaReference == this.fcaData?.fcaReference ? -1 : b.firmFcaReference == this.fcaData?.fcaReference ? 1 : 0,
                  );
                  if (!this.firmForm.controls.complaintsWebpage.value) {
                    this.firmForm.controls.complaintsWebpage.enable();
                  }

                  if (!this.firmForm.controls.email.value) {
                    this.firmForm.controls.email.enable();
                  }
                });
              }
            },
            () => {
              this.firmForm.controls.fcaReference.markAsDirty();
              this.firmForm.controls.fcaReference.setErrors({ isValidFCANumber: true });
              this.isPopulateDataButtonVisible = true;
            },
          );
      this.lockDefaultStructure();
      this.isPopulateDataButtonVisible = false;
    }
  }

  updateFirm() {
    this.firmForm.markAllAsTouched();
    if (this.firmForm.valid) {
      const firmFormValues = this.firmForm.getRawValue();

      this.spinnerService.setIsLoading(true);
      if (this.firmId) {
        const obs$: Observable<any>[] = [];
        let associationObs$: Observable<any>;
        if (this.hasNotPermissionNetworks) {
          associationObs$ = this.submissionRouteService.submissionRoutesPutSubmissionRouteAssociations(
            this.firmId,
            this.handler.mapToDTOAssociationsJustClub(this.clubsForm.value),
          );
        } else {
          associationObs$ = this.submissionRouteService.submissionRoutesPutSubmissionRouteAssociations(
            this.firmId,
            this.handler.mapToDTOAssociations(this.submissionRouteForm.value, this.clubsForm.value, this.submissionRoutesObject),
          );
        }

        obs$.push(
          this.firmsService.firmsPutFirm(this.firmId, this.handler.mapToDTOFirm(firmFormValues, this.firmData)),
          this.firmsService.firmsPutFirmAddress(
            this.firmId,
            this.firmData.firmAddressId,
            this.handler.mapToDTOAddress(this.firmForm.getRawValue().address, this.firmAddressData?.version || 0),
          ),
          associationObs$,
        );
        const tradingAdresses = (this.tradingAddressComponent.tradingAddressFormArray.controls as FormGroup[])
          .filter(formControl => formControl.touched)
          .map(formControl => {
            const tradingAddress: AddressFormData = formControl.getRawValue();
            if (tradingAddress.id) {
              if (!tradingAddress.isActive) {
                return this.firmsService.firmsPutDeactivateFirmAddress(this.firmId || '', tradingAddress.id);
              } else {
                return this.firmsService.firmsPutFirmAddress(this.firmId as string, tradingAddress.id, this.mapAddress(tradingAddress));
              }
            }
            return this.firmsService.firmsPostTradingAddress(this.firmId as string, this.mapAddress(tradingAddress));
          });
        obs$.push(...tradingAdresses);
        forkJoin(obs$)
          .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
          .subscribe(() => {
            this.router.navigate([this.firmId ? this.routePaths.LIST_INTERMEDIARIES.replace(':id', this.firmId) : '']).then(() => {
              this.toastService.showMessage({ summary: `${this.firmForm.controls.firmName.value} has been edited successfully` });
            });
          });
      } else {
        this.firmsService
          .firmsPostFirm(
            this.handler.mapToDTO(this.firmForm.getRawValue(), this.tradingAddressComponent?.tradingAddressFormArray.getRawValue()),
          )
          .pipe(
            concatMap((response: RegisterNewFirmRequest) => {
              return response.firmId
                ? this.submissionRouteService.submissionRoutesPutSubmissionRouteAssociations(
                    response?.firmId,
                    this.handler.mapToDTOAssociations(this.submissionRouteForm.value, this.clubsForm.value, this.submissionRoutesObject),
                  )
                : '';
            }),
          )
          .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
          .subscribe(
            () => {
              this.router.navigate([this.routePaths.LIST_FIRMS]).then(() => {
                this.toastService.showMessage({ summary: `${this.firmForm.controls.firmName.value} has been created successfully` });
              });
            },
            () => {
              this.spinnerService.setIsLoading(false);
            },
          );
      }
    }
  }

  mapAddress(data: AddressFormData): UpdateFirmAddressRequest {
    const address = data.address as FeAddress;
    const { tradingName, businessDevelopmentManager, version } = data;
    return {
      tradingName,
      businessDevelopmentManager,
      version: version as number,
      lineOne: address?.lineOne,
      lineTwo: address?.lineTwo,
      lineThree: address?.lineThree,
      lineFour: address?.lineFour,
      lineFive: address?.lineFive,
      postcode: address?.postcode,
      city: address?.city,
      country: address?.country,
    };
  }

  onInputChange() {
    this.isFCADetails = true;
    this.isPopulateDataButtonVisible = true;
    this.isFCANumberSelected = false;
    this.showFirmDetails = false;
    if (this.isFCANumberSelected) {
      this.populateFCADetailsFields();
    }
  }

  unlockDefaultStructure() {
    this.isFCADetails = false;
    this.isFCANumberSelected = false;
    this.hasButtonVisible = true;
    this.hasAutoSuggestVisible = true;
    this.hasNoValidation = true;
  }

  lockDefaultStructure() {
    this.isFCADetails = true;
    this.hasButtonVisible = false;
    this.hasAutoSuggestVisible = false;
    this.hasNoValidation = true;
  }

  onRemoveClub(value: string) {
    this.clubsForm.patchValue(this.clubsForm.value.filter((club: Club) => club.value !== value));
  }

  onDropdownClick(event: Event) {
    event.stopPropagation();
  }

  onSelectSubmissionRouteGroup(event: Event, group: string) {
    event.stopPropagation();
    this.submissionRoutesSelectedGroup = group;
    this.submissionRoutesFilteredOptions =
      group === 'All'
        ? this.submissionRoutesOptions
        : this.submissionRoutesOptions.filter((groupOptions: SubmissionRouteGroup) => groupOptions.value === group);

    if (!this.submissionRoutesFilteredOptions[0].items.length) this.submissionRoutesFilteredOptions = [];
  }

  private populateFCADetailsFields(data?: FirmFcaDetailsModel) {
    if (data && data?.firmAddress) {
      this.selectedAddress = this.addressFeService.mapAddressFirmToFeAddress(data?.firmAddress);
    }
    const fcaDetails = {
      ...this.firmForm.value,
      firmName: data ? data.firmName : null,
      website: data ? data.website : null,
      telephone: data ? data.telephone?.mobile : null,
    };

    this.firmForm.patchValue(fcaDetails);
    this.cd.detectChanges();
  }
}
