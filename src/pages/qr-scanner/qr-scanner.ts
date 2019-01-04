import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import {BarcodeScanner, BarcodeScannerOptions} from '@ionic-native/barcode-scanner'
import { RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { EncriptionDecriptionProvider } from '../../providers/encription-decription/encription-decription';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
import { HTTP } from '@ionic-native/http';


/**
 * Generated class for the QrScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qr-scanner',
  templateUrl: 'qr-scanner.html',
})
export class QrScannerPage {

   //private URL = 'http://localhost:8100/api/Values/GetRecord'; // this is used for web/dev testing
   private URL = 'http://ieu.viennaadvantage.com/api/Values/GetRecord'; // this is used for testing on actual device. When change the URL, restart the server, ionic serve  
 
  options : BarcodeScannerOptions;
  barCodeResult : {};
  appData = null;
  memData = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private barCodeScanner : BarcodeScanner, public http: HTTP,
     private toastCtrl: ToastController, private platform: Platform,
    private cryptoWrapper : EncriptionDecriptionProvider, private network: Network,
    private storage: Storage, private translate: TranslateService) {
    
      this.platform.ready().then(() => {
        this.platform.registerBackButtonAction(() => {
          this.platform.exitApp();
        });
      });

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad QrScannerPage');
  }

  goToHomePage(){
    this.navCtrl.popToRoot();
  }

  presentToast(msg : string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

  scanBarCodeWrapper(){
    //this.presentToast(this.cryptoWrapper.encrypt());
    this.clearAppData();
    this.storage.get('USER_TYPE').then((user) => {
      if(this.network.type === 'none' && 'Organization' === user){
        // if offline and user is Organization, do not scan. Employee can scan offline/online
        this.presentToast('Go online to scan qr code');
      }else{
        // if online, then get the value from server and display.
        this.scanBarCode();
      }
    });
    
    
    //this.invokeBackendToGetAppData('sss');

  }

  clearAppData(){
      this.appData = null;
      this.memData = null;
     //console.log(this.appData);
  }
  
  async scanBarCode() {
    this.options = {
      prompt : 'Aim the camera towards bar code'
    }
    // this.results = await this.barCodeScanner.scan(this.options); // this was for aync
    this.barCodeScanner.scan(this.options).then((barcodeData) => {
      this.barCodeResult = barcodeData;
      //this.presentToast(barcodeData.text);
      //var decryptText = this.cryptoWrapper.decrypt(barcodeData.text);
      // if(this.network.type === 'none'){
      //   // if offline, decrypt the QR code value and display.
      //   this.presentToast('Offline Processing');
      // }else{
      //   // if online, then get the value from server and display.
      //   this.invokeBackendToGetAppData(barcodeData.text);
      // }
      //console.log(barcodeData.text);
      //this.presentToast(barcodeData.text);
      let msg = this.cryptoWrapper.decrypt(barcodeData.text);
      console.log(msg);
      var splitted = msg.split(",");
      if(splitted[0] === 'Application'){
        this.appData = splitted;
      }else if(splitted[0] ==='Membership'){
        this.memData = splitted;
      }else {
        this.translate.get('ERROR').subscribe(value => {
          // value is our translated string
          let alertTitle = value;
          this.presentToast(alertTitle);
        })
      
      }    
     }, (err) => {
      this.translate.get('QR_CODE_NOT_VALID_ALERT').subscribe(value => {
        // value is our translated string
        let alertTitle = value;
        this.presentToast(alertTitle);
      })
     });
    
  }

  isEmpty(val){
    return (val === undefined || val == null || val.length <= 0) ? true : false;
  }

  invokeBackendToGetAppData(qrcode : string) {
    //var qrcode = '72ddfb75b9998afd77406df67630832e5ea89287444505f01f950a4502ecf3649d3a93ebfd0989948a4d67ed8bcae5ac1f4b62dfadf8acc34f597a0a81a4442d1c7714ab85f7c785d2a9d6965edde383e626e6ebc39f8af5fed83d5f303a5522';
    console.log(qrcode);
    if(this.isEmpty(qrcode)){
      return;
    }

    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setDataSerializer('json');

    //var myHeaders = new Headers(); 
    // myHeaders.set('Access-Control-Allow-Origin', '*');  
    // var myParams = new URLSearchParams();
    var queryString1 = 'Select+*+FROM+IEU01_PERSNLINFO+Where+IEU01_APPQRCODE+=+\'';
    var queryString2 = queryString1.concat(qrcode);
    var queryString3 = queryString2.concat('\'');
    console.log(queryString3);

    let url1 = this.URL + '/api/Values/GetRecord?_session_ID='+1010031+'&accessKey=e3d1cbebc50a1f278b2a2f6a4cce2770&selectQuery='
    let url2 = url1 + queryString3;
   
    this.http.get(url2, {}, {})
    .then(res => {
      console.log(res);
      let data = JSON.parse(res.data);
      console.log(data);
      if(data.length > 0){
        this.appData = data[0];
      }else{
        this.presentToast('Data not Found!')
      } 
    }).catch(err => {
      console.log(err);
      this.presentToast('Network or URL error!');
    })

    //myParams.set('selectQuery', 'Select+*+FROM+IEU01_PERSNLINFO+Where+IEU01_APPQRCODE+=+\'72ddfb75b9998afd77406df67630832e5ea89287444505f01f950a4502ecf3649d3a93ebfd0989948a4d67ed8bcae5ac1f4b62dfadf8acc34f597a0a81a4442d1c7714ab85f7c785d2a9d6965edde383e626e6ebc39f8af5fed83d5f303a5522\'');
    // myParams.set('selectQuery', queryString3);
    // myParams.set('accessKey', 'caff4eb4fbd6273e37e8a325e19f0991');		
    // var options = new RequestOptions({ headers: myHeaders, params: myParams });
      // this.http.get(this.URL, options)
      // .map(res => res.json())
      //         .subscribe(
      //           data => {
      //             console.log(data);
      //             if(data.length > 0){
      //               this.appData = data[0];
      //             }else{
      //               this.presentToast('Data not Found!')
      //             }         
      //           },
      //           err => {
      //             this.presentToast('Network or URL error!')
      //           });
  }

  logout(){
    this.storage.clear();
    this.navCtrl.setRoot(HomePage);
  }

}
