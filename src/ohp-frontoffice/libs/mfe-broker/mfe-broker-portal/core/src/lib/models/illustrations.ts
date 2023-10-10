export interface Illustrations {
  id: 0;
  illustrationIdentifier: string;
  stage: string;
  illustrations: Array<{
    id: number;
    loanAmount: number;
    interesOnly: number;
    purPrice: number;
    lvt: number;
    date: string;
    product: string;
    term: string;
    type: string;
  }>;
}
