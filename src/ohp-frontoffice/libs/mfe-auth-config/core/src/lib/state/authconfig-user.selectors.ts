import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AUTHCONFIGUSER_FEATURE_KEY, AuthConfigUserState } from './authconfig-user.reducer';

export const getAuthConfigUserState = createFeatureSelector<AuthConfigUserState>(AUTHCONFIGUSER_FEATURE_KEY);

export const getAuthConfigUserLoaded = createSelector(getAuthConfigUserState, (state: AuthConfigUserState) => state.loaded);

export const getAuthConfigUserError = createSelector(getAuthConfigUserState, (state: AuthConfigUserState) => state.error);

export const getAuthConfigUser = createSelector(getAuthConfigUserState, (state: AuthConfigUserState) => state.entity);
