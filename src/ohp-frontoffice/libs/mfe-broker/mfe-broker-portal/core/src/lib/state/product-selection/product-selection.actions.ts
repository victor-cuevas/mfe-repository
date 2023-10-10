import { createAction, props } from '@ngrx/store';
import { ProductSelectionResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const initProductSelection = createAction('[DIP Journey] Init product selection');

export const loadProductSelectionSuccess = createAction(
  '[DIP Journey] Load Product Selection data Success',
  props<{ entity: ProductSelectionResponse }>(),
);

export const loadProductSelectionFailure = createAction('[DIP Journey] Load product selection data failure', props<{ error: any }>());
