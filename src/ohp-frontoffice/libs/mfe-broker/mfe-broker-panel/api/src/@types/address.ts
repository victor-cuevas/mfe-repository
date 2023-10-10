export interface AddressFormData {
  version?: number | null;
  id?: string | null;
  isActive?: boolean | null;
  businessDevelopmentManager?: string | null;
  tradingName?: string | null;
  addressType?: string | null;
  address?: {
    selectedAddressControl?: {
      globalAddressKey?: string | null;
      text?: string | null;
    };
    addressLine1?: string | null;
    addressLine2?: string | null;
    addressLine3?: string | null;
    addressLine4?: string | null;
    addressLine5?: string | null;
    zipCode?: string | null;
    city?: string | null;
    country?: string | null;
  };
}
