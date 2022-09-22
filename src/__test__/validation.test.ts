import { validatePayment } from '../functions/helpers';
import { Transaction } from '../types';
  
describe('Testing Validate Payment', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });
  
  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  
  test('error is returned when required fields are passed incorrectly', () => {
    
    let txn:Transaction = {
      live: false,
      ref: "unique_txn_ref",
      amount: 100,
      customer: {
        firstname: "firstname",
        lastname: "lastname",
        email: "test@mail.com",
        id: "customer id",
      },
      fees: [
          {
            amount: 233,
            label:"Label"
          }
      ],
      meta: {},
      publicKey: "Your_public_key",
      description: "Payment description",
      currency: "NGN",
      callback: ()=>{},
      onClose:  ()=>{},
      options: ["QR", "CARD","WALLET","PAYATTITUE"]
    }

    process.env.MINAMOUNT = 10;
    process.env.MAXAMOUNT = 200;
    
    txn.customer.email = "";
    expect(validatePayment(txn)).toMatchObject({ "error": "Please provide a valid customer email", "field": "email"});

    txn.ref = "";
    expect(validatePayment(txn)).toMatchObject({ error: `Please provide a unique reference for this tranasaction`, field: 'reference'});
    txn.publicKey = "";
    expect(validatePayment(txn)).toMatchObject({ error: `Please provide your public key`, field: 'publicKey'});
  });
  
  test('Test minimum and maximum amount', () => {
    let txn:Transaction = {
      live: false,
      ref: "unique_txn_ref",
      amount: 100,
      customer: {
        firstname: "firstname",
        lastname: "lastname",
        email: "test@mail.com",
        id: "customer id",
      },
      fees: [
          {
            amount: 233,
            label:"Label"
          }
      ],
      meta: {},
      publicKey: "Your_public_key",
      description: "Payment description",
      currency: "NGN",
      callback: ()=>{},
      onClose:  ()=>{},
      options: ["QR", "CARD","WALLET","PAYATTITUE"]
    }

    process.env.MINAMOUNT = 10;
    process.env.MAXAMOUNT = 200;
    
    txn.amount = 1;
    expect(validatePayment(txn)).toMatchObject({ error: `Amount cannot be less then ${process.env.MINAMOUNT}`, field: 'amount'});
    txn.amount = 1000;
    expect(validatePayment(txn)).toMatchObject({ error: `Amount cannot be greater then ${process.env.MAXAMOUNT}`, field: 'amount'});
  });
  
  test('True is returned when required Fields are passed correctly', () => {
      
  let txn:Transaction = {
    live: false,
    ref: "unique_txn_ref",
    amount: 100,
    customer: {
      firstname: "firstname",
      lastname: "lastname",
      email: "test@mail.com",
      id: "customer id",
    },
    fees: [
        {
          amount: 233,
          label:"Label"
        }
    ],
    meta: {},
    publicKey: "Your_public_key",
    description: "Payment description",
    currency: "NGN",
    callback: ()=>{},
    onClose:  ()=>{},
    options: ["QR", "CARD","WALLET","PAYATTITUE"]
  }
    expect(validatePayment(txn)).toBe(true);
  
  });
});