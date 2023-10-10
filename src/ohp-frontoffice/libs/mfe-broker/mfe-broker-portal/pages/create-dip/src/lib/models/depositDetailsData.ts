export interface DepositDetailsData {
  sourceOfDeposit: string;
  amountToDeposit: number;
}

export interface AddDepositDetailsData {
  depositDetails: DepositDetailsData[];
}
