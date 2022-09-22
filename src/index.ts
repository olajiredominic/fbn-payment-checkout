import { addPaymentFrame, createDom, initiateTransaction, validatePayment } from "./functions/helpers"
import { InitiateTransactionPayload, Transaction } from "./types"

class FBNCheckout {
  private _transaction?:Transaction;
  private dom?:HTMLElement;

  constructor(transaction:Transaction){
   try {
    validatePayment(transaction);
    this.initiateTransaction(transaction)
   } catch (error) {
    this._transaction?.callback({status:"error", error});
   }

    this.initiateTransaction(transaction)
  }

  private initiateTransaction = async({ amount,customer,publicKey, ref  }:Transaction)=>{
    const txnParams:InitiateTransactionPayload = { 
      amount,
      publicKey,
      transactionReference: ref,
      payerEmail: customer.email
    }
    initiateTransaction(txnParams).then((response)=>{
      const dom = createDom();
      addPaymentFrame(dom,response.data.accesscode, this._transaction?.live);
      window.addEventListener('message', this.handleDomMessage);
    })
 }

  private handleDomMessage = (ev:MessageEvent<any>) => {
    const frameUrl = this._transaction?.live ? process.env.LIVEFRAMEURL : process.env.TESTFRAMEURL;
    if (ev.origin === frameUrl) {
      let frameData = JSON.parse(ev.data);
      if (frameData) {
        if (frameData.event === 'close') {
          this._transaction?.onClose()
        } else {
          if(!this._transaction) return;
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
        }
      }
      window.removeEventListener('message', this.handleDomMessage)
    }
  };
}

export default FBNCheckout;