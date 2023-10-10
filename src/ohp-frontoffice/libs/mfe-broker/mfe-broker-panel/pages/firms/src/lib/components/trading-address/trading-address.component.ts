import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressSearchComponent, DialogData } from '@close-front-office/mfe-broker/shared-ui';
import { AccordionTab } from 'primeng/accordion';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import {
  AddressService,
  AddressTypeEnum,
  FirmAddressModelEx,
  RegisterAddressRequest,
} from '@close-front-office/mfe-broker/mfe-broker-panel/api';
import { debounceTime, finalize } from 'rxjs/operators';
import { SpinnerService } from '@close-front-office/mfe-broker/core';
import { AddressFeService } from '@close-front-office/mfe-broker/mfe-broker-panel/core';
import { FeAddress } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { AddressSuggestionModel } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

@Component({
  selector: 'mbpanel-trading-address',
  templateUrl: './trading-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TradingAddressComponent implements OnInit, AfterViewInit {
  @Input() tradingAddressData!: FirmAddressModelEx[];
  @ViewChildren('addressSearch') addressSearch!: QueryList<AddressSearchComponent>;
  @ViewChild('tradingAddressAccRef') tradingAddressAccRef!: AccordionTab;

  indexToDeactivate = new BehaviorSubject<number>(-1);

  deactivateWarningData: DialogData = {
    header: this.translateService.instant('general.warnings.deactivateTradingAddressHeader'),
    content: this.translateService.instant('general.warnings.deactivateTradingAddressContent'),
    type: 'danger',
    icon: 'pi-trash',
  };
  showDeactivateWarning = false;

  isReadOnlyMode = this.route.snapshot.data.readOnlyMode;
  tradingAddressIsClosed!: boolean;
  tradingAddressFormArray = this.fb.array([]);
  suggestedAddresses: Array<AddressSuggestionModel> = [];
  selectedAddress: FeAddress[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
    private addressService: AddressService,
    private spinnerService: SpinnerService,
    private addressFeService: AddressFeService,
  ) {}

  ngOnInit() {
    this.tradingAddressData?.forEach((addressData: FirmAddressModelEx) => {
      this.addTradingAddress(addressData);
    });
  }

  ngAfterViewInit(): void {
    this.tradingAddressIsClosed = !this.tradingAddressAccRef.selected;
    this.tradingAddressAccRef.selectedChange.subscribe(val => (this.tradingAddressIsClosed = !val));

    this.tradingAddressData?.forEach((addressData: FirmAddressModelEx, index) => {
      const address = this.mapAddressBFFtoAddressFe(addressData);
      this.addressSearch.get(index)?.addressForm.get('selectedAddressControl')?.patchValue(address);
      this.addressSearch.get(index)?.addressForm.disable({ emitEvent: false });
      this.addressSearch.get(index)?.addressForm.updateValueAndValidity({ emitEvent: false });
    });
    if (this.isReadOnlyMode) {
      this.tradingAddressFormArray.disable({ emitEvent: false });
    }
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

  onSelectedAddress(selectedAddress: RegisterAddressRequest, indexTradingAddress: number) {
    this.spinnerService.setIsLoading(true);
    this.addressService
      .addressPostRegisterAddress(selectedAddress)
      .pipe(finalize(() => this.spinnerService.setIsLoading(false)))
      .subscribe(selectedAddress => {
        this.selectedAddress[indexTradingAddress] = this.addressFeService.mapAddressToFeAddressModel(selectedAddress);
        this.cd.detectChanges();
      });
  }

  addTradingAddress(data: FirmAddressModelEx | null) {
    this.tradingAddressFormArray.push(this.createAddressTradingForm(data));
  }

  deleteTradingAddress(index: number) {
    this.tradingAddressFormArray.removeAt(index);
  }

  deactivateTradingAddress(i: number) {
    if (!this.tradingAddressFormArray.at(i).get('intermediaryIds')?.value.length) {
      this.indexToDeactivate.next(i);
      this.showDeactivateWarning = true;
    }
  }

  onCancel() {
    this.showDeactivateWarning = false;
    this.indexToDeactivate.next(-1);
  }

  onConfirm() {
    const indexToDeactivate = this.indexToDeactivate.getValue();
    if (indexToDeactivate !== -1) {
      this.tradingAddressFormArray.at(indexToDeactivate).get('isActive')?.patchValue(false);
      this.tradingAddressFormArray.at(indexToDeactivate).get('isActive')?.markAsTouched();
      this.tradingAddressFormArray.at(indexToDeactivate).updateValueAndValidity({ emitEvent: true });
    }
    this.showDeactivateWarning = false;
    this.cd.detectChanges();
  }

  private createAddressTradingForm(data: FirmAddressModelEx | null): FormGroup {
    return this.fb.group({
      id: [data?.id],
      isActive: [data?.isActive || true, Validators.required],
      intermediaryIds: [data?.intermediaryIds],
      businessDevelopmentManager: [
        {
          value: data?.businessDevelopmentManager,
          disabled: !!data?.id,
        },
        Validators.required,
      ],
      tradingName: [{ value: data?.tradingName, disabled: !!data?.id }, Validators.required],
      addressType: AddressTypeEnum.UK, // TODO change addressType to firmAddressType or whatever and get the real addressType
    });
  }

  private mapAddressBFFtoAddressFe(address: FirmAddressModelEx): FeAddress {
    return {
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
}
