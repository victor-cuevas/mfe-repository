import { Component, OnInit } from '@angular/core';
import { DataService, RoutePaths } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'dip-buy-to-let-portfolio',
  templateUrl: './buy-to-let-portfolio.component.html',
})
export class BuyToLetPortfolioComponent implements OnInit {
  readonly STEP_NAME = 'btlPortfolio';

  // static values
  caseId: string | null | undefined;
  routePaths: typeof RoutePaths = RoutePaths;

  buyToLetPortfolioForm = this.fb.group({});
  constructor(private fb: FormBuilder, private dataService: DataService) {}

  ngOnInit(): void {
    this.onChanges();
  }

  private onChanges(): void {
    this.buyToLetPortfolioForm.valueChanges.subscribe(val => {
      this.dataService.setFormData(val, this.buyToLetPortfolioForm.status, 'btlPortfolio');
    });
  }
}
