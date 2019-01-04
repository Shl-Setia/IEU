import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { QrScannerPage } from '../qr-scanner/qr-scanner';
import { AlertPage } from '../alert/alert';
import { RegisterPage } from '../register/register'
import { NotificationPage } from '../notification/notification'
import { AlertStudentPage } from '../alert-student/alert-student';
import { HTTP } from '@ionic-native/http';

import { RequestOptions, URLSearchParams, Headers } from '@angular/http';
//import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Platform } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Firebase } from '@ionic-native/firebase';
import { TranslateService } from '@ngx-translate/core';

import { EncriptionDecriptionProvider } from '../../providers/encription-decription/encription-decription';
import { Type } from '@angular/compiler/src/core';

//https://ionicframework.com/docs/api/platform/Platform/#is


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private loginForm: FormGroup;
  //private URL = 'http://localhost:8027'; // this is used for web/dev testing
  private URL = 'http://ieu.viennaadvantage.com';  // ip : 'http://138.201.234.234:4955'; // this is used for testing on actual device. When change the URL, restart the server, ionic serve  
  private options: BarcodeScannerOptions;
  barCodeResult: {};
  loginSuccessResponse: {};
  loginSuccess = false;
  SESSIONID;
  AD_USER_ID;
  AD_ROLE_ID;
  NAME;
  notificationAlreadyReceived = false;


  constructor(public navCtrl: NavController, public http: HTTP,
    private formBuilder: FormBuilder, private barCodeScanner: BarcodeScanner,
    private toastCtrl: ToastController, private storage: Storage,
    private network: Network,
    public backgroundMode: BackgroundMode, public platform: Platform,
    private localNotifications: LocalNotifications, public firebase: Firebase,
    private cryptoWrapper: EncriptionDecriptionProvider,
    private translate: TranslateService) {



    // this.storage.get('LOGIN_SUCCESS').then((loginSuccess) => {
    //   if(loginSuccess === true){
    //     console.log('alreay logged in!');
    //     this.storage.get('USER_TYPE').then((userType) => {
    //       console.log('and user type is ' + userType);
    //       // task 1 : save token to server 
    //       if(this.network.type != 'none'){
    //         this.storage.get('AD_USER_ID').then((user_id) => {
    //           this.saveFCMTokenToServer(user_id);
    //         });
    //        }
    //       // task 2 : check "lastNotificationType" from storage.
    //       // If lastNotificationType present, coming from notification click
    //       // else normal app launch

    //       this.storage.get('lastNotificationType').then(nType => {
    //         console.log('lastNotificationType is ' + nType);
    //         this.storage.remove('lastNotificationType');
    //         if(nType === 'notification'){
    //           console.log('open N ');
    //           this.gotoHomeAsPerAccessLevelIfSessionIsActive(userType, 'notification');
    //         }else if(nType === 'alert'){
    //           console.log('open A ');
    //           this.gotoHomeAsPerAccessLevelIfSessionIsActive(userType, 'alert');
    //         }else{
    //           console.log('open D ');
    //           this.gotoHomeAsPerAccessLevelIfSessionIsActive(userType, '');
    //         }
    //       }).catch(err => {
    //         // if key is not present, go to next screen with no target
    //         console.log('open D1 ');
    //         this.gotoHomeAsPerAccessLevelIfSessionIsActive(userType, '');
    //       });

    //     });
    //   }
    // });


    // backgroud mode
    // platform.ready().then(() => {


    //   this.backgroundMode.enable();

    //   // this.backgroundMode.setDefaults({ 
    //   //   title:  'IEU',
    //   //   text:   'IEU background tasks.'
    //   // });
    //   this.backgroundMode.setDefaults({ silent: true });

    //   this.backgroundMode.on('activate').subscribe(() => {
    //     console.log('backgroundMode activated');
    //     //this.presentToast('backgroundMode activated')
    //     this.backgroundMode.disableWebViewOptimizations();
    //     this.backgroundMode.overrideBackButton();
    //     this.backgroundMode.excludeFromTaskList();

    //     // hit backend server after 2 min and if there is any update then show notifcation



    //     this.notificationAlreadyReceived = false;
    //     if(this.notificationAlreadyReceived === false) {
    //       this.showNotification();
    //     }


    //   });

    // });

    // backgroud mode
    //   document.addEventListener('deviceready', function () {

    //     // Android customization
    //     // To indicate that the app is executing tasks in background and being paused would disrupt the user.
    //     // The plug-in has to create a notification while in background - like a download progress bar.
    //     this.backgroundMode.setDefaults({ 
    //         title:  'TheTitleOfYourProcess',
    //         text:   'Executing background tasks.'
    //     });

    //     // Enable background mode
    //     this.backgroundMode.enable();

    //     // Called when background mode has been activated
    //     this.backgroundMode.onactivate = function () {

    //         // Set an interval of 1 minutes
    //         setInterval(function () {

    //             // The code that you want to run repeatedly
    //             this.notificationAlreadyReceived = false;
    //             if(this.notificationAlreadyReceived === false) {
    //               this.showNotification();
    //             }

    //         }, 1*60*1000);
    //     }
    // }, false);

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      type: ['', Validators.required]
    });
    //this.loginForm.controls['username'].setValue('aaaaaaa');

  }

  // showNotification () {
  //   let b = Math.random();
  //   this.localNotifications.schedule({
  //     text: 'Helo world ' + b
  //   });

  //   this.notificationAlreadyReceived = true;
  // }

  goToOtherPage(page) {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    //  this.clickMessage = 'you rocks';
    console.log(page);
    if ('qr-scanner' === page) {
      this.navCtrl.push(QrScannerPage);
    } else if ('alert' === page) {
      this.navCtrl.push(AlertPage);
    } else if ('register' === page) {
      this.navCtrl.push(RegisterPage);
    } else if ('scan' === page) {
      //this.loginWithQRCode();
    } else if ('notification' === page) {
      this.navCtrl.push(NotificationPage);
    } else if ('alertStudent' === page) {
      this.navCtrl.push(AlertStudentPage);
    }
    else {
      //this.navCtrl.push(OtherPage,{
      // param1: this.username, param2: this.password});
    }

  }

  hardCodeLogin() {
    //this.storage.get('loginSuccess').then((val) => {
    //  console.log('loginSuccess', val);
    //});
    //console.log(this.loginForm.value);
    //console.log(atob("IkFEX0NMSUVOVF9JRCI6IDExLA0KCQkiQURfT1JHX0lEIjogMTEsDQoJCSJBRF9VU0VSX0lEIjogbnVsbCwNCgkJIkFERFJFU1MxIjogbnVsbCwNCgkJIkFERFJFU1MyIjogbnVsbCwNCgkJIkJQTkFNRSI6ICJ0ZXMwNjEyLTIiLA0KCQkiQ19CUF9HUk9VUF9JRCI6IG51bGwsDQoJCSJDX0JQX1NJWkVfSUQiOiBudWxsLA0KCQkiQ19CUF9TVEFUVVNfSUQiOiBudWxsLA0KCQkiQ19CUEFSVE5FUlNSX0lEIjogbnVsbCwNCgkJIkNfQlBBUlRORVJfSUQiOiBudWxsLA0KCQkiQ19CUEFSVE5FUl9MT0NBVElPTl9JRCI6IG51bGwsDQoJCSJDX0NBTVBBSUdOX0lEIjogMTAxLA0KCQkiQ19DSVRZX0lEIjogbnVsbCwNCgkJIkNfQ09VTlRSWV9JRCI6IDEwMCwNCgkJIkNfR1JFRVRJTkdfSUQiOiBudWxsLA0KCQkiQ19JTkRVU1RSWUNPREVfSUQiOiBudWxsLA0KCQkiQ19KT0JfSUQiOiBudWxsLA0KCQkiQ19MRUFEUVVBTElGSUNBVElPTl9JRCI6IG51bGwsDQoJCSJDX0xFQURfSUQiOiAxMDAwMTEzLA0KCQkiQ19QUk9KRUNUX0lEIjogbnVsbCwNCgkJIkNfUkVHSU9OX0lEIjogMTAyLA0KCQkiQ19TQUxFU1JFR0lPTl9JRCI6IG51bGwsDQoJCSJDSVRZIjogIk5KIiwNCgkJIkNPTlRBQ1ROQU1FIjogbnVsbCwNCgkJIkNSRUFURUJQIjogbnVsbCwNCgkJIkNSRUFURVBST0pFQ1QiOiBudWxsLA0KCQkiQ1JFQVRFUkVRVUVTVCI6IG51bGwsDQoJCSJDUkVBVEVEIjogIjIwMTctMTItMDZUMTA6NDM6MDMiLA0KCQkiQ1JFQVRFREJZIjogMTAwLA0KCQkiRFVOUyI6IG51bGwsDQoJCSJERVNDUklQVElPTiI6IG51bGwsDQoJCSJET0NVTUVOVE5PIjogIjEwMDAxMDIiLA0KCQkiRU1BSUwiOiAidGVzdDMzM0BtbS5jb20iLA0KCQkiRkFYIjogbnVsbCwNCgkJIkhFTFAiOiBudWxsLA0KCQkiSVNBQ1RJVkUiOiAiWSIsDQoJCSJMRUFEUkFUSU5HIjogbnVsbCw="));
    //console.log("IkFEX0NMSUVOVF9JRCI6IDExLA0KCQkiQURfT1JHX0lEIjogMTEsDQoJCSJBRF9VU0VSX0lEIjogbnVsbCwNCgkJIkFERFJFU1MxIjogbnVsbCwNCgkJIkFERFJFU1MyIjogbnVsbCwNCgkJIkJQTkFNRSI6ICJ0ZXMwNjEyLTIiLA0KCQkiQ19CUF9HUk9VUF9JRCI6IG51bGwsDQoJCSJDX0JQX1NJWkVfSUQiOiBudWxsLA0KCQkiQ19CUF9TVEFUVVNfSUQiOiBudWxsLA0KCQkiQ19CUEFSVE5FUlNSX0lEIjogbnVsbCwNCgkJIkNfQlBBUlRORVJfSUQiOiBudWxsLA0KCQkiQ19CUEFSVE5FUl9MT0NBVElPTl9JRCI6IG51bGwsDQoJCSJDX0NBTVBBSUdOX0lEIjogMTAxLA0KCQkiQ19DSVRZX0lEIjogbnVsbCwNCgkJIkNfQ09VTlRSWV9JRCI6IDEwMCwNCgkJIkNfR1JFRVRJTkdfSUQiOiBudWxsLA0KCQkiQ19JTkRVU1RSWUNPREVfSUQiOiBudWxsLA0KCQkiQ19KT0JfSUQiOiBudWxsLA0KCQkiQ19MRUFEUVVBTElGSUNBVElPTl9JRCI6IG51bGwsDQoJCSJDX0xFQURfSUQiOiAxMDAwMTEzLA0KCQkiQ19QUk9KRUNUX0lEIjogbnVsbCwNCgkJIkNfUkVHSU9OX0lEIjogMTAyLA0KCQkiQ19TQUxFU1JFR0lPTl9JRCI6IG51bGwsDQoJCSJDSVRZIjogIk5KIiwNCgkJIkNPTlRBQ1ROQU1FIjogbnVsbCwNCgkJIkNSRUFURUJQIjogbnVsbCwNCgkJIkNSRUFURVBST0pFQ1QiOiBudWxsLA0KCQkiQ1JFQVRFUkVRVUVTVCI6IG51bGwsDQoJCSJDUkVBVEVEIjogIjIwMTctMTItMDZUMTA6NDM6MDMiLA0KCQkiQ1JFQVRFREJZIjogMTAwLA0KCQkiRFVOUyI6IG51bGwsDQoJCSJERVNDUklQVElPTiI6IG51bGwsDQoJCSJET0NVTUVOVE5PIjogIjEwMDAxMDIiLA0KCQkiRU1BSUwiOiAidGVzdDMzM0BtbS5jb20iLA0KCQkiRkFYIjogbnVsbCwNCgkJIkhFTFAiOiBudWxsLA0KCQkiSVNBQ1RJVkUiOiAiWSIsDQoJCSJMRUFEUkFUSU5HIjogbnVsbCw=".length);
    if (this.loginForm.value.username === 'ieuadmin' && this.loginForm.value.password === 'ieuadmin!23') {
      //this.storage.set('loginSuccessForAdmin', 'true');
      //this.storage.set('loginSuccessForUser', 'true');
      this.goToOtherPage('qr-scanner');
      //this.goToOtherPage('notification');
    } else {
      this.presentToast('Login falied! Either Name or Passowrd incorrect.');
    }
  }

  login() {
    console.log(this.loginForm.value);

    // var myParams = new URLSearchParams();
    // var queryString1 = 'Select+*+FROM+AD_User+Where+NAME+=+\'';
    // var queryString2 = queryString1.concat(this.loginForm.value.username);//IdeasIncAdmin
    // var queryString3 = queryString2.concat('\'');
    // var queryString4 = queryString3.concat('+and+PASSWORD+=+\'');
    // var queryString5 = queryString4.concat('9324597e06472b19ccfc16b0d5c844a8');
    // var queryString6 = queryString5.concat('\'');
    // console.log(queryString6);

    // myParams.set('selectQuery', queryString6);
    // myParams.set('accessKey', 'caff4eb4fbd6273e37e8a325e19f0991');		
    // var options = new RequestOptions({ headers: myHeaders, params: myParams });
    //   this.http.get(this.URL, options)        // use this whilte testing in browser, this use proxy
    //   //this.http.get(this.URL, options)        // this is actual url. // When you change the URL, restart the server
    //   .map(res => res.json())
    //           .subscribe(
    //             data => {
    //               console.log(data);
    //               if(data.length > 0){
    //                 this.memberData = data[0];
    //                 this.loginSuccess = true;
    //                 this.goToOtherPage('qr-scanner');
    //               }else{
    //                 this.presentToast('Login falied! Either Name or Passowrd incorrect.');
    //               }
    //             },
    //             err => {
    //               this.presentToast('Login falied! Network error or wrong URL.');
    //             });


    // let data = {
    //   'userName': 'mh_dgr@yahoo.com',
    //   'password': 'vienna',
    //   'accessKey': 'caff4eb4fbd6273e37e8a325e19f0991'
    // };

    var data = {
      'userName': this.loginForm.value.username,
      'password': this.loginForm.value.password,
      'accessKey': 'e3d1cbebc50a1f278b2a2f6a4cce2770'
    }

    // var headers = {
    //   'Access-Control-Allow-Origin': '*',
    //   'Content-Type': 'application/json'
    // };

    //myHeaders.set('Access-Control-Allow-Origin', '*');  
    //myHeaders.set('Content-Type', 'application/json');
    //var options = new RequestOptions({ headers: myHeaders});

    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setDataSerializer('json');

    //first step is to call login api
    this.http.post(this.URL + '/api/Values/Login', data, {})
      .then(res => {
        console.log(res);
        console.log("got response while login");
        var data = JSON.parse(res.data);
        console.log(data);
        if (data.length > 0) {
          this.loginSuccessResponse = data[0];
          console.log(this.loginSuccessResponse);
          this.AD_USER_ID = data[0].AD_USER_ID;
          this.AD_ROLE_ID = data[0].AD_ROLE_ID;
          this.NAME = data[0].NAME;
          //console.log(this.AD_ROLE_ID);
          this.loginSuccess = true;
          //if login is success, call initSession api
          this.initSessionMethod(this.AD_ROLE_ID, this.AD_USER_ID);
        } else {
          console.log("got response while login (else)");
          this.translate.get('LOGIN_FAIL_ALERT').subscribe(value => {
            // value is our translated string
            let alertTitle = value;
            this.presentToast(alertTitle);
          })

        }
      }
      ).catch(err => {
        console.log("got error while login");
        console.log(err);
        console.log(err.error);
        this.translate.get('LOGIN_FAIL_ALERT').subscribe(value => {
          // value is our translated string
          let alertTitle = value;
          this.presentToast(alertTitle);
        })
      });

  }


  initSessionMethod(ad_role_id: string, ad_user_id: string) {

    var data = {
      "AD_Client_ID": 1000005,
      "AD_Org_ID": 1000008,
      "AD_User_ID": ad_user_id,//1207303,
      "AD_Role_ID": ad_role_id,//1000119,
      "accessKey": "e3d1cbebc50a1f278b2a2f6a4cce2770",
      "remoteHost": "http://ieu.viennaadvantage.com/service.asmx"
    }

    // var myHeaders = new Headers();
    // myHeaders.set('Access-Control-Allow-Origin', '*');
    // myHeaders.set('Content-Type', 'application/json');
    // var options = new RequestOptions({ headers: myHeaders });
    //if login is success, call initSession api

    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setDataSerializer('json');

    this.http.post(this.URL + '/api/Values/InitSession', data, {})
      .then(res => {
        console.log(res);
        var data = JSON.parse(res.data);
        console.log(data);
        if (data) {
          this.SESSIONID = data;
          console.log(this.SESSIONID);
          //if session id is created, check the Type of user
          this.verifyTypeOfUser();
        } else {
          this.presentToast('Session falied! Data incorrect.');
        }
      }).catch(err => {
        this.presentToast('Session falied! Network error or wrong URL.');
      });

       // Now i have AD_user_id, save FCM token id to server
      //this.saveFCMTokenToServer(ad_user_id);

    // this is angular http client
    // this.http.post(this.URL + '/api/Values/InitSession', JSON.stringify(data), options)
    // .map(res => res.json()).subscribe(
    //   data => {
    //     console.log(data);
    //     if(data){
    //       this.SESSIONID = data;
    //       console.log(this.SESSIONID);
    //       //if session id is created, check the Type of user
    //       this.verifyTypeOfUser();
    //     }else{
    //       this.presentToast('Session falied! Data incorrect.');
    //     }
    //   },
    //   err => {
    //     this.presentToast('Session falied! Network error or wrong URL.');
    //   }
    // );

  }

  saveFCMTokenToServer(ad_user_id: string) {
    this.getFCMToken(ad_user_id);
  }

  getFCMToken(ad_user_id: string) {
    console.log('task -> get fcm token and save at server for ad_user_id ' + ad_user_id);
    this.firebase.getToken()
      .then(token => {
        console.log(`The token is ${token}`);
        this.storage.set('fcmDeviceToken', token);
        var data = {
          "tableName": "AD_User",
          "colName": ["VA050_DeviceToken"],
          "values": [token],
          "record_ID": ad_user_id,//1207303,
          "accessKey": "e3d1cbebc50a1f278b2a2f6a4cce2770",
          "_session_ID": this.SESSIONID
        };

        console.log("going to save token ");
        this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
        this.http.setDataSerializer('json');
        this.http.post(this.URL + '/api/Values/UpdateRecord', data, {})
          .then(res => {
            console.log(res);
            let data = res.data;
            if (data) {
              console.log(`successfully saved fcm token` + data);
              //this.presentToast('Device token saved succefully.');
            } else {
              console.log(`Falied to save fcm token ` + data);
              //this.presentToast('Falied to save device token.');
            }
          }).catch(err => {
            console.log(`Falied to save fcm token ` + data);
          });

        var myHeaders = new Headers();
        myHeaders.set('Content-Type', 'application/json');
        var options = new RequestOptions({ headers: myHeaders })

        // this.http.post(this.URL + '/api/Values/UpdateRecord', JSON.stringify(data), options)
        // .map(res => res.json()).subscribe(
        //   data => {
        //     console.log(`token saved respose` + data);
        //     if(data){
        //       console.log(`toast for token` + data);
        //       //this.presentToast('Device token saved succefully.');
        //     }else{
        //       console.log(`Falied to save device token` + data);
        //       //this.presentToast('Falied to save device token.');
        //     }
        //   },
        //   err => {
        //     console.log(`Falied to save device token` + data);
        //     //this.presentToast('Falied to save device token.');
        //   }
        // );

      }) // save the token server-side and use it to push notifications to this device
      .catch(error => this.presentToast('Error getting token'));
  }

  verifyTypeOfUser() {

    switch (this.loginForm.value.type) {
      case "Student": {
        console.log("Student");
        this.verifyIfStudent();
        break;
      }
      case "Member": {
        console.log("Member");
        this.verifyIfMember();
        break;
      }
      case "Employee": {
        console.log("Employee");
        this.verifyIfEmployee();
        break;
      }
      case "Organization": {
        this.verifyIfOrganization();
        console.log("Organization");
        break;
      }
      default: {
        this.presentToast('User Type is invalid!');
        break;
      }
    }
  }

  verifyIfStudent() {
    var queryString1 = 'SELECT+name+FROM+IEU01_StudentVer_V+WHERE+ad_user_id+=+';
    var queryString2 = queryString1.concat(this.AD_USER_ID);
    console.log(queryString2);
    this.verifyUserHttpCall(queryString2)
  }

  verifyIfMember() {
    var queryString1 = 'SELECT+distinct(name)+FROM+IEU01_MemVer_V+WHERE+ad_user_id+=+';
    var queryString2 = queryString1.concat(this.AD_USER_ID);
    console.log(queryString2);
    this.verifyUserHttpCall(queryString2)
  }

  verifyIfEmployee() {
    var queryString1 = 'SELECT+name+FROM+IEU01_EmpVer_V+WHERE+ad_user_id+=+';
    var queryString2 = queryString1.concat(this.AD_USER_ID);
    console.log(queryString2);
    this.verifyUserHttpCall(queryString2)
  }

  verifyIfOrganization() {
    var queryString1 = 'SELECT+name+FROM+IEU01_OrgVer_V+WHERE+ad_user_id+=+';
    var queryString2 = queryString1.concat(this.AD_USER_ID);
    console.log(queryString2);
    this.verifyUserHttpCall(queryString2)
  }



  verifyUserHttpCall(qs: string) {

    // let params = {
    //   'selectQuery': qs,
    //   'accessKey': 'e3d1cbebc50a1f278b2a2f6a4cce2770',
    //   '_session_ID': '1025984'
    // };

    //var options = new RequestOptions({ params: myParams });
    //http://138.201.234.234:4955/api/Values/GetRecord?_session_ID=1010031&accessKey=caff4eb4fbd6273e37e8a325e19f0991&selectQuery=SELECT%2Bdistinct%28name%29%2BFROM%2BIEU01_MemVer_V%2BWHERE%2Bad_user_id%2B%3D%2B1207303
    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setDataSerializer('json');

    let url1 = this.URL + '/api/Values/GetRecord?_session_ID='+ this.SESSIONID + '&accessKey=e3d1cbebc50a1f278b2a2f6a4cce2770&selectQuery='
    let url2 = url1 + qs;
    console.log(url2);

    this.http.get(url2, {}, {}).then(res => {
      console.log(res);
      let data = JSON.parse(res.data);
      console.log(data);
      if (data.length > 0) {
        //this.presentToast('Goto next');
        this.saveFCMTokenToServer(this.AD_USER_ID);
        this.gotoHomeAsPerAccessLevel(this.loginForm.value.type);
      } else {
        this.presentToast('Invalid User!');
      }
    }).catch(err => {
      this.presentToast('Connection Error (verify User)!');
    });

    //  var myParams = new URLSearchParams();
    //  myParams.set('selectQuery', qs);
    //  myParams.set('accessKey', 'caff4eb4fbd6273e37e8a325e19f0991');
    //  myParams.set('_session_ID', '1010031');

    // this.http.get(this.URL + '/api/Values/GetRecord', options)
    // .map(res => res.json()).subscribe(
    //   data => {
    //     console.log(data);
    //     if(data.length > 0){
    //       //this.presentToast('Goto next');
    //       this.gotoHomeAsPerAccessLevel(this.loginForm.value.type);
    //     }else{
    //       this.presentToast('Invalid User!');
    //     }
    //   },
    //   err => {
    //     this.presentToast('Connection Error!');
    //   }
    // )
  }


  gotoHomeAsPerAccessLevel(userType: String) {

    switch (userType) {
      case "Student": {
        console.log("Student");
        this.storage.set('LOGIN_SUCCESS', this.loginSuccess);
        this.storage.set('SESSION_ID', this.SESSIONID);
        this.storage.set('AD_USER_ID', this.AD_USER_ID);
        this.storage.set('USER_TYPE', userType);
        this.loginForm.reset();
        this.goToOtherPage('alertStudent'); // Show application status only(Alert)
        break;
      }
      case "Member": {
        console.log("Member");
        this.storage.set('LOGIN_SUCCESS', this.loginSuccess);
        this.storage.set('SESSION_ID', this.SESSIONID);
        this.storage.set('AD_USER_ID', this.AD_USER_ID);
        this.storage.set('USER_TYPE', userType);
        this.loginForm.reset();
        this.goToOtherPage('alert'); // Show announcements(Notification) and application status(Alert)
        break;
      }
      case "Employee": {
        console.log("Employee");
        this.storage.set('LOGIN_SUCCESS', this.loginSuccess);
        this.storage.set('SESSION_ID', this.SESSIONID);
        this.storage.set('AD_USER_ID', this.AD_USER_ID);
        this.storage.set('USER_TYPE', userType);
        this.loginForm.reset();
        this.goToOtherPage('qr-scanner');
        break;
      }
      case "Organization": {
        console.log("Organization");
        this.storage.set('LOGIN_SUCCESS', this.loginSuccess);
        this.storage.set('SESSION_ID', this.SESSIONID);
        this.storage.set('AD_USER_ID', this.AD_USER_ID);
        this.storage.set('USER_TYPE', userType);
        this.loginForm.reset();
        this.goToOtherPage('qr-scanner');
        break;
      }
      default: {
        this.translate.get('ERROR').subscribe(value => {
          // value is our translated string
          let alertTitle = value;
          this.presentToast(alertTitle);
        })
        console.log('Error While loading Home Screen!');
        break;
      }
    }
  }


  gotoHomeAsPerAccessLevelIfSessionIsActive(userType: String, target: String) {

    switch (userType) {
      case "Student": {
        this.goToOtherPage('alertStudent'); // Show application status only(Alert)
        break;
      }
      case "Member": {
        console.log("userType : Member"); // Show announcements(Notification) and application status(Alert)
        console.log("target : " + target);
        if (target === 'notification') {
          console.log(" member-notification");
          this.goToOtherPage('notification');
        } else if (target === 'alert') {
          console.log(" member-alert");
          this.goToOtherPage('alert');
        } else {
          console.log(" member-alert- default");
          this.goToOtherPage('alert');
        }
        break;
      }
      case "Employee": {
        console.log("Employee");
        this.goToOtherPage('qr-scanner');
        break;
      }
      case "Organization": {
        console.log("Organization");
        this.goToOtherPage('qr-scanner');
        break;
      }
      default: {

        this.presentToast('Error While loading Home Screen!');
        break;
      }
    }
  }

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }

  async scanBarCodeAndLogin() {
    //this.goToOtherPage("notification");
    this.options = {
      prompt: 'Aim the camera towards bar code'
    }
    // this.results = await this.barCodeScanner.scan(this.options); // this was for aync
    this.loginForm.controls['username'].setValue("");
    this.loginForm.controls['password'].setValue("");
    this.barCodeScanner.scan(this.options).then((barcodeData) => {
      this.barCodeResult = barcodeData;
      console.log(this.barCodeResult);
      let msg = this.cryptoWrapper.decrypt(barcodeData.text);
      console.log(msg);
      this.loginWithQRCode(msg);
      //var splitted = msg.split(",");
      //console.log(splitted[6]);
      //this.loginForm.controls['username'].setValue(splitted[6]);
    }, (err) => {
      this.translate.get('QR_CODE_NOT_VALID_ALERT').subscribe(value => {
        // value is our translated string
        let alertTitle = value;
        this.presentToast(alertTitle);
      })
    });

  }


  loginWithQRCode(qrcode: string) {
    //qrcode = '2zGF//YujV6ooRHNvX9cxo2noLQ3hVsgNLflKPLkIyoQ3TI7SWlDen98zPBb4Gql2Za5DaNcp6VsHC0kX6hJ4qNwZKrTWDt7aTWHhsVb1ys=';
    console.log(qrcode);

    var queryString1 = 'Select+distinct(EMAIL)+FROM+IEU01_MEMQRCODE_V+Where+IEU01_MEMSHPQRCODE+=+\'';
    var queryString2 = queryString1.concat(qrcode);
    var queryString3 = queryString2.concat('\'');
    console.log(queryString3);

    // let params = {
    //   'selectQuery': queryString3,
    //   'accessKey': 'caff4eb4fbd6273e37e8a325e19f0991',
    //   '_session_ID': '1010031'
    // };

    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setDataSerializer('json');

    let url1 = this.URL + '/api/Values/GetRecord?_session_ID=1010031&accessKey=e3d1cbebc50a1f278b2a2f6a4cce2770&selectQuery='
    let url2 = url1 + queryString3;
    
    console.log(url2);
    this.http.get(url2, {}, {})
      .then(res => {
        console.log(res);
        let data = JSON.parse(res.data);
        console.log(data);
        if (data.length > 0) {
          console.log(data[0]);
          //this.storage.set('loginSuccessForUser', 'true');
          //this.goToOtherPage('notification'); // announcements
          this.loginForm.controls['username'].setValue(data[0].EMAIL);
        } else {
          this.translate.get('QR_CODE_NOT_VALID_ALERT').subscribe(value => {
            // value is our translated string
            let alertTitle = value;
            this.presentToast(alertTitle);
          })
        }
      }).catch(err => {
        console.log(err);
        this.translate.get('QR_CODE_NOT_VALID_ALERT').subscribe(value => {
          // value is our translated string
          let alertTitle = value;
          this.presentToast(alertTitle);
        })
        console.log('Failed to get user name from server!');
      });



    // var myHeaders = new Headers();
    // myHeaders.set('Access-Control-Allow-Origin', '*');
    // var myParams = new URLSearchParams();

    // //SELECT distinct(EMAIL) FROM IEU01_MEMQRCODE_V where IEU01_MEMSHPQRCODE=

    // myParams.set('selectQuery', queryString3);
    // myParams.set('accessKey', 'caff4eb4fbd6273e37e8a325e19f0991');
    // myParams.set('_session_ID', '1010031');
    // var options = new RequestOptions({ headers: myHeaders, params: myParams });
    // this.http.get(this.URL+ '/api/Values/GetRecord', options)        // use this whilte testing in browser, this use proxy
    // //this.http.get(this.URL, options)        // this is actual url. // When you change the URL, restart the server
    // .map(res => res.json())
    //         .subscribe(
    //           data => {
    //             console.log(data);
    //             if(data.length > 0){
    //               console.log(data[0]);
    //               //this.storage.set('loginSuccessForUser', 'true');
    //               //this.goToOtherPage('notification'); // announcements
    //               this.loginForm.controls['username'].setValue(data[0].EMAIL);
    //             }else{
    //               this.translate.get('QR_CODE_NOT_VALID_ALERT').subscribe(value => {
    //                 // value is our translated string
    //                 let alertTitle = value;
    //                 this.presentToast(alertTitle);
    //               })
    //             } 
    //           },
    //           err => {
    //             this.translate.get('QR_CODE_NOT_VALID_ALERT').subscribe(value => {
    //               // value is our translated string
    //               let alertTitle = value;
    //               this.presentToast(alertTitle);
    //             })
    //             console.log('Failed to get user name from server!');
    //           });
  } // end of method

} // end of class


// https://stackoverflow.com/questions/41161705/ionic-2-form-goes-up-when-keyboard-shows