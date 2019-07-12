import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {
  data = null;
  encryptSecretKey = 'elogist123';
  keySize = 256;
  ivSize = 128;
  params=[];
  iterations = 100;
  message = "Hello World";
  encrpyted = null;
  encryptedArray =[];
 
  constructor(
    // public encrypt: CryptoJS
  ) {

  }
  encryptData(data: string , publicKey) {

    try {
      console.log(data);
      // console.log(this.pubprivkey);
      console.log(CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString());
      this.encrpyted =this.encrypt(this.encryptSecretKey , publicKey);
      console.log("------>" ,this.encrpyted )
      this.encryptedArray[0]=this.encrpyted;
      this.encryptedArray[1] = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
      console.log("encrypted=====>", this.encryptedArray[0]);
      console.log("encrypted=====>", this.encryptedArray[1]);

      return this.encryptedArray;      
     
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(data , key ) {

    try {
      const bytes = CryptoJS.AES.decrypt(data, key);
      if (bytes.toString()) {
        console.log(JSON.parse(bytes.toString(CryptoJS.enc.Utf8)));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  } 

encrypt(data, pass){
  let salt = CryptoJS.lib.WordArray.random(128 / 8);

  let key = CryptoJS.PBKDF2(pass, salt, {
    keySize: this.keySize / 32,
    iterations: this.iterations
  });

  let iv = CryptoJS.lib.WordArray.random(128 / 8);

  let encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC

  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  let transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  console.log(transitmessage);
  return transitmessage;
}

decrypt(decrypt1, pass) {
  
  // console.log("Decypt-->" ,decrypt1);
  // console.log("Pass->>" , pass);
  let salt = CryptoJS.enc.Hex.parse(decrypt1.substr(0, 32));
  let iv = CryptoJS.enc.Hex.parse(decrypt1.substr(32, 32))
  let encrypted = decrypt1.substring(64);

  let key = CryptoJS.PBKDF2(pass, salt, {
    keySize: this.keySize / 32,
    iterations: this.iterations
  });

  let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC

  })
  console.log(decrypted.toString(CryptoJS.enc.Utf8));
  return decrypted.toString(CryptoJS.enc.Utf8);
}
}

