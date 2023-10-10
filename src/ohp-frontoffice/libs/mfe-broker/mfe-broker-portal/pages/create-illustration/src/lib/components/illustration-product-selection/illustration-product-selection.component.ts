import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  DataService,
  GenericStepForm,
  loadProductSelectionSuccess,
  StepSetupService,
} from '@close-front-office/mfe-broker/mfe-broker-portal/core';
import { Journey, ProductSelectionResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';
import { ProductSelectionComponent } from '@close-front-office/mfe-broker/mfe-broker-portal/shared';
import { Store } from '@ngrx/store';

@Component({
  selector: 'mbp-illustration-product-selection',
  templateUrl: './illustration-product-selection.component.html',
})
export class IllustrationProductSelectionComponent extends GenericStepForm implements OnDestroy {
  readonly STEP_NAME = 'productSelection';
  shouldSaveOnRedux = true;
  parentDebounceSub$ = this.debounceSub$;
  illustration = Journey.Illustration;
  @ViewChild('productSelectionChild') productSelectionChild!: ProductSelectionComponent;

  constructor(public stepSetupService: StepSetupService, private store: Store, private dataService: DataService) {
    super();
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

  protected saveOnRedux(item: ProductSelectionResponse) {
    this.store.dispatch(loadProductSelectionSuccess({ entity: item }));
  }
}
