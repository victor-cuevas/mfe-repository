import { createFeatureSelector, createSelector } from '@ngrx/store';
import { USERPROFILE_FEATURE_KEY, UserProfileState } from './profile.reducer';

// Lookup the 'UserRoles' feature state managed by NgRx
export const getUserProfileState = createFeatureSelector<UserProfileState>(USERPROFILE_FEATURE_KEY);

export const getUserProfileLoaded = createSelector(getUserProfileState, (state: UserProfileState) => state.loaded);

export const getUserProfileError = createSelector(getUserProfileState, (state: UserProfileState) => state.error);

export const getUserProfile = createSelector(getUserProfileState, (state: UserProfileState) => state.entity);
