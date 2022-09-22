import CryptoJS from 'crypto-js'

import { Currencies, InitiateTransactionPayload, Transaction } from "../types";

const { MINAMOUNT, MAXAMOUNT } = process.env

interface ValidationError { error: string, field:string };
export const validatePayment = function (txn:Transaction): true | ValidationError{
  let error:ValidationError | null = null;

  // Validation
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!txn.publicKey) error = { error: `Please provide your public key`, field: 'publicKey'};
  if (!txn.ref) error = { error: `Please provide a unique reference for this tranasaction`, field: 'reference'};
  if (!emailRegex.test(txn.customer.email)) error = { error: `Please provide a valid customer email`, field: 'email'};
  if (isNaN(txn.amount)) error = { error: `Please provide a valid transaction amount`, field: 'amount'};
  if (txn.amount < MINAMOUNT) error = { error: `Amount cannot be less then ${MINAMOUNT}`, field: 'amount'};
  if (txn.amount > MAXAMOUNT) error = { error: `Amount cannot be greater then ${MINAMOUNT}`, field: 'amount'};
  if (txn.currency && Object.values(Currencies).findIndex(item => item === txn.currency) < 0) error = { error: `Currency not accepted`, field: 'currency'};

  if (!txn.callback) error = { error: `Please provide a callback function`, field: 'callback'}

  if(!error) return true;
  else return error;

}


export const  AESEncrypt = (item:string, key = process.env.AESKEY)=> CryptoJS.AES.encrypt(item, key).toString();
export const  AESDecrypt = (item:string, key = process.env.AESKEY)=> CryptoJS.AES.decrypt(item, key).toString();

export const initiateTransaction = (txn:InitiateTransactionPayload, live:boolean = false)=> fetch(live ? process.env.LIVEAPIURL :  process.env.TESTAPIURL, {
  method: 'POST',
  body: JSON.stringify({ encryptedData: AESEncrypt(JSON.stringify(txn))}),
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())

