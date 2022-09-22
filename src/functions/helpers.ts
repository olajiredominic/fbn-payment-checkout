import CryptoJS from 'crypto-js'

import { Currencies, InitiateTransactionPayload, Transaction, ValidationError } from "../types";

export const validatePayment =  (txn:Transaction): true | ValidationError=>{
  const { MINAMOUNT, MAXAMOUNT } = process.env

  // Validation
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!txn.publicKey) throw { error: `Please provide your public key`, field: 'publicKey'};
  if (!txn.ref) throw { error: `Please provide a unique reference for this tranasaction`, field: 'reference'};
  if (isNaN(txn.amount)) throw { error: `Please provide a valid transaction amount`, field: 'amount'};
  if (txn.amount < MINAMOUNT) throw { error: `Amount cannot be less then ${MINAMOUNT}`, field: 'amount'};
  if (txn.amount > MAXAMOUNT) throw { error: `Amount cannot be greater then ${MAXAMOUNT}`, field: 'amount'};
  if (!emailRegex.test(txn.customer.email)) throw { error: `Please provide a valid customer email`, field: 'email'};
  if (txn.currency && Object.values(Currencies).findIndex(item => item === txn.currency) < 0) throw { error: `Currency not accepted`, field: 'currency'};

  if (!txn.callback) throw { error: `Please provide a callback function`, field: 'callback'}

  return true;
}

const cipherOptions =  {
  iv: CryptoJS.enc.Utf8.parse(''),
  padding: CryptoJS.pad.Pkcs7,
  mode: CryptoJS.mode.CBC,
  keySize: 128 / 8,
}
export const  AESEncrypt = (item:string, secret = process.env.AESKEY)=> {
  const key = CryptoJS.enc.Utf8.parse(secret);
  const ciphertext = CryptoJS.AES.encrypt(item, key, cipherOptions).toString();
  return ciphertext;
}
export const  AESDecrypt = (item:string, secret = process.env.AESKEY)=>{
  const key = CryptoJS.enc.Utf8.parse(secret);
  const decryptedData = CryptoJS.AES.decrypt(item, key, cipherOptions); // Fix: pass Base64 encoded ciphertext
  return decryptedData.toString(CryptoJS.enc.Utf8);
}

export const initiateTransaction = (txn:InitiateTransactionPayload, live:boolean = false)=> fetch(live ? process.env.LIVEAPIURL : "https://digitallabrat.net/payment-checkout/api/v1/transactions/initiate", {
  method: 'POST',
  body: JSON.stringify({ encryptedData: AESEncrypt(JSON.stringify(txn),"DCv9cjkAtiXj27U07MqLbnM0JLxEWSde")}),
  headers: {
    'Content-Type': 'application/json',
  }
})
  .then(response => response.json())

export const createDom = ()=>{
  const document = window.document;
  const div = document.createElement("div");
  div.setAttribute("id", "FBNCollections");
  div.style.display = "block";
  div.style.position = "fixed";
  div.style.zIndex = "999999";
  div.style.left = "0";
  div.style.right = "0";
  div.style.top = "0";
  div.style.bottom = "0";
  div.style.width = "100%";
  div.style.height = screen.height.toString();
  document.body.appendChild(div);

  return div;
}

export const addPaymentFrame = (div:HTMLDivElement,accessCode:string, live:boolean = false) => div.innerHTML = `<div id="FBNPaymentCard" style="z-index: 1000000;display: block;position: fixed;top: 0;left: 0;right: 0;"> <iframe src="${live ? process.env.LIVEFRAMEURL : "http://paymentcheckoutui.azurewebsites.net"}/?code=${accessCode}" allowfullscreen="true" title="FB Collections" width="100%" height="${screen.height}">
</iframe></div>`;

export const removeDom = ()=>{
  window.document.getElementById("FBNCollections")?.remove();
}
