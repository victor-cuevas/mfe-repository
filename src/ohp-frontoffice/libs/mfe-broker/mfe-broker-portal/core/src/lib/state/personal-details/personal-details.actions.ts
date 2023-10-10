import { createAction, props } from '@ngrx/store';
import { PersonalDetailsResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const initPersonalDetails = createAction('[DIP Journey] Init Personal Details');

export const loadPersonalDetailsSuccess = createAction(
  '[DIP Journey] Load Personal Details data Success',
  props<{ entity: PersonalDetailsResponse }>(),
);

export const loadPersonalDetailsFailure = createAction('[DIP Journey] Load personal details data failure', props<{ error: any }>());
