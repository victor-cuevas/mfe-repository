import { Component, Input } from '@angular/core';
import { RequiredInput } from '@close-front-office/mfe-broker/core';
import { FormGroup } from '@angular/forms';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { CodeTablesService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import {
  EmploymentStatus,
  EmploymentContractType,
  IncomeDescription,
  IncomeType,
} from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { CONFIGURATION_MOCK } from '@close-front-office/mfe-broker/shared-assets';

@Component({
  selector: 'mbp-income-details',
  templateUrl: './income-details.component.html',
})
export class IncomeDetailsComponent {
  readonly CONFIGURATION = CONFIGURATION_MOCK;

  @Input() @RequiredInput form!: FormGroup;
  @Input() otherEmployment: number | undefined;

  incomeDescriptionOptions = this.codeTablesService.getCodeTable('cdtb-broker-incomedescription');
  frequencyOptions = this.codeTablesService.getCodeTable('cdtb-salaryfrequency');
  monthsOptions = this.codeTablesService.getCodeTable('cdtb-broker-months');
  yearOptions = [new Date().getFullYear(), new Date().getFullYear() + 1];

  employmentStatus: typeof EmploymentStatus = EmploymentStatus;
  incomeType: typeof IncomeType = IncomeType;
  incomeDescription: typeof IncomeDescription = IncomeDescription;
  contractType: typeof EmploymentContractType = EmploymentContractType;

  //calendar data
  maxDateValue = new Date();
  minYear = new Date().getFullYear();
  maxYear = new Date().getFullYear() - 50;

  MODE: typeof Mode = Mode;

  constructor(private codeTablesService: CodeTablesService) {}
}
