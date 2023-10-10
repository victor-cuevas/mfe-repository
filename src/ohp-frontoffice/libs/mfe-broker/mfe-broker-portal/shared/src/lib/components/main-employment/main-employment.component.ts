import { Component, Input, ViewChild } from '@angular/core';
import { RequiredInput } from '@close-front-office/mfe-broker/core';
import { FormGroup } from '@angular/forms';
import { CodeTablesService, DataService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { EmploymentContractType, EmploymentStatus, IncomeType } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { Mode } from '@close-front-office/mfe-broker/shared-ui';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'mbp-main-employment',
  templateUrl: './main-employment.component.html',
})
export class MainEmploymentComponent {
  @Input() @RequiredInput form!: FormGroup;
  @Input() otherEmployment: number | undefined;
  @ViewChild('calendarContractEndDate', { static: false }) private calendarContractEndDate: Calendar | undefined;
  @ViewChild('calendarContractStartDate', { static: false }) private calendarContractStartDate: Calendar | undefined;
  MODE: typeof Mode = Mode;
  //Dropdown value
  employmentStatusOptions = this.codeTablesService.getCodeTable('cdtb-ads-employmentstatus');
  employmentStatusShortOptions = this.codeTablesService.getCodeTable('cdtb-ads-employmentstatus').slice(0, 5);
  contractTypeOptions = this.codeTablesService.getCodeTable('cdtb-employmentcontracttype');
  incomeTypeOptions = this.codeTablesService.getCodeTable('cdtb-broker-incometype');
  incomeSourceOptions = this.codeTablesService.getCodeTable('cdtb-broker-incomesource');
  frequencyOptions = this.codeTablesService.getCodeTable('cdtb-salaryfrequency');
  companyTypeOptions = this.codeTablesService.getCodeTable('cdtb-ads-ownedcompanytype');
  partnershipTypeOptions = this.codeTablesService.getCodeTable('cdtb-ads-partnershiptype');

  incomeType: typeof IncomeType = IncomeType;
  employmentStatus: typeof EmploymentStatus = EmploymentStatus;
  contractType: typeof EmploymentContractType = EmploymentContractType;

  pastYear = new Date().getFullYear() - 50;
  currentYear = new Date().getFullYear();
  futureYear = new Date().getFullYear() + 10;

  currentDay = new Date(this.currentYear, new Date().getMonth(), new Date().getDate());
  maxDateContractEndDate = new Date(this.futureYear, 11, 31);
  minDateContractStartDate = new Date(this.pastYear, 0, 1);

  lessThenThreeMonth = false;

  constructor(private codeTablesService: CodeTablesService, public dataService: DataService) {}

  configurationMainEmployment(employmentStatus: string): boolean {
    if (
      employmentStatus === EmploymentStatus.Employed ||
      employmentStatus === EmploymentStatus.SelfEmployedPartnership ||
      employmentStatus === EmploymentStatus.SelfEmployed ||
      employmentStatus === EmploymentStatus.Director25Plus ||
      employmentStatus === EmploymentStatus.DirectorLess25
    ) {
      return true;
    }
    return false;
  }

  lessThenThreeMonthValidation(): boolean {
    const contactStartDate = new Date(this.form.get('contractStartDate')?.value);
    const threeMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 3));
    if (contactStartDate > threeMonthAgo) {
      return true;
    }
    return false;
  }

  populateYearRange() {
    if (this.calendarContractEndDate) {
      this.calendarContractEndDate.populateYearOptions(this.currentYear, this.futureYear);
    }
    if (this.calendarContractStartDate) {
      this.calendarContractStartDate.populateYearOptions(this.pastYear, this.currentYear);
    }
  }
}
