import { AESDecrypt, AESEncrypt } from '../functions/helpers';

describe('Testing Encryption', () => {
  
  test('Test Decrypt to be sure it actually decrypts using known ecrypted value', () => {
    const decryptedText = AESDecrypt( "Ip5EHe9X/tqd7Plhx5qeQsA2Hw53I1g0NpkVYwox1VQ=","notsomuchasecretorisitcantreally")
    expect(decryptedText).toBe("Wow! Actually works.");
  });
  
  test('Test Encrpyt to be sure it actually encrypt', () => {
    const encryptedText = AESEncrypt("Wow! Actually works.","notsomuchasecretorisitcantreally" )
    const decryptedText = AESDecrypt( encryptedText,"notsomuchasecretorisitcantreally")
    expect(decryptedText).toBe("Wow! Actually works.");
  });
});