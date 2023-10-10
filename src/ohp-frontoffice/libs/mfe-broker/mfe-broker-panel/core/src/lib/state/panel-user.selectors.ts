import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PANELUSER_FEATURE_KEY, PanelUserState } from './panel-user.reducer';

export const getPanelUserState = createFeatureSelector<PanelUserState>(PANELUSER_FEATURE_KEY);

export const getPanelUserLoaded = createSelector(getPanelUserState, (state: PanelUserState) => state.loaded);

export const getPanelUserError = createSelector(getPanelUserState, (state: PanelUserState) => state.error);

export const getPanelUser = createSelector(getPanelUserState, (state: PanelUserState) => state.entity);
