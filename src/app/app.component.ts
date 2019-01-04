import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization';

import { HomePage } from '../pages/home/home';
import { NotificationPage } from '../pages/notification/notification';
import { LangChangeEvent } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase';
import { AlertPage } from '../pages/alert/alert';
import { AlertStudentPage } from '../pages/alert-student/alert-student';
import { QrScannerPage } from '../pages/qr-scanner/qr-scanner';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;
  defaultLang = 'en';
  @ViewChild('myNav') nav : NavController;

  constructor(platform: Platform, statusBar: StatusBar, translate: TranslateService,
    private storage: Storage, firebase: Firebase, private localNotifications: LocalNotifications,
    private globalization: Globalization) {

    // this.storage.get('loginSuccessForUser').then((val) => {
    //  if(val === 'true'){
    //   this.rootPage = NotificationPage;
    //   //this.rootPage = HomePage;
    //  }else{
    //    this.rootPage = HomePage;
    //  }
    // });
    this.rootPage = HomePage;
    

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('en');

      // select language from device locale
      //translate.use('en');
      if ((<any>window).cordova) {
        globalization.getPreferredLanguage().then(result => {
          console.log(`globalization.getPreferredLanguage = ` + result.value);
          var language = result.value.substring(0, 2).toLowerCase();
          if(language == 'ar'){
            translate.use('ar');
            platform.setDir('rtl', true);
            platform.setDir('ltr', false);
          }else{
            translate.use(this.defaultLang);
            platform.setDir('ltr', true);
            platform.setDir('rtl', false);
          }
          
        });
      } else {
        //let browserLanguage = translate.getBrowserLang() || defaultLanguage;   
        translate.use(this.defaultLang);
        platform.setDir('ltr', true);
        platform.setDir('rtl', false);
      }

      // //this is to determine the text direction depending on the selected language
      // translate.onLangChange.subscribe((event: LangChangeEvent) => {
      //   console.log(`LangChangeEvent fired ` + event.lang);
      //   if (event.lang == 'ar') {
      //     platform.setDir('rtl', true);
      //     platform.setDir('ltr', false);
      //     //translate.use('ar');
      //   }
      //   else {
      //     platform.setDir('ltr', true);
      //     platform.setDir('rtl', false);
      //     //translate.use('en');
      //   }
      // });

      

      // exit app when click back button
      platform.registerBackButtonAction(() => {
        platform.exitApp();
      });

      this.localNotifications.clearAll(); // clear all notification

      // this when user has already log in and app is killed and then again relaunching
      this.storage.get('LOGIN_SUCCESS').then(sucess =>{
        if(sucess === true){
          console.log(`app relaunching `);
          this.storage.get('USER_TYPE').then(user =>{
            console.log(`app relaunching user ` + user);
            switch(user) { 
              case "Student": { 
                this.rootPage = AlertStudentPage;
                 break; 
              } 
              case "Member": { 
                this.storage.get('lastNotificationType').then(nType => {
                  this.storage.remove('lastNotificationType');
                  if(nType){
                    if(nType === 'notification'){
                      this.rootPage = NotificationPage;
                    }else if(nType === 'alert'){
                      this.rootPage = AlertPage;
                    }else{
                      this.rootPage = NotificationPage; 
                    }
                  }else{ // end of ntype check
                    this.rootPage = NotificationPage; 
                  }   
                }).catch(err =>{
                  this.rootPage = NotificationPage; 
                });
                 break; 
              } 
              case "Employee": {
                this.rootPage = QrScannerPage;
                 break;    
              } 
              case "Organization": { 
                this.rootPage = QrScannerPage;
                 break; 
              }  
              default: { 
                this.rootPage = HomePage;
                 break;              
              } 
            }// end of switch
            //console.log(`app relaunching final root page ` + this.rootPage);
          }); // end of get user
        } // end of login success
        
      });// end of get login


     //Subscribe on pause
     platform.pause.subscribe(() => {  
      console.log(`app pause`);
    });

    //Subscribe on resume
    // this when app is in background/memory/stack and is not killed and user come back to app
    platform.resume.subscribe(() => {
      console.log(`app resume`);
      this.localNotifications.clearAll();
      this.storage.get('LOGIN_SUCCESS').then(sucess =>{
        if(sucess === true){
          this.storage.get('USER_TYPE').then(user =>{
            if('Member' === user){
              this.storage.get('lastNotificationType').then(nType => {
                console.log(`notification type : ` + nType);
                if(nType){
                  this.storage.remove('lastNotificationType');
                  this.localNotifications.clearAll();
                  if(nType === 'notification'){
                    //this.rootPage = NotificationPage;
                    this.nav.push(NotificationPage);
                  }else if(nType === 'alert'){
                    //this.rootPage = AlertPage;
                    this.nav.push(AlertPage);
                  }
                }else{
                  this.nav.push(NotificationPage);
                }
                
              });
            } else if('Student' === user){
              this.nav.push(AlertStudentPage);
            }
          })
        }
      });
    });
  
    

    firebase.hasPermission().then(data => console.log('firbase has permission :' + data.isEnabled));

      firebase.onTokenRefresh()
        .subscribe((token: string) => {
          console.log(`Got a new token ${token}`);
          this.storage.set('fcmDeviceToken', token);
          firebase.grantPermission();
        });

       //firebase.subscribe("va-ieu-notification"); 
       // When fcm notification is opened from notification bar
       firebase.onNotificationOpen().subscribe(data => {
          console.log(data);
          this.storage.set('lastNotificationType', data.type);
          this.localNotifications.getAll().then(value => console.log(value))
          this.localNotifications.clearAll();
       }, err => {
        console.log(err);
       });

      

    });


  }
}
