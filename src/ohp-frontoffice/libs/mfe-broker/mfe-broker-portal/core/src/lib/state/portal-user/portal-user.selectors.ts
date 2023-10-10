import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PORTALUSER_FEATURE_KEY, PortalUserState } from './portal-user.reducer';

export const getPortalUserState = createFeatureSelector<PortalUserState>(PORTALUSER_FEATURE_KEY);

export const getPortalUserLoaded = createSelector(getPortalUserState, (state: PortalUserState) => state.loaded);

export const getPortalUserError = createSelector(getPortalUserState, (state: PortalUserState) => state.error);

export const getPortalUser = createSelector(getPortalUserState, (state: PortalUserState) => state.entity);
