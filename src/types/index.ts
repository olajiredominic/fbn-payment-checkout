
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
  Card = "Card",
  QR = "QR",
  PAYATTITUDE = "PAYATTITUDE",
  Wallet = "Wallet",
  ACCOUNT = "ACCOUNT",
}

export enum Currencies{
   "NGN"
}

export interface Transaction{
  live?: boolean;
  ref: string;
  amount: number;
  customer: Customer;
  fees: Fee[];
  meta?: {[key:string]:any};
  publicKey: string;
  description?: string;
  currency?: "NGN"; // Replace with currency type
  callback: (data:any)=>void;
  onClose:  ()=>void;
  options?: ( "CARD"| "QR"| "PAYATTITUE"|"WALLET"|"ACCOUNT")[]
}

export interface ValidationError { error: string, field:string }

export interface InitiateTransactionPayload{
  transactionReference: string;
  amount: number;
  payerEmail: string,
  publicKey: string;
}