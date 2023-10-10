import { createAction, props } from '@ngrx/store';

export const init = createAction('[PortalUser Page] Init');

export const loadPortalUserSuccess = createAction('[PortalUser/API] Load PortalUser Success', props<{ entity: any }>());

export const loadPortalUserFailure = createAction('[PortalUser/API] Load PortalUser Failure', props<{ error: any }>());
