import { createAction, props } from '@ngrx/store';

export const init = createAction('[AuthConfigUser Page] Init');

export const loadAuthConfigUserSuccess = createAction('[AuthConfigUser/API] Load AuthorisationConfigUser Success', props<{ entity: any }>());

export const loadAuthConfigUserFailure = createAction('[AuthConfigUser/API] Load AuthorisationConfigUser Failure', props<{ error: any }>());
