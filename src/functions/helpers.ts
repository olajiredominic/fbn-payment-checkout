import { LIVEAPIURL, LIVEFRAMEURL, MAXAMOUNT, MINAMOUNT, LIVEPUBLICKEY, TESTPUBLICKEY, TESTAPIURL, TESTFRAMEURL } from '../consts';

import { Currencies, InitiateTransactionPayload, Transaction, ValidationError } from "../types";

import forge from "node-forge";

export const validatePayment = (txn: Transaction): true | ValidationError => {
  // Validation
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!txn.publicKey) throw { error: `Please provide your public key`, field: 'publicKey' };
  if (!txn.ref) throw { error: `Please provide a unique reference for this tranasaction`, field: 'reference' };
  if (isNaN(txn.amount)) throw { error: `Please provide a valid transaction amount`, field: 'amount' };
  if (txn.amount < MINAMOUNT) throw { error: `Amount cannot be less then ${MINAMOUNT}`, field: 'amount' };
  if (txn.amount > MAXAMOUNT) throw { error: `Amount cannot be greater then ${MAXAMOUNT}`, field: 'amount' };
  if (!emailRegex.test(txn.customer.email)) throw { error: `Please provide a valid customer email`, field: 'email' };
  if (txn.currency && Object.values(Currencies).findIndex((item: any) => item === txn.currency) < 0) throw { error: `Currency not accepted`, field: 'currency' };

  if (!txn.callback) throw { error: `Please provide a callback function`, field: 'callback' }

  return true;
}

export const RSAEncrypt = (text: string, live: boolean = false) => {
  const rsa = forge.pki.publicKeyFromPem(live ? LIVEPUBLICKEY : TESTPUBLICKEY);
  return forge.util.encode64(rsa.encrypt(text));
}

export const initiateTransaction = (txn: InitiateTransactionPayload, live: boolean = false) => fetch(live ? LIVEAPIURL : TESTAPIURL, {
  method: 'POST',
  body: JSON.stringify({ encryptedData: RSAEncrypt(JSON.stringify(txn), live) }),
  headers: {
    'Content-Type': 'application/json',
  }
}).then(response => response.json())

export const createDom = (live: boolean) => {
  const document = window.document;
  const div = document.createElement("div");
  div.setAttribute("id", "FBNCollections");
  div.style.display = "block";
  div.style.position = "fixed";
  div.style.zIndex = "999999";
  div.style.backgroundColor = " rgba(49, 49, 49, 0.6)";
  div.style.left = "0";
  div.style.right = "0";
  div.style.top = "0";
  div.style.bottom = "0";
  div.style.width = "100%";
  div.style.height = window.screen.height.toString();
  document.body.appendChild(div);

  const placeholderDiv = document.createElement("div");
  placeholderDiv.style.display = "flex";
  placeholderDiv.style.alignItems = "center";
  placeholderDiv.style.justifyContent = "center";
  placeholderDiv.style.position = "fixed";
  placeholderDiv.style.zIndex = "9999999";
  placeholderDiv.style.width = "100%";
  placeholderDiv.style.height = "100%";

  const subDiv = document.createElement("div");
  subDiv.style.height = "300px";

  const logo = document.createElement("img");
  logo.style.display = "block";
  logo.style.height = "85px";
  logo.setAttribute("src", `${live ? LIVEFRAMEURL : TESTFRAMEURL}/static/media/logo.1681bc9a2f5a55104bbc.png`);

  const loader = document.createElement("img");
  loader.style.display = "block";
  loader.style.height = "95px";
  loader.style.marginLeft = "auto";
  loader.style.marginRight = "auto";
  loader.setAttribute("src", `${live ? LIVEFRAMEURL : TESTFRAMEURL}/static/media/loader_ring.f8e33832cfc1907461a4.gif`);

  subDiv.appendChild(logo)
  subDiv.appendChild(loader)
  placeholderDiv.appendChild(subDiv)
  div.appendChild(placeholderDiv)

  return div;
}

export const addPaymentFrame = (div: HTMLDivElement, accessCode: string, live: boolean = false) => {
  const frameDiv = document.createElement("div");
  frameDiv.setAttribute("id", "FBNPaymentCard");
  frameDiv.style.display = "block";
  frameDiv.style.width = "100%";
  frameDiv.style.position = "fixed";
  frameDiv.style.zIndex = "10000000";
  frameDiv.innerHTML = `<iframe src="${live ? LIVEFRAMEURL : TESTFRAMEURL}/?code=${accessCode}" allowfullscreen="true" title="FB Collections" width="100%" height="${window.screen.height}"></iframe>`;

  div.appendChild(frameDiv)
}

export const removeDom = () => {
  window.document.getElementById("FBNCollections")?.remove();
}
