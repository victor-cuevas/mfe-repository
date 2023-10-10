import { Component, OnInit } from '@angular/core';
import { DataService, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'dip-buy-to-let-property-details',
  templateUrl: './buy-to-let-property-details.component.html',
})
export class BuyToLetPropertyDetailsComponent implements OnInit {
  readonly STEP_NAME = 'btlPropertyDetails';

  // static values
  caseId: string | null | undefined;
  routePaths: typeof RoutePaths = RoutePaths;

  buyToLetPropertyDetailsForm = this.fb.group({});

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.onChanges();
  }

  private onChanges(): void {
    this.buyToLetPropertyDetailsForm.valueChanges.subscribe(val => {
      this.dataService.setFormData(val, this.buyToLetPropertyDetailsForm.status, 'btlPropertyDetails');
    });
  }
}
