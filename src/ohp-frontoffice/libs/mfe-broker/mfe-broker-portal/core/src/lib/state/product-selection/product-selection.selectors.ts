import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PRODUCT_SELECTION_FEATURE_KEY, ProductSelectionState } from './product-selection.reducer';

export const getProductSelectionState = createFeatureSelector<ProductSelectionState>(PRODUCT_SELECTION_FEATURE_KEY);

export const getProductSelectionError = createSelector(getProductSelectionState, (state: ProductSelectionState) => state.error);

export const getProductSelection = createSelector(getProductSelectionState, (state: ProductSelectionState) => state.entity);
