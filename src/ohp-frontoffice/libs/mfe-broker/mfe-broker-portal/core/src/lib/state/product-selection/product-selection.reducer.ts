import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import * as ProductSelectionActions from './product-selection.actions';
import { ProductSelectionResponse } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export const PRODUCT_SELECTION_FEATURE_KEY = 'productSelection';

export interface ProductSelectionState extends EntityState<ProductSelectionResponse> {
  entity?: ProductSelectionResponse;
  loaded: boolean;
  error: string | null;
}

export const ProductSelectionAdapter: EntityAdapter<ProductSelectionResponse> = createEntityAdapter<ProductSelectionResponse>();

export const initialProductSelectionState: ProductSelectionState = ProductSelectionAdapter.getInitialState({
  loaded: false,
  error: null,
});

const reducer = createReducer(
  initialProductSelectionState,
  on(ProductSelectionActions.initProductSelection, state => ({ ...state, loaded: false, error: null })),
  on(ProductSelectionActions.loadProductSelectionSuccess, (state, { entity }) => ({ ...state, entity, loaded: true })),
  on(ProductSelectionActions.loadProductSelectionFailure, (state, { error }) => ({ ...state, error })),
);

export function productSelectionReducer(state: ProductSelectionState | undefined, action: Action) {
  return reducer(state, action);
}
