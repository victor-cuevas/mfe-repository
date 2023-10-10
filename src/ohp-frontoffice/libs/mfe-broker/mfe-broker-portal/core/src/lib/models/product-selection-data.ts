import { SelectedProduct } from './selected-product';

export interface ProductSelectionData {
  networkName: string;
  mortgageClub: string;
  useMortgageClub: boolean;
  products: SelectedProduct[];
}
