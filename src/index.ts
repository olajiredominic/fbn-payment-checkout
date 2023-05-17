import { LIVEFRAMEURL, TESTFRAMEURL } from "./consts";
import { addPaymentFrame, createDom, initiateTransaction, removeDom, validatePayment } from "./functions/helpers"
import { InitiateTransactionPayload, Transaction } from "./types"

class FBNCheckout {
  private _transaction: Transaction;

  constructor(transaction: Transaction) {
    this._transaction = transaction;
    try {
      validatePayment(transaction);
    } catch (error) {
      this._transaction?.callback({ status: "error", error });
    }
  }

  private initiateTransaction = async () => {
    const dom = createDom(this._transaction?.live || false);
    this.initiatePayment().then((response) => {
      if (response.status === 400 || !response.data || !response.data.accesscode) throw response
      addPaymentFrame(dom, response.data.accesscode, this._transaction?.live);
      window.addEventListener('message', (ev) => this.handleDomMessage(ev));
    }).catch((error) => {
      removeDom()
      this._transaction?.callback({ status: "error", error: `Unable to initiate: ${error.detail}` });
    });
  }

  private generatePaymentLink = async () => {
    return this.initiatePayment(true).then((response) => {
      return { url: `${!this._transaction?.live ? TESTFRAMEURL : LIVEFRAMEURL}/?code=${response.data.accesscode}`, expires: response.data.expirydate, code: response.data.accesscode };
    }).catch(() => { });;
  }

  private initiatePayment = async (isPaymeLink = false) => {
    try {
      const { amount, customer, publicKey, ref, description, live } = this._transaction;
      const txnParams: InitiateTransactionPayload = {
        amount,
        publicKey,
        transactionReference: ref,
        payerEmail: customer.email,
        payerName: customer.firstname + ' ' + customer.lastname,
        purpose: description,
        isPaymeLink
      }

      return initiateTransaction(txnParams, live);
    } catch (error) {
      throw error;
    }
  }

  private handleDomMessage = (ev: MessageEvent<any>) => {
    const frameUrl = this._transaction?.live ? LIVEFRAMEURL : TESTFRAMEURL;
    if (ev.origin === frameUrl) {
      let frameData = JSON.parse(ev.data);
      if (frameData) {
        if (frameData.event === 'close') {
          this._transaction?.onClose()
          removeDom()
        } else {
          if (!this._transaction) return;
          const { customer, currency, description, amount, meta, ref } = this._transaction;
          frameData = {
            customer,
            currency,
            amount,
            meta,
            description,
            reference: ref,
            ...frameData,
          }
          this._transaction?.callback(frameData);
          removeDom()
        }
      }
      window.removeEventListener('message', this.handleDomMessage)
    }
  };

  public static initiateTransaction = async (tranasaction: Transaction) => {
    const fbnCheckout = new FBNCheckout(tranasaction);
    fbnCheckout.initiateTransaction();
  }

  public static getPaymeLink = async (tranasaction: Transaction) => {
    const fbnCheckout = new FBNCheckout(tranasaction);
    return fbnCheckout.generatePaymentLink();
  }
}

export default FBNCheckout;