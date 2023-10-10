import { ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { RequiredInput, SpinnerService } from '@close-front-office/mfe-broker/core';
import { FormGroup } from '@angular/forms';
import { AddressFeService, CodeTablesService, FeAddress } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  AddressService,
  AddressSuggestionModel,
  AddressTypeEnum,
  EmploymentContractType,
  EmploymentStatus,
  IncomeType,
  RegisterAddressRequest,
  TemporaryContractType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { Calendar } from 'primeng/calendar';
import { debounceTime, finalize } from 'rxjs/operators';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Component({
  selector: 'mbp-more-employer-details',
  templateUrl: './more-employer-details.component.html',
})
export class MoreEmployerDetailsComponent {
  @ViewChild('calendarProbatoryPeriodEndDate', { static: false }) private calendarProbatoryPeriodEndDate: Calendar | undefined;
  @ViewChild('calendarDateBusinessStarted', { static: false }) private calendarDateBusinessStarted: Calendar | undefined;
  @Input() @RequiredInput form!: FormGroup;
  @Input() otherEmployment: number | undefined;

  maxDateValue = new Date();
  currentYear = new Date().getFullYear();
  futureYear = new Date().getFullYear() + 10;
  pastYear = new Date().getFullYear() - 50;

  currentDay = new Date(this.currentYear, this.maxDateValue.getMonth(), this.maxDateValue.getDate());
  maxDateProbatoryPeriodEndDate = new Date(this.futureYear, 11, 31);
  minDateProbatoryPeriodStartDate = new Date(this.pastYear, 0, 1);

  MODE: typeof Mode = Mode;
  incomeType: typeof IncomeType = IncomeType;
  employmentStatus: typeof EmploymentStatus = EmploymentStatus;
  contractType: typeof EmploymentContractType = EmploymentContractType;
  temporaryContractType: typeof TemporaryContractType = TemporaryContractType;
  addressTypeEnum: typeof AddressTypeEnum = AddressTypeEnum;

  temporaryContractTypeOptions = this.codeTablesService.getCodeTable('cdtb-broker-temporarycontracttype');
  addressTypeOptions = this.codeTablesService.getCodeTable('cdtb-broker-addresstype');
  suggestedAddresses: Array<AddressSuggestionModel> = [];
  selectedAddress: FeAddress | null = null;
  hasButtonVisible = true;

  constructor(
    private codeTablesService: CodeTablesService,
    private addressService: AddressService,
    private spinnerService: SpinnerService,
    public addressFeService: AddressFeService,
    private cd: ChangeDetectorRef,
  ) {}

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

  isLessThenProbationPeriod(contractStartDateControl: string): boolean {
    const isLessThenProbationPeriod =
      (new Date().getMonth() - new Date(contractStartDateControl).getMonth()) * 12 +
        (new Date().getFullYear() - new Date(contractStartDateControl).getFullYear()) -
        1 <
      CONFIGURATION_MOCK.PROBATION_PERIOD;
    return isLessThenProbationPeriod;
  }

  populateYearRange() {
    if (this.calendarProbatoryPeriodEndDate) {
      this.calendarProbatoryPeriodEndDate.populateYearOptions(this.currentYear, this.futureYear);
    }
    if (this.calendarDateBusinessStarted) {
      this.calendarDateBusinessStarted.populateYearOptions(this.pastYear, this.currentYear);
    }
  }
}
