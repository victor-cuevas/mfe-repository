import { ProductSelectionResponse, SubmissionRouteAssociationModelEx } from '@close-front-office/mfe-broker/mfe-broker-portal/api';

export interface FeProductSelectionResolve {
  productData: ProductSelectionResponse;
  networkData: SubmissionRouteAssociationModelEx;
}
