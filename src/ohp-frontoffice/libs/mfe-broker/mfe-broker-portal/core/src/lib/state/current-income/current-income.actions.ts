import { createAction, props } from '@ngrx/store';
import { CurrentIncomeResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const initCurrentIncome = createAction('[DIP Journey] Init Current Income');

export const loadCurrentIncomeSuccess = createAction(
  '[DIP Journey] Load Current Income data Success',
  props<{ entity: CurrentIncomeResponse }>(),
);

export const loadCurrentIncomeFailure = createAction('[DIP Journey] Load Current Income data Failure', props<{ error: any }>());
