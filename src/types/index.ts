
export interface Customer{
  firstname: string;
  lastname: string;
  email: string;
  id: string;
}

export interface Fee{
  label : string;
  amount: number;
}

export enum PaymentOptions{
  Card,
  QR,
  PAYATTITUDE,
  Wallet,
  ACCOUNT,
}

export enum Currencies{
  NGN
}

export interface Transaction{
  live?: boolean;
  ref: string;
  amount: number;
  customer: Customer;
  fees: Fee;
  meta?: any;
  publicKey: string;
  description?: string;
  currency?: Currencies;
  callback: Function;
  onClose: Function;
  options?: PaymentOptions[]
}

export interface InitiateTransactionPayload{
  transactionReference: string;
  amount: number;
  payerEmail: string,
  publicKey: string;
}