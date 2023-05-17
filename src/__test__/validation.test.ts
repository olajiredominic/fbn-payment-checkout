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
    
    const txn:Transaction = {
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
      callback: ()=>null,
      onClose:  ()=>null,
      options: ["QR", "CARD","WALLET","PAYATTITUE"]
    }

    process.env.MINAMOUNT = 100;
    process.env.MAXAMOUNT = 100000;
    
    try {
      txn.customer.email = "";
      validatePayment(txn)
    } catch (error) {
      expect(error).toMatchObject({ error: "Please provide a valid customer email", field: "email"});
    }

    try {
      txn.ref = "";
      validatePayment(txn)
    } catch (error) {
      expect(error).toMatchObject({ error: `Please provide a unique reference for this tranasaction`, field: 'reference'});
    }
    
    try {
      txn.publicKey = "";
      validatePayment(txn)
    } catch (error) {
      expect(error).toMatchObject({ error: `Please provide your public key`, field: 'publicKey'});
    }
  });
  
  test('Test minimum and maximum amount', () => {
    const txn:Transaction = {
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
      callback: ()=>null,
      onClose:  ()=>null,
      options: ["QR", "CARD","WALLET","PAYATTITUE"]
    }

    process.env.MINAMOUNT = 100;
    process.env.MAXAMOUNT = 100000;

    try {
      txn.amount = 1;
      validatePayment(txn)
    } catch (error) {
      expect(error).toMatchObject({ error: `Amount cannot be less then ${process.env.MINAMOUNT}`, field: 'amount'});
    }
    
    try {
      txn.amount = 1000;
      validatePayment(txn)
    } catch (error) {
      expect(error).toMatchObject({ error: `Amount cannot be greater then ${process.env.MAXAMOUNT}`, field: 'amount'});
    }
  });
  
  test('True is returned when required Fields are passed correctly', () => {
      
  const txn:Transaction = {
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
    callback: ()=>null,
    onClose:  ()=>null,
    options: ["QR", "CARD","WALLET","PAYATTITUE"]
  }
    expect(validatePayment(txn)).toBe(true);
  
  });
});