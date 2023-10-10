import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';

@Component({
  selector: 'dip-credit-history',
  templateUrl: './credit-history.component.html',
})
export class CreditHistoryComponent implements OnInit {
  // static values
  caseId: string | null | undefined;
  routePaths: typeof RoutePaths = RoutePaths;

  creditHistoryForm = this.fb.group({});

  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit() {
    this.onChanges();
  }

  onChanges(): void {
    this.creditHistoryForm.valueChanges.subscribe(val => {
      this.dataService.setFormData(val, this.creditHistoryForm.status, 'step11');
    });
  }
}
