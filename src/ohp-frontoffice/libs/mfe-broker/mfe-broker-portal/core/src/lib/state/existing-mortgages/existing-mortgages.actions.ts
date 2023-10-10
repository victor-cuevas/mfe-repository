import { createAction, props } from '@ngrx/store';
import { ExistingMortgageResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const initExistingMortgages = createAction('[DIP Journey] Init Existing Mortgages');

export const loadExistingMortgagesSuccess = createAction(
  '[DIP Journey] Load Existing Mortgages data Success',
  props<{ entity: ExistingMortgageResponse }>(),
);

export const loadExistingMortgagesFailure = createAction('[DIP Journey] Load Existing Mortgages data Failure', props<{ error: any }>());
