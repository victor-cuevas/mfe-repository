import { Component, OnInit } from '@angular/core';
import { DataService, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'dip-buy-to-let-spv',
  templateUrl: './buy-to-let-spv.component.html',
})
export class BuyToLetSPVComponent implements OnInit {
  readonly STEP_NAME = 'btlSPV';

  // static values
  caseId: string | null | undefined;
  routePaths: typeof RoutePaths = RoutePaths;

  buyToLetSPVForm = this.fb.group({});

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.onChanges();
  }

  private onChanges(): void {
    this.buyToLetSPVForm.valueChanges.subscribe(val => {
      this.dataService.setFormData(val, this.buyToLetSPVForm.status, 'btlSPV');
    });
  }
}
