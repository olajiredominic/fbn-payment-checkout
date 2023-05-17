# FirstBillsPay JS Checkout.

## NPM Package to Integrate FirstBank's FirstBillsPay Checkout to JS Web Applications.

This repository is currently under development. Please dont use for production applications.

## Installation

To install this application, you can run:

### `npm i payment-checkout`

## Usage

To use the checkout, initiate a payment by running
```
import FBNChecheckout from 'payment-checkout'; 

... Function 

const initiatePayment = ()=>{
   
  const txn = {
    live: false,
    ref: "unique_txn_ref21", // Unique translation reference compulsory
    amount: 100, // transaction amount compulsory
    customer: {
      firstname: "firstname",
      lastname: "lastname",
      email: "test@mail.com", // Customer email compulsory
      id: "customer id",
    },
    fees: [
        {
          amount: 233,
          label:"Label"
        }
    ],
    meta: {},
    publicKey: "lv-pk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Merchant public key from your dashboard compulsory
    description: "Payment description",
    currency: "NGN",
    callback: (res)=>console.log(res), // Your callback function
    onClose:  ()=>console.log("onclose"), // Your onclose function
    options: ["QR", "CARD","WALLET","PAYATTITUE"]
  };

  FBNChecheckout.initiateTransaction(txn); // initiates the payment
}

```
To get a payme link that can be used for payment at a later time.
```
import FBNChecheckout from 'payment-checkout'; 

... Function 

const initiatePayment = ()=>{
   
  const txn = {
    live: false,
    ref: "unique_txn_ref21", // Unique translation reference compulsory
    amount: 100, // transaction amount compulsory
    customer: {
      firstname: "firstname",
      lastname: "lastname",
      email: "test@mail.com", // Customer email compulsory
      id: "customer id",
    },
    fees: [
        {
          amount: 233,
          label:"Label"
        }
    ],
    meta: {},
    publicKey: "lv-pk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Merchant public key from your dashboard compulsory
    description: "Payment description",
    currency: "NGN",
    callback: (res)=>console.log(res), // Your callback function
    onClose:  ()=>console.log("onclose"), // Your onclose function
    options: ["QR", "CARD","WALLET","PAYATTITUE"]
  };

  await FBNChecheckout.getPaymeLink(txn); // async function that returns a payme link
}

```

### API Description 

| Key | Value | Composulsory | Description
| --- | --- | --- | --- |
| live |  boolean | false | If the environment is live. Defaults to false. |
| ref | string | true | Unique reference for this transaction. |
| amount | float | true | Amount to be charged.  |
| customer | object | true | Basic information about the paying customer. Email is compulsory. |
| fees | object | false | Fees breakdown for the transaction.  Array of { label:string, amount: double } whose amount sums up to the main amount provided.  |
| meta | object | false | Object of key value pair to be returned on callback and passed to webhooks. |
| publicKey | string | true | Your public key from your dashboard compulsory |
| description | string | false | Description of the transaction. |
| currency | string | false | Currency to be debited. Defaults to "NGN"|
| callback | string | true | Callback function for on success or failure of the transaction. Resolves onsuccess. Rejects on error |
| onClose | string | false | Callback function when payment frame is closed before transaction completes. Only options activated on your dashboard can be used|


## Learn More

You can learn more in the [By reaching out to the development team]().