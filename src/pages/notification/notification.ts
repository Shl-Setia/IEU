import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { AlertPage } from '../alert/alert';
import { RegisterPage } from '../register/register';
import { RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { TranslateService } from '@ngx-translate/core';
import { HTTP } from '@ionic-native/http';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// Announcements

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  //private URL = 'http://localhost:8100/api/Values/GetRecord'; // this is used for web/dev testing
  private URL = 'http://ieu.viennaadvantage.com/api/Values/GetRecord'; // this is used for testing on actual device. When change the URL, restart the server, ionic serve  
  
  items = null;
  result = false;
  sessionId;
  
   constructor(public navCtrl: NavController, public navParams: NavParams,
              private platform: Platform, public http: HTTP, 
              private toastCtrl: ToastController,  private storage: Storage,
              private translate: TranslateService) {
                
    
    //this.navCtrl.setRoot(NotificationPage);
    this.storage.get('SESSION_ID').then((sid) => {
      this.sessionId = sid;
    });

    this.storage.get('USER_TYPE').then((val) => {
      console.log('USER_TYPE', val);
      if('Member' === val){
        this.fetchNotifications();
      }
     });
    //  this.result = true;
    //  this.items = [
    //   { "NAME": "Testing22", "SUBJECT": "Testing22", "MESSAGE": "This is test <a href='https://www.google.com'> Check this </a> https://www.google.com", "DOCUMENTNO": "1000015", "UPDATED": "2018-08-31"},
    //  ];
  }

  goToHomePage(){
    this.navCtrl.setRoot(HomePage);
  }
  logout(){
    this.storage.clear();
    this.goToHomePage();
  }

  goToOtherPage(page) {
    if('register' === page){
      this.navCtrl.push(RegisterPage);
    }else if('alert' === page){
      this.navCtrl.push(AlertPage);
    }
  }

async fetchNotifications(){
    //selectQuery=Select+*+FROM+OfficeMemo&accessKey=caff4eb4fbd6273e37e8a325e19f0991
    //SELECT+NAME+,+SUBJECT+,+MESSAGE+,+DOCUMENTNO+FROM+OFFICEMEMO+WHERE+isactive+=+'Y'+AND+CREATED+BETWEEN+ADD_MONTHS(SYSDATE,-4)+AND+SYSDATE+ORDER+BY+OFFICEMEMO_ID+DESC
    // var myHeaders = new Headers(); 
    // myHeaders.set('Access-Control-Allow-Origin', '*');  
    // var myParams = new URLSearchParams();
    // var queryString1 = 'SELECT+NAME+,+SUBJECT+,+MESSAGE+,+DOCUMENTNO+FROM+OFFICEMEMO+WHERE+isactive+=+\'';
    // var queryString2 = queryString1.concat('Y');
    // var queryString3 = queryString2.concat('\'');
    // var queryString4 = queryString3.concat('+AND+CREATED+BETWEEN+ADD_MONTHS(SYSDATE,-4)+AND+SYSDATE+ORDER+BY+OFFICEMEMO_ID+DESC');
    // console.log(queryString4);
    //var queryString4 = 'select * from ieu01_announcement_V';
    // myParams.set('selectQuery', queryString4);
    // myParams.set('accessKey', 'caff4eb4fbd6273e37e8a325e19f0991');
    // myParams.set('_session_ID', '1010031');		// bind it
    // var options = new RequestOptions({ headers: myHeaders, params: myParams });

//http://138.201.234.234:4955/api/Values/GetRecord?selectQuery=select%20*%20from%20ieu01_announcement_V&accessKey=caff4eb4fbd6273e37e8a325e19f0991&_session_ID=1010031

    let query = 'select%20*%20from%20ieu01_announcement_V';

    this.http.setHeader('*', 'Access-Control-Allow-Origin', '*');
    this.http.setDataSerializer('json');

    let url1 = this.URL + '?_session_ID='+this.sessionId+'&accessKey=e3d1cbebc50a1f278b2a2f6a4cce2770&selectQuery='
    let url2 = url1 + query;
    console.log(url2);

    this.http.get(url2, {}, {})
    .then( res => {
      console.log(res);
      let data = JSON.parse(res.data);
      console.log(data);
      if(data.length > 0){
        this.result = true;
        this.items = data;
      }else{
        this.translate.get('ERROR').subscribe(value => {
          // value is our translated string
          let alertTitle = value;
          this.presentToast(alertTitle);
        })
        console.log('No Notification found!');
      }
    }).catch( err => {
      this.translate.get('ERROR').subscribe(value => {
        // value is our translated string
        let alertTitle = value;
        this.presentToast(alertTitle);
      })
      console.log('Error while fetching Notifications!');
    })


    // this.http.get(this.URL, options)        // use this whilte testing in browser, this use proxy
    //   .map(res => res.json())
    //           .subscribe(
    //             data => {
    //               console.log(data);
    //               if(data.length > 0){
    //                 this.result = true;
    //                 this.items = data;
    //               }else{
    //                 this.translate.get('ERROR').subscribe(value => {
    //                   // value is our translated string
    //                   let alertTitle = value;
    //                   this.presentToast(alertTitle);
    //                 })
    //                 console.log('No Notification found!');
    //               }
    //             },
    //             err => {
    //               this.translate.get('ERROR').subscribe(value => {
    //                 // value is our translated string
    //                 let alertTitle = value;
    //                 this.presentToast(alertTitle);
    //               })
    //               console.log('Error while fetching Notifications!');
    //             });
  }

  presentToast(msg : string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }


}
