import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
/*
  Generated class for the EncriptionDecriptionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EncriptionDecriptionProvider {

  constructor(public http: HttpClient) {
  }
  
encrypt(){
  var key = CryptoJS.enc.Utf8.parse('0123456789abcdef');
  var iv = CryptoJS.enc.Utf8.parse('0123456789abcdef');
  var message = '1000280,04/24/2018,New,0,Baghdad,نيها شارما';
  //var message = "1000213, 06-04-2018, 0101_Baghdad, Renewal, atul sharma, 100049, 1000213, 06-04-2018, 0101_Baghdad, Renewal, atul sharma, 100049";
  

  var encrypted = CryptoJS.AES.encrypt(message, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
  });
  console.log(message);
  console.log(encrypted);
  let encMsg = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  console.log(encMsg);
  //console.log(encrypted.toString());


  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(encMsg)
  });
  var decrypted = CryptoJS.AES.decrypt(cipherParams, key, { 
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
  
  console.log(decrypted)  
  console.log(decrypted.toString(CryptoJS.enc.Utf8));
  //this.decrypt(encrypted.toString());
  //return decrypted.toString(CryptoJS.enc.Base64);
}

decrypt(encryptedMsg){
  //bMqXp5g3O5fvb2cWSzN9ZM1zskGNystOpwI+PHtFNRxp4MGhvA51rFz6S4ZtypNhpFQTyNipTJQFnx6N3TBAKQ==
  //WQ8x720YBvWEyRibIZvHdmKZB24FbiOgG4ApLgz2ebscbxjPhFQExgWvhXaLWTj4BqCfxgex7Wmb+PBZxKkMT49epGd1XwSVm93joYMBCQQ=
  //6Bi/IvfJNBZFf73Ah1gIRoICs6pC5SenHygM2GeC0Enj8H1vG9jnjIjkYKTQ46gU
  console.log(encryptedMsg);
  var key = CryptoJS.enc.Utf8.parse('0123456789abcdef');
  var iv = CryptoJS.enc.Utf8.parse('0123456789abcdef');
 
  var cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(encryptedMsg)
  });
  var decrypted = CryptoJS.AES.decrypt(cipherParams, key, { 
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC
    });
console.log(decrypted);
var utf8String = decrypted.toString(CryptoJS.enc.Utf8)
console.log(utf8String); 
//var utf8ToBase64DecodeString = window.atob(utf8String);
//console.log(utf8ToBase64DecodeString);
return utf8String;
 
}















//   keySize = 256;
//   ivSize = 128;
//   iterations = 100;

//   message = "Hello World";
//   password = "Secret Password";

  

// encrypt2 (msg) {
//     var salt = CryptoJS.lib.WordArray.random(128/8);
    
//     var key = CryptoJS.PBKDF2(this.password, salt, {
//         keySize: this.keySize/32,
//         iterations: this.iterations
//       });
  
//     var iv = CryptoJS.lib.WordArray.random(128/8);
    
//     var encrypted = CryptoJS.AES.encrypt(msg, key, { 
//       iv: iv, 
//       padding: CryptoJS.pad.Pkcs7,
//       mode: CryptoJS.mode.CBC  
//     });
    
//     // salt, iv will be hex 32 in length
//     // append them to the ciphertext for use  in decryption
//     console.log(salt.toString());
//     console.log(iv.toString());
//     console.log(encrypted.toString());
//     var transitmessage = salt.toString()+ iv.toString() + encrypted.toString();
//     console.log(transitmessage);
//     console.log(transitmessage.length);
//     return transitmessage;
//   }

//   decrypt2 (transitmessage) {
//     var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
//     var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
//     var encrypted = transitmessage.substring(64);
//     console.log(transitmessage.substr(0, 32));
//     console.log(transitmessage.substr(32, 32));
//     console.log(encrypted);
    
//     var key = CryptoJS.PBKDF2(this.password, salt, {
//         keySize: this.keySize/32,
//         iterations: this.iterations
//       });
  
//     var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
//       iv: iv, 
//       padding: CryptoJS.pad.Pkcs7,
//       mode: CryptoJS.mode.CBC   
//     });
//     console.log(decrypted.toString(CryptoJS.enc.Utf8));
//     return decrypted;
//   }

}
