import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../models/profile';

export const init = createAction('[UserRoles Page] Init');

export const loadUserProfileSuccess = createAction('[UserProfile/API] Load UserProfile Success', props<{ entity: UserProfile }>());

export const loadUserProfileFailure = createAction('[UserProfile/API] Load UserProfileFailure', props<{ error: any }>());
