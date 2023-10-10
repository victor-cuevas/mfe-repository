export enum Mode {
  CURRENCY = 'currency',
  DECIMAL = 'decimal',
  ZEROS = 'leadingZeros',
}

export interface DecimalConfig {
  mode?: Mode.DECIMAL;
  useGrouping?: boolean;
  min?: number | null;
  max?: number | null;
  length?: number | null;
  maxFractionDigits?: number;
  minFractionDigits?: number;
}

export interface CurrencyConfig {
  mode?: Mode.CURRENCY;
  currency?: string;
  maxFractionDigits?: number;
  min?: number | null;
  length?: number | null;
}

export interface LeadingZerosConfig {
  mode?: Mode.ZEROS;
  min?: number | null;
  length?: number | null;
  fillWithZeros?: boolean | null;
}
