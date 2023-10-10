import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { DataService, GenericStepForm, StepSetupService } from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { Journey, ProductSelectionResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ProductSelectionComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'close-front-office-fma-product-selection',
  templateUrl: './fma-product-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FmaProductSelectionComponent extends GenericStepForm implements AfterViewInit, OnDestroy {
  readonly STEP_NAME = 'productSelection';
  fma = Journey.Fma;
  parentDebounceSub$ = this.debounceSub$;
  @ViewChild('productSelectionChild') productSelectionChild!: ProductSelectionComponent;

  constructor(public stepSetupService: StepSetupService, private dataService: DataService) {
    super();
  }

  ngAfterViewInit() {
    this.checkActiveJourney();
  }

  ngOnDestroy() {
    return super.checkSubscription();
  }

  checkActiveJourney() {}

  canDeactivate(): Observable<boolean> {
    return super.canDeactivate();
  }

  hasUnsavedChanges(): boolean {
    const navigateToPanel = this.dataService.navigatedToPanel$.getValue();
    return this.productSelectionChild.productSelectionForm.dirty && !navigateToPanel;
  }

  saveData(): Observable<ProductSelectionResponse> {
    return this.productSelectionChild.saveData();
  }

  getData(): Observable<undefined> {
    return of(undefined);
  }

  mapToDTO(): undefined {
    return undefined;
  }
}
