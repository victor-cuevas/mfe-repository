export interface FeAddress {
  lineOne: string | null | undefined;
  lineTwo?: string | null | undefined;
  lineThree?: string | null | undefined;
  lineFour?: string | null | undefined;
  lineFive?: string | null | undefined;
  postcode: string | null | undefined;
  city?: string | null | undefined;
  country: string | null | undefined;
}

export interface FeTradingAddress extends FeAddress {
  tradingName: string | null | undefined;
  businessDevelopmentManager: string | null | undefined;
}
